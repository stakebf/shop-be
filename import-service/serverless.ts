import type { AWS } from '@serverless/typescript';

import importFileParser from '@functions/importFileParser';
import importProductsFile from '@functions/importProductsFile';
import { userConfig } from 'src/configuration';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    stage: 'dev',
    profile: userConfig.PROFILE,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SQS_ARN: userConfig.SQS_ARN,
      SQS_URL: userConfig.SQS_URL
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: [`arn:aws:s3:::${userConfig.BUCKET_NAME}/*`]
      },
      {
        Effect: 'Allow',
        Action: ['sqs:*'],
        Resource: [ userConfig.SQS_ARN ]
      }
    ],
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
