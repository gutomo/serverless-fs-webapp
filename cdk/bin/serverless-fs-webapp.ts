#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ServerlessFsWebappStack } from '../lib/serverless-fs-webapp-stack';

const app = new cdk.App();
new ServerlessFsWebappStack(app, 'ServerlessFsWebappStack', {});

// import { Aspects } from 'aws-cdk-lib';
// import { AwsSolutionsChecks } from 'cdk-nag';
// Aspects.of(app).add(new AwsSolutionsChecks());
