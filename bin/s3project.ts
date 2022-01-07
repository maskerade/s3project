#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from  '@aws-cdk/core';
import { S3ProjectStack } from '../lib/s3project-stack';

const app = new cdk.App();
const stack = new S3ProjectStack(app, 'S3ProjectStack', {});
