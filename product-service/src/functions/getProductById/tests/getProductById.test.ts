import { APIGatewayProxyEvent } from "aws-lambda";
import { getProductById } from "../handler";
import { products } from "@functions/mockedProducts";

describe('getProductById handler', function () {
    it('should return correct data with 200 status', async () => {
        const event: APIGatewayProxyEvent = {
            pathParameters: {
                productId: "1",
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
