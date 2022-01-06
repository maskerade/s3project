import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as S3Project from '../lib/s3project-stack';
import * as s3 from 'aws-cdk-lib/aws-s3';
import {defaultS3BucketProps} from '../lib/utils'

// Create CDK App & Stack
const app = new cdk.App();
const stack = new cdk.Stack(app, 'MyTestStack');

// Create S3 Bucket using Properties utility function
const s3Bucket = new s3.Bucket(stack, 'S3Bucket',
  defaultS3BucketProps()
)

const s3BucketLogicalId = stack.getLogicalId(s3Bucket.node.defaultChild as s3.CfnBucket)

const template = Template.fromStack(stack);

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

test("S3 Buckets have server access logs enabled", () => {

  template.hasResourceProperties("AWS::S3::Bucket", {
    LoggingConfiguration: {
    },
  });
});

test("S3 Buckets prohibit public access through bucket level settings", () => {

  template.hasResourceProperties("AWS::S3::Bucket", {
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: true,
      BlockPublicPolicy: true,
      IgnorePublicAcls: true,
      RestrictPublicBuckets: true
    },
  });
});

test("S3 Buckets require requests to use SSL", () => {

  template.hasResourceProperties("AWS::S3::BucketPolicy", {
    PolicyDocument: {
      Statement: [
        {
          Action: "s3:*",
          Condition: {
            Bool: {
              "aws:SecureTransport": "false"
            }
          },
          Effect: "Deny",
          Principal: {
            AWS: "*"
          },
          Resource: [
            {
              "Fn::GetAtt": [
                s3BucketLogicalId,
                "Arn"
              ]
            },
            {
              "Fn::Join": [
                "",
                [
                  {
                    "Fn::GetAtt": [
                      s3BucketLogicalId,
                      "Arn"
                    ]
                  },
                  "/*"
                ]
              ]
            }
          ]
        }
      ],
      Version: "2012-10-17"
    }
  });
});

