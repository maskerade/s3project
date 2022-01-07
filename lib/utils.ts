import * as s3 from '@aws-cdk/aws-s3';

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

    return{...props, ..._defaultS3BucketProps}
  }
}

