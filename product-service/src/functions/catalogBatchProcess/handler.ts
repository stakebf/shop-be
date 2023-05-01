import * as dotenv from "dotenv";
import { SNSClient } from "@aws-sdk/client-sns";
import { SQSEvent } from "aws-lambda";
import { PublishCommand } from "@aws-sdk/client-sns";

import { formatJSONResponse } from "@libs/api-gateway";

import { createNewProduct } from "src/functions/createProduct/service";
import { productSchema } from "src/functions/createProduct/validationSchema";
dotenv.config();


export const catalogBatchProcess = async (event: SQSEvent) => {
  console.log(`'catalogBatchProcess' was triggered with event: ${JSON.stringify(event)}`);
  
  try {
    const snsClient = new SNSClient({ region: process.env.REGION });

    for (const record of event.Records) {
      const parsedRecord = JSON.parse(record.body);
      const { 
        title, 
        description, 
        price, 
        count 
      } = parsedRecord;
      const { error } = productSchema.validate(parsedRecord);

      if (error) {
        return formatJSONResponse({
          statusCode: 400,
          body: JSON.stringify({ message: error.message })
        });
      }

      const { id } = await createNewProduct(parsedRecord);

      await snsClient.send(
        new PublishCommand({
          Subject: "Added product from csv",
          Message: JSON.stringify({ 
            id,
            title,
            description,
            count: Number(count), 
            price: Number(price)
          }), 
          TopicArn: process.env.SNS_ARN,
        })
      )
    };
  } catch (error) {
    return formatJSONResponse({
      statusCode: 500,
      body: JSON.stringify({ message: error.message })
    });
  }
};

export const main = catalogBatchProcess;
