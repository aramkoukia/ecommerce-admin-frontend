import RestUtilities from "./RestUtilities";

export default class TaxService {
  static async getTaxes(country, province) {
    try {
      const response = await RestUtilities.get(
        `https://lightsandpartsapi.azurewebsites.net/api/taxes?country=${country}&province=${province}`
      );
      return response.content;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
