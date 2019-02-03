import RestUtilities from './RestUtilities';

export default class ProductService {
  static async getProducts() {
    try {
      const response = await RestUtilities.get(
        'products',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getProductsForSales() {
    try {
      const response = await RestUtilities.get(
        'products/available',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getProduct(productId) {
    try {
      const response = await RestUtilities.get(
        `products/${productId}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getProductTransactions(productId) {
    try {
      const response = await RestUtilities.get(
        `products/${productId}/transactions`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateInventory(inventory) {
    try {
      const response = await RestUtilities.post(
        'ProductInventory',
        inventory,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async transferInventory(inventory) {
    try {
      const response = await RestUtilities.post(
        'TransferInventory',
        inventory,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
