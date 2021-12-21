import * as s3 from 'aws-cdk-lib/aws-s3';

export function defaultS3BucketProps(props: Partial<s3.BucketProps> = {}){
  const _defaultS3BucketProps: Partial<s3.BucketProps> = {
    encryption: s3.BucketEncryption.KMS_MANAGED,
    enforceSSL: true
  }
  return {...props, ..._defaultS3BucketProps}
}



  // if (props.publicReadAccess) {
  //   console.log("ERROR: Public Access Buckets are not authorised")
  //   process.exit(1)
  //
  // } else {
  //   const defaultS3BucketProps: Partial<s3.BucketProps> = {
  //     encryption: s3.BucketEncryption.KMS_MANAGED,
  //     enforceSSL: true
  //   }
  //   return {...defaultS3BucketProps}
  // }
  //
  //
  // if (props.enforceSSL) {
  //
  //   return props
  // } else {
  //   const defaultS3BucketProps: Partial<s3.BucketProps> = {
  //     encryption: s3.BucketEncryption.KMS_MANAGED,
  //     enforceSSL: true
  //   }
  //   return {...defaultS3BucketProps}
  // }

  //
  // const defaultS3BucketProps: Partial<s3.BucketProps> = {
  //   encryption: s3.BucketEncryption.KMS_MANAGED,
  //   enforceSSL: true
  // }
  //
  // return {...defaultS3BucketProps}

