import RestUtilities from "./RestUtilities";

export default class ProductService {
  static async getProducts() {
    try {
      const response = await RestUtilities.get(
        "https://lightsandpartsapi.azurewebsites.net/api/products"
      );
      return response.content;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
