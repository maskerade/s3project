import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as S3Project from '../lib/s3project-stack';


// Create CDK App & Stack
const app = new cdk.App();
const stack = new S3Project.S3ProjectStack(app, 'MyTestStack');

const template = Template.fromStack(stack);

test("Creates an S3 Bucket", () => {

  template.hasResourceProperties("AWS::S3::Bucket", {
  });
});






