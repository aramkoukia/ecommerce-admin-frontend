import RestUtilities from './RestUtilities';
import SettingsService from './SettingsService';

export default class TaxService {
  static async getTaxes(country, province) {
    try {

      const setting = await SettingsService.getSettings();
      const { posDefaultTaxCountry, posDefaultTaxProvince } = setting;

      if (posDefaultTaxCountry === 'United States') {
        // for USA, just use default Country and State and not customer
        // because we can't look up and user enters anyways
        country = posDefaultTaxCountry;
        province = posDefaultTaxProvince;
      }

      const response = await RestUtilities.get(
        `taxes?country=${country}&province=${province}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getAllTaxes() {
    try {
      const response = await RestUtilities.get(
        'taxes',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateTax(tax) {
    try {
      const response = await RestUtilities.put(
        `taxes/${tax.taxId}`,
        tax,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
