import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { Product } from "@shared/types/Product";
import { dynamoDBClient } from "../dynamoDBClient/dynamoDBClient";
import * as dotenv from "dotenv";
import { TableNames } from "@shared/types/TableNames";
import { getItemByQuery } from "src/dynamoDBClient/Queries";
dotenv.config();

export const getAllProducts = async (): Promise<Product[]> => {
  const scanCommand = new ScanCommand({ TableName: TableNames.PRODUCTS });
  const result = await dynamoDBClient.send(scanCommand);

  return result.Items as Product[];
};

export const getProductById = async (productId: string): Promise<Product | undefined> => {
  const result = await dynamoDBClient.send(getItemByQuery(TableNames.PRODUCTS, 'id', productId));

  return result.Items?.[0] as Product;
};
