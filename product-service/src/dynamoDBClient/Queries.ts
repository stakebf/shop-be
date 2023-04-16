import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { TableNames } from "@shared/types/TableNames";

export const getItemByQuery = (tableName: TableNames, key: string, value: string) => new QueryCommand({
  TableName: tableName,
  ExpressionAttributeValues: {
    ":key": value
  },
  KeyConditionExpression: `${key} = :key`
})
