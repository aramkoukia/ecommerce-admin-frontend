import RestUtilities from './RestUtilities';

export default class GenericProductService {
  static async getGenericProducts() {
    try {
      const response = await RestUtilities.get(
        'genericproducts',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async disableProduct(id) {
    try {
      const response = await RestUtilities.delete(
        `genericproducts/${id}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateProduct(product) {
    try {
      const response = await RestUtilities.put(
        `genericproducts/${product.productId}`,
        product,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
