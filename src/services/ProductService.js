import RestUtilities from "./RestUtilities";
import AuthStore from "../stores/Auth";

export default class ProductService {
  static isSignedIn() {
    return !!AuthStore.getToken();
  }

  async getProducts() {
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
