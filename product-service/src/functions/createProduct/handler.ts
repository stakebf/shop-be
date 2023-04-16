import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { createNewProduct } from "./service";
import schema from './schema';
import { productSchema } from './validationSchema';

export const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(`'createProduct' was triggered with event: ${JSON.stringify(event)}`);

  try {
    const { error } = productSchema.validate(event.body);

    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: error.message })
      };
    }

    const createdProduct = await createNewProduct(event.body);

    return formatJSONResponse({ 
      body: { 
        ...createdProduct
      },
      statusCode: 200
    });
  } catch (error) {
    return formatJSONResponse({
      body: {
        message: 'Something went wrong with creating product',
        errorInfo: error
      }, 
      statusCode: 500 
    });
  }
};

export const main = middyfy(createProduct);
