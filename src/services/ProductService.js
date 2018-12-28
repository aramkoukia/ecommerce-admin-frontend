import RestUtilities from "./RestUtilities";

export default class ProductService {
  static async getProducts() {
    try {
      const response = await RestUtilities.get(
        "products"
      );
      return response.content;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async updateInventory(inventory) {
    try {
      const response = await RestUtilities.put(
        "products/inventory",
        inventory
      );
      return response.content;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
