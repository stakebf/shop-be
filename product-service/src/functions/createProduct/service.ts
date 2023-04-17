import { v4 as uuidv4 } from "uuid";
import { TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { dynamoDBClient } from "../../dynamoDBClient/dynamoDBClient";
import { TableNames } from "@shared/types/TableNames";
import { Product } from "@shared/types/Product";
import { Stock } from "@shared/types/Stock";
import { marshall } from "@aws-sdk/util-dynamodb";

export const createNewProduct = async (body: any): Promise<Product & Partial<Stock>> => {
  const productId: string = uuidv4();
  const { title, description, price, count } = body;

  try {
    console.log('Start createNewProduct transaction');

    await dynamoDBClient.send(
      new TransactWriteItemsCommand({
        TransactItems: [
          { 
            Put: { 
              TableName: TableNames.PRODUCTS, 
              Item: marshall({ 
                id: productId, 
                title, 
                description, 
                price 
              }) 
            } 
          },
          { 
            Put: { 
              TableName: TableNames.STOCKS, 
              Item: marshall({ 
                product_id: productId, 
                count 
              }) 
            } 
          }
        ]
      })
    );
  } catch (error) {
    console.log('createNewProduct transaction error: ', error);
  }

  return { title, description, price, count, id: productId };
};
