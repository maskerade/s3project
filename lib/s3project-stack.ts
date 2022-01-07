
import {defaultS3BucketProps} from './utils'
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as lambda from 'aws-cdk-lib/aws-lambda';
import { S3ToLambda } from '@aws-solutions-constructs/aws-s3-lambda';

export class S3ProjectStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new S3ToLambda(this, 'ExampleS3Lambda', {
      lambdaFunctionProps: {
        code: lambda.Code.fromAsset(`${__dirname}/../src/lambda`),
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'index.handler'
      },
      bucketProps: defaultS3BucketProps()
    })
  }
}
