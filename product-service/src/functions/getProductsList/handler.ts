import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getAllProducts as getAllProductsService } from './service';

export const getProductsList = async () => {
  console.log("'getProductsList' was triggered");

  try {
    const products = await getAllProductsService();

    return formatJSONResponse({
      body: products,
      statusCode: 200
    });
  } catch(error) {
    return formatJSONResponse({
      body: {
        message: 'Something went wrong with getting list of products',
        errorInfo: error
      },
      statusCode: 500
    });
  }
};

export const main = middyfy(getProductsList);
