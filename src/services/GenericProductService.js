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

  static async getGenericProductInventories() {
    try {
      const response = await RestUtilities.get(
        'generic-product-inventories',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async deleteGenericProduct(id) {
    try {
      const response = await RestUtilities.delete(
        `genericproducts/${id}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async addGenericProduct(product) {
    try {
      const response = await RestUtilities.post(
        'genericproducts',
        product,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateGenericProduct(product) {
    try {
      const body = {
        genericProductId: product.genericProductId,
        productTypeId: product.productTypeId,
        genericProductCode: product.genericProductCode,
        productName: product.productName,
      };

      const response = await RestUtilities.put(
        'genericproducts',
        body,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
