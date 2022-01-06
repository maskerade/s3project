#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { S3ProjectStack } from '../lib/s3project-stack';
import { AwsSolutionsChecks, NagSuppressions } from 'cdk-nag';

const app = new cdk.App();
const stack = new S3ProjectStack(app, 'S3ProjectStack', {});
//cdk.Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
cdk.Aspects.of(app).add(new AwsSolutionsChecks());
// NagSuppressions.addStackSuppressions(stack, [
//   { id: 'AwsSolutions-S1', reason: 'No requirement for access logs' }
// ]);