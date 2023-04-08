import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import getProductsListService from './service';

export const getProductsList = async () => {
  try {
    const products = await getProductsListService();

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
