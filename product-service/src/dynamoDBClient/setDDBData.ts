import * as dotenv from "dotenv";
import { BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import { dynamoDBClient } from "./dynamoDBClient";
import { products } from "../mocks/products";
import { stocks } from "../mocks/stocks";
import { TableNames } from "@shared/types/TableNames";
dotenv.config();

const params = {
  RequestItems: {
    [TableNames.PRODUCTS]: products.map(({ id, description, title, price}) => ({
      PutRequest: {
          Item: {
            id: { S: id },
            title: { S: title },
            description: { S: description },
            price: { N: `${price}` }
          },
        }
    })),
    [TableNames.STOCKS]: stocks.map(({ product_id, count }) => ({
      PutRequest: {
          Item: {
            product_id: { S: product_id },
            count: { N: `${count}` }
          }
        }
    }))
  }
};

(async () => {
  await dynamoDBClient.send(new BatchWriteItemCommand(params));
})();
