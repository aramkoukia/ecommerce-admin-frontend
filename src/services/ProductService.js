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
}
