import RestUtilities from './RestUtilities';

export default class BrandService {
  static async getBrands() {
    try {
      const response = await RestUtilities.get(
        'brands',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async addBrand(location) {
    try {
      const response = await RestUtilities.post(
        'brands',
        location,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateBrand(brand) {
    try {
      const response = await RestUtilities.put(
        `brands/${brand.brandId}`,
        brand,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async deleteBrand(brandId) {
    try {
      const response = await RestUtilities.delete(
        `brands/${brandId}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
