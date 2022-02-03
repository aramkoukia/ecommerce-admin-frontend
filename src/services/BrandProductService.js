import RestUtilities from './RestUtilities';

export default class BrandProductService {
  static async deleteBrandProduct(id) {
    try {
      const response = await RestUtilities.delete(
        `brandproducts/${id}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async addOrUpdateBrandProduct(brandProduct) {
    try {
      const response = await RestUtilities.post(
        'brandproducts',
        brandProduct,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
