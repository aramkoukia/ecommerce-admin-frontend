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

  static async getProductWithInventory() {
    try {
      const response = await RestUtilities.get(
        'products/WithInventory',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getWebsiteProducts() {
    try {
      const response = await RestUtilities.get(
        'website/productdetails',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getProductsForSalesV2(locationId) {
    try {
      const response = await RestUtilities.get(
        `products/locations/${locationId}/available`,
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

  static async getProductTransactions(productId, fromDate, toDate, locationId) {
    try {
      const response = await RestUtilities.get(
        `products/${productId}/transactions?fromDate=${fromDate}&toDate=${toDate}&locationId=${locationId}`,
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

  static async updateProduct(product) {
    try {
      const response = await RestUtilities.put(
        `products/${product.productId}`,
        product,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getProductPackages(id) {
    try {
      const response = await RestUtilities.get(
        `products/${id}/productpackage`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async createProductPackage(productId, productPackage) {
    try {
      const response = await RestUtilities.post(
        `products/${productId}/productPackage`,
        productPackage,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateProductPackage(productId, productPackage) {
    try {
      const response = await RestUtilities.put(
        `products/${productId}/productPackage`,
        productPackage,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async deleteProductPackage(productId, productPackage) {
    try {
      const response = await RestUtilities.delete(
        `products/${productId}/productPackage/${productPackage.productPackageId}/delete`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateProductImages(id, files) {
    try {
      const response = await RestUtilities.postForm(
        `products/${id}/upload`,
        files,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateProductHeaderImage(id, image) {
    try {
      const response = await RestUtilities.postForm(
        `products/${id}/uploadheaderimage`,
        image,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateProductDescription(product) {
    try {
      const response = await RestUtilities.put(
        `products/${product.productId}/description`,
        product,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateProductDetail(product) {
    try {
      const response = await RestUtilities.put(
        `products/${product.productId}/detail`,
        product,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateProductWarranty(product) {
    try {
      const response = await RestUtilities.put(
        `products/${product.productId}/warranty`,
        product,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateProductAdditionalInfo(product) {
    try {
      const response = await RestUtilities.put(
        `products/${product.productId}/AdditionalInfo`,
        product,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateProductCatalog(id, image) {
    try {
      const response = await RestUtilities.postForm(
        `products/${id}/usermanual`,
        image,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateProductTags(id, tags) {
    try {
      const response = await RestUtilities.post(
        `products/${id}/producttag`,
        tags,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
