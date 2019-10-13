import RestUtilities from './RestUtilities';

export default class ProductCategoryService {
  static async getProductCategories() {
    try {
      const response = await RestUtilities.get(
        'producttypes',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async createProductCategory(productType) {
    try {
      const response = await RestUtilities.post(
        'producttypes',
        productType,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async deleteProductCategory(productType) {
    try {
      const response = await RestUtilities.delete(
        `producttypes/${productType.productTypeId}`,
        productType,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateProductCategory(productType) {
    try {
      const response = await RestUtilities.put(
        `producttypes/${productType.productTypeId}`,
        productType,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
