import { APIGatewayProxyEvent } from "aws-lambda";
import { getProductById } from "../handler";
import { products } from "@mocks/products";

describe('getProductById handler', function () {
    it('should return correct data with 200 status', async () => {
        const event: APIGatewayProxyEvent = {
            pathParameters: {
                productId: "f8765ddc-9cee-4ed7-aed5-415fb5700f8e",
                statusCode: 200
            }
        } as any;

        const result = await getProductById(event);

        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(`${JSON.stringify(products[0])}`);
    });
    it('should return status 404 non exists product', async () => {
        const event: APIGatewayProxyEvent = {
            pathParameters: {
                productId: "abc",
                statusCode: 200
            }
        } as any;

        const result = await getProductById(event);

        expect(result.statusCode).toEqual(404);
    });
});
