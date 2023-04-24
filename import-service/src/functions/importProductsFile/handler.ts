import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import { userConfig } from 'src/configuration';

export const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(`'importProductsFile' was triggered with event: ${JSON.stringify(event)}`);

  const s3Client = new S3Client({ region: userConfig.REGION });
  const { name: fileName } = event.queryStringParameters;

  const params = {
    Bucket: userConfig.BUCKET_NAME,
    Key: `${userConfig.UPLOADED_PATH}${fileName}`,
    ContentType: "text/csv"
  };
  
  try {
    const signedUrl = await getSignedUrl(
      s3Client, 
      new PutObjectCommand(params), 
      { 
        expiresIn: 3600 
      }
    );

    return formatJSONResponse({ body: signedUrl, statusCode: 200 });
  } catch(error) {
    return formatJSONResponse({ 
      body: { 
        message: 'Something went wrong with import products file',
        error 
      }, 
      statusCode: 500 
    });

  }
};

export const main = middyfy(importProductsFile);
