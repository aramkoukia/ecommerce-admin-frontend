import RestUtilities from './RestUtilities';

export default class ShopifyStorefrontService {
  static async getCustomers() {
    try {
      const response = await RestUtilities.get(
        'shopify-storefront/access-requests',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async approve(customerId, shopifyStoreId) {
    try {
      const response = await RestUtilities.get(
        `shopify-storefront/link-shopify-customer?customerId=${customerId}&shopifyStoreId=${shopifyStoreId}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async pushOrders(customerId) {
    try {
      const response = await RestUtilities.get(
        `shopify-storefront/add-customer-metadata?customerId=${customerId}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
