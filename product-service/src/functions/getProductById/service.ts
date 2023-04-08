import { products } from "@functions/mockedProducts";
import { Product } from "@shared/types/Product";

export default (productId: string): Promise<Product | null> => Promise.resolve(products.find(({id}) => productId === id));
