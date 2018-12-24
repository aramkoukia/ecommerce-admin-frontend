import RestUtilities from "./RestUtilities";

export default class TaxService {
  static async getTaxes(country, province) {
    try {
      const response = await RestUtilities.get(
        `taxes?country=${country}&province=${province}`
      );
      return response.content;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  static async getAllTaxes() {
    try {
      const response = await RestUtilities.get(
        `taxes`
      );
      return response.content;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

}
