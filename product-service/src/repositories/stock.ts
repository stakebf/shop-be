import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { Stock } from "@shared/types/Stock";
import { dynamoDBClient } from "../dynamoDBClient/dynamoDBClient";
import * as dotenv from "dotenv";
import { TableNames } from "@shared/types/TableNames";
import { getItemByQuery } from "src/dynamoDBClient/Queries";
dotenv.config();

export const getAllStocks = async (): Promise<Stock[]> => {
  const scanCommand = new ScanCommand({ TableName: TableNames.STOCKS });
  const result = await dynamoDBClient.send(scanCommand);

  return result.Items as Stock[];
};

export const getStockById = async (productId: string): Promise<Stock | undefined> => {
  const result = await dynamoDBClient.send(getItemByQuery(TableNames.STOCKS, 'product_id', productId));

  return result.Items?.[0] as Stock;
};
