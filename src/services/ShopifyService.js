import RestUtilities from './RestUtilities';

export default class ShopifyService {
  static async getProducts() {
    try {
      const response = await RestUtilities.get(
        'shopify/inventories',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
