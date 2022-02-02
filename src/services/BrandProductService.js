import RestUtilities from './RestUtilities';

export default class BrandProductService {
  // static async getBrandProducts() {
  //   try {
  //     const response = await RestUtilities.get(
  //       'brandproducts',
  //     );
  //     return response.content;
  //   } catch (err) {
  //     return false;
  //   }
  // }

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

  static async addBrandProduct(product) {
    try {
      const response = await RestUtilities.post(
        'brandproducts',
        product,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateBrandProduct(product) {
    try {
      const body = {
        brandProductId: product.brandProductId,
        brandProductCode: product.brandProductCode,
        brandProductName: product.productName,
        disaled: product.disaled,
        chargeTaxes: product.chargeTaxes,
        allowOutOfStockPurchase: product.allowOutOfStockPurchase,
        salesPrice: product.salesPrice,
      };

      const response = await RestUtilities.put(
        'brandproducts',
        body,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
