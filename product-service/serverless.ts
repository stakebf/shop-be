import type { AWS } from '@serverless/typescript';
import * as dotenv from "dotenv";
import getProductsList from '@functions/getProductsList';
import getProductById from '@functions/getProductById';
import createProduct from "@functions/createProduct";
import { TableNames } from '@shared/types/TableNames';
dotenv.config();

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-offline', 'serverless-esbuild', 'serverless-auto-swagger', 'serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    profile: process.env.PROFILE,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCTS_TABLE: TableNames.PRODUCTS,
      STOCKS_TABLE: TableNames.STOCKS
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['dynamodb:*'],
        Resource: [
          process.env.PRODUCTS_TABLE,
          process.env.STOCKS_TABLE
        ],
      },
    ],
  },
  // import the function via paths
  functions: { getProductsList, getProductById, createProduct },
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
    autoswagger: {
      generateSwaggerOnDeploy: true
    }
  },
};

module.exports = serverlessConfiguration;
