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

  static async getProductTransactions(productId, fromDate, toDate) {
    try {
      const response = await RestUtilities.get(
        `products/${productId}/transactions?fromDate=${fromDate}&toDate=${toDate}`,
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
        'ProductInventory/Transfer',
        inventory,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async syncProducts() {
    try {
      const response = await RestUtilities.get(
        'sync/products',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async disableProduct(id) {
    try {
      const response = await RestUtilities.delete(
        `products/${id}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }


}
