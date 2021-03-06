# Example S3 Project with Default Properties utility function

This is an example project that generates an S3 bucket demonstrating the use of a utility function to provide a set of 
default properties.

#### Using the standard AWS CDK S3 construct

```typescript
import { Stack, StackProps } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class S3ProjectStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const s3Bucket = new s3.Bucket(this, 'S3Bucket')
    
  }
}
```

In the above example we are only calling the AWS S3 bucket construct, this will create an S3 Bucket with the default 
properties that will be set by the construct class. 

#### Using the standard AWS CDK S3 construct with the utility function to set suggested defaults

```typescript
import { Stack, StackProps } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import {defaultS3BucketProps} from './utils'

export class S3ProjectStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const s3Bucket = new s3.Bucket(this, 'S3Bucket',
      defaultS3BucketProps()
    )
  }
}
```

The utility function `defaultS3BucketProps()` returns a properties object with a number of pre-defined property values
(for instance `enforceSSL: true`).


Comparing the synthesised template that is generated in both scenarios

#### Scenario 1 - Without utility function

```yaml
Resources:
  S3Bucket07682993:
    Type: AWS::S3::Bucket
    UpdateReplacePolicy: Retain
    DeletionPolicy: Retain
```

In the above we can see that an S3 Bucket resource is creating with very minimal configuration properties being set.


#### Scenario 2 - With utility function
```yaml
Resources:
  S3Bucket07682993:
    Type: AWS::S3::Bucket
    Properties:
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: aws:kms
      LoggingConfiguration:
        LogFilePrefix: _accesslogs
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true
    UpdateReplacePolicy: Retain
    DeletionPolicy: Retain
  S3BucketPolicyF560589A:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket:
        Ref: S3Bucket07682993
      PolicyDocument:
        Statement:
          - Action: s3:*
            Condition:
              Bool:
                aws:SecureTransport: "false"
            Effect: Deny
            Principal:
              AWS: "*"
            Resource:
              - Fn::GetAtt:
                  - S3Bucket07682993
                  - Arn
              - Fn::Join:
                  - ""
                  - - Fn::GetAtt:
                        - S3Bucket07682993
                        - Arn
                    - /*
        Version: "2012-10-17"

```

As we can see this is setting a number of configuration parameters, which in this case are:
- enable bucket encryption,
- specify that access logs are created (under prefix _accesslogs), 
- block all public access 
- creates an S3 bucket policy attached to the bucket to enforce SSL

#### How it works

The utility function works by just generating and returning a properties object with a number of configuration 
parameters set. 

The below is an excerpt of the function code. 

```typescript
import * as s3 from 'aws-cdk-lib/aws-s3';

export function defaultS3BucketProps(props: Partial<s3.BucketProps> = {}, override: boolean = false){
  const _defaultS3BucketProps: Partial<s3.BucketProps> = {
    encryption: s3.BucketEncryption.KMS_MANAGED,
    enforceSSL: true,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    serverAccessLogsPrefix: "_accesslogs"
  }
  if(override) {
    return {..._defaultS3BucketProps, ...props}
  }
  else {
    return {...props, ..._defaultS3BucketProps}
  }
}
```

This is setting the following configuration parameter's

 - `encryption: s3.BucketEncryption.KMS_MANAGED`
 - `enforceSSL: true`
 - `blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL`
 - `serverAccessLogsPrefix: "_accesslogs"`

Then uses the javascript spread operator (...) to merge this properties object with the properties passed in, before 
then returning the merged object.

Note that by default it will give preference to the properties being set by the function preventing them from being 
overridden with user specified values. To provide greater flexibility a configuration option `override: true` can be 
passed to the function. This will reverse the merge behaviour allowing for user specified parameter values to take 
precedence over values set by the function

An example of the object returned is below:
```typescript
{
  encryption: 'MANAGED',
  enforceSSL: true,
  blockPublicAccess: BlockPublicAccess {
    blockPublicAcls: true,
    blockPublicPolicy: true,
    ignorePublicAcls: true,
    restrictPublicBuckets: true
  },
  serverAccessLogsPrefix: '_accesslogs'
}
```

### Extending further with CDK NAG
Moving to a model where compliance is not being strictly enforced through the use of company specific modules could 
result in a poor Developer Experience if user try to create resources that do not meet required compliance settings 
which are enforced at AWS account level (via SCP's or similar), this would result in a deployment failure/rollback and 
is a slow feedback loop.

To improve on this it is possible to use tools to test locally before changes aer committed to git, one such tool is
CDK NAG (https://github.com/cdklabs/cdk-nag)

Adding CDK NAG to your app requires installing the NPM package and then adding to your app:

```typescript
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { S3ProjectStack } from '../lib/s3project-stack';
import { AwsSolutionsChecks, NagSuppressions } from 'cdk-nag';

const app = new cdk.App();
const stack = new S3ProjectStack(app, 'S3ProjectStack', {});
cdk.Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));

```

#### Output of CDK Nag when using the standard AWS CDK S3 construct
Running CDK Nag against a stack using just the default S3 construct shows the following:
![img_2.png](img_2.png)

In the above there are a number of compliance violations which prevent the template from being generated locally & 
allows for the user to fix before committing any code changes.


#### Output of CDK Nag when using the utility function in combination with the standard AWS CDK S3 construct
Running CDK Nag against a stack using the utility function to generate the properties in combination with the default S3 
construct shows the following:

![img.png](img.png)

In the above there are no compliance violations which prevent the template from being generated locally, giving the user 
confidence that the synthesised template will deploy without issue.

The utility function has enabled the user to meet the compliance requirements quickly and easily. 

### Testing using Jest & AWS CDK Assert Library
In addition to the use of a library such as CDK Nag described above, Jest tests can be used with the AWS CDK Assert 
library.

#### Testing configuration provided by the utility function

````typescript
test("S3 Buckets are encrypted with a KMS Key by default", () => {

  template.hasResourceProperties("AWS::S3::Bucket", {
    BucketEncryption: {
      ServerSideEncryptionConfiguration: [
        {
          ServerSideEncryptionByDefault: {
            SSEAlgorithm: "aws:kms",
          },
        },
      ],
    },
  });
});
````

### Further information on S3 Bucket parameters 

- S3 Bucket Public Access configuration

https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-publicaccessblockconfiguration.html

https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html

https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-s3.Bucket.html



### Useful CDK Commands 

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

