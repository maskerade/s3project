import * as s3 from 'aws-cdk-lib/aws-s3';

export function defaultS3BucketProps(props: Partial<s3.BucketProps> = {}){
  const _defaultS3BucketProps: Partial<s3.BucketProps> = {
    encryption: s3.BucketEncryption.KMS_MANAGED,
    enforceSSL: true,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    //serverAccessLogsPrefix: "_accesslogs"
  }
  return {...props, ..._defaultS3BucketProps}
}

