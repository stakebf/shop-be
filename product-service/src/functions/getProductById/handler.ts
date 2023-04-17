import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getProductById as getProductByIdService } from './service';

export const getProductById = async (event) => {
  console.log(`'getProductById' was triggered with event: ${JSON.stringify(event)}`);

  try {
    const product = await getProductByIdService(event.pathParameters?.productId);

    if (!product) {
      return formatJSONResponse({
        body: {
          message: "This product does not exist or has been removed"
        },
        statusCode: 404
      });
    }

    return formatJSONResponse({
      body: product,
      statusCode: 200
    });
  } catch(error) {
    return formatJSONResponse({
      body: {
        message: `Something went wrong with getting product by id ${event.pathParameters?.productId}`,
        errorInfo: error
      },
      statusCode: 500
    });
  }
};

export const main = middyfy(getProductById);
