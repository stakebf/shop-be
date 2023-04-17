import * as dotenv from "dotenv";
import { Product } from "@shared/types/Product";
import { Stock } from "@shared/types/Stock";
import { getProductById as getProductByIdRepository } from "@repositories/product";
import { getStockById as getStockByIdRepository } from "@repositories/stock";
dotenv.config();

export const getProductById = async (productId: string): Promise<Product & Partial<Stock>> => {
  const product = await getProductByIdRepository(productId);
  const stock = await getStockByIdRepository(productId);

  if (product && stock) {
    return { 
      ...product, 
      count: stock.count 
    };
  }

  return null;
};

