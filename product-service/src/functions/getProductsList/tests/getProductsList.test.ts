import { getProductsList } from "../handler";
import { products } from "@mocks/products";

describe('getProductsList handler', function () {
    it('should return correct data with 200 status', async () => {
        const result = await getProductsList();

        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(`${JSON.stringify(products)}`);
    });
});
