import * as s3 from 'aws-cdk-lib/aws-s3';
import {defaultS3BucketProps} from './utils'
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';


export class S3ProjectStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const s3Bucket = new s3.Bucket(this, 'S3Bucket',
      defaultS3BucketProps(
        // {
        //   bucketName: "example-bucket",
        //   enforceSSL: false,
        //   serverAccessLogsPrefix: "my-access-logs"
        // }, true
      )
    )

  }
}
