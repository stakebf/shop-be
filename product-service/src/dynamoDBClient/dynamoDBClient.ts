
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import * as dotenv from "dotenv";
dotenv.config();

const region = process.env.REGION || 'us-east-1';

export const dynamoDBClient = new DynamoDBClient({ region });
