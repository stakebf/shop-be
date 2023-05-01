import type { AWS } from '@serverless/typescript';
import * as dotenv from "dotenv";
import getProductsList from '@functions/getProductsList';
import getProductById from '@functions/getProductById';
import createProduct from "@functions/createProduct";
import catalogBatchProcess from "@functions/catalogBatchProcess";
import { TableNames } from '@shared/types/TableNames';
dotenv.config();

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: ['serverless-offline', 'serverless-esbuild', 'serverless-auto-swagger', 'serverless-webpack', 'serverless-dotenv-plugin'],
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
      STOCKS_TABLE: TableNames.STOCKS,
      SQS_URL: { Ref: 'SQSQueue' },
      SNS_ARN: { Ref: 'SNSTopic' }
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
      {
        Effect: 'Allow',
        Action: ['sqs:*'],
        Resource: {
          'Fn::GetAtt': ['SQSQueue', 'Arn']
        }
      },
      {
        Effect: 'Allow',
        Action: ['sns:*'],
        Resource: {
          Ref: 'SNSTopic'
        }
      }
    ],
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: process.env.SQS_BATCH_CATALOG
        }
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: process.env.SNS_CREATE_PRODUCT_TOPIC
        }
      },
      SNSProductSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Protocol: 'email',
          Endpoint: process.env.ROOT_EMAIL,
          TopicArn: { Ref: 'SNSTopic' },
        },
      },
      SNSFilteredProductSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: process.env.SUB_EMAIL,
          Protocol: 'email',
          TopicArn: { Ref: 'SNSTopic' },
          FilterPolicyScope: 'MessageBody',
          FilterPolicy: { "price": [{ "numeric": [">=", 100] }] }
        }
      },
    }
  },
  // import the function via paths
  functions: { getProductsList, getProductById, createProduct, catalogBatchProcess },
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
