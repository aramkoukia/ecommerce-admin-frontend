import RestUtilities from "./RestUtilities";

export default class CustomerService {
  async static getCustomers() {
    try {
      const response = await RestUtilities.get(
        "https://lightsandpartsapi.azurewebsites.net/api/customers"
      );
      return response.content;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
