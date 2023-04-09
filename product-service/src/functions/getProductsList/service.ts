import { products } from "@functions/mockedProducts";
import { Product } from "@shared/types/Product";

export default (): Promise<Product[] | []> => Promise.resolve(products ?? []);
