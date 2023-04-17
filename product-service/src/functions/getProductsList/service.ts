import { Product } from "@shared/types/Product";
import { getAllProducts as getAllProductsRepository } from "@repositories/product";
import { getAllStocks as getAllStocksRepository } from "@repositories/stock";

export const getAllProducts = async (): Promise<Product[]> => {
  const products = await getAllProductsRepository();
  const stocks = await getAllStocksRepository();

  return products.map(product => {
    const stock = stocks.find(stock => stock.product_id === product.id);

    return ({ 
      ...product, 
      count: stock?.count 
    });
  });
};
