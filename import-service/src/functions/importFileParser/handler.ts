import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { S3Event } from "aws-lambda";
import csvParser from "csv-parser";
import { Readable } from "stream";
import { formatJSONResponse } from "@libs/api-gateway";
import { userConfig } from "src/configuration";

export const importFileParser = async (event: S3Event) => {
  console.log(`'importFileParser' was triggered with event: ${JSON.stringify(event)}`);
  
  try {
    const s3Client = new S3Client({ region: userConfig.REGION });
    const streamData = [];

    for(const record of event.Records) {
      const {
        bucket: {
          name: bucketName
        },
        object: {
          key,
          size = 0
        }
      } = record.s3;

      if (!size) {
        break;
      }

      const { Body } = await s3Client.send(new GetObjectCommand({
        Bucket: bucketName,
        Key: key
      }));

      (Body as Readable)
        .pipe(csvParser())
        .on("data", (data) => streamData.push(data))
        .on("error", (error) => {
          throw new Error(`Something went wrong during uploading file with error: ${error}`);
        })
        .on("end", () => {
            console.log("results: ", streamData);
        });

      await s3Client.send(new CopyObjectCommand({ 
        Bucket: bucketName, 
        CopySource: `${bucketName}/${key}`, 
        Key: key.replace(userConfig.UPLOADED_PATH, userConfig.PARSED_PATH), 
      }));  
      await s3Client.send(new DeleteObjectCommand({ 
        Bucket: bucketName, 
        Key: key 
      }));

      console.log(`File successfully parsed and moved from ${userConfig.UPLOADED_PATH} to ${userConfig.PARSED_PATH}`)
    }
  } catch (error) {
    return formatJSONResponse({
      body: {
        error
      },
      statusCode: 500 
    });
  }
};
