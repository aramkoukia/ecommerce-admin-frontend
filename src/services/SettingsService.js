
import TaxService from './TaxService';
import RestUtilities from './RestUtilities';

export default class SettingsService {
  static async getSettings() {
    try {
      const response = await RestUtilities.get(
        'settings',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateSettings(settings) {
    try {
      const response = await RestUtilities.post(
        'settings',
        settings,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static getCountryInfo(country, province) {
    let stateTitle = '';
    let taxTitle = '';
    let postalCodeTitle = '';
    let taxExemptTitle = '';
    let provinces = [];
    let chargeTaxTitle = '';
    let taxChargedTitle = '';
    let taxAmountTitle = ''
    const posDefaultTaxProvince = province;
    const posDefaultTaxCountry = country;
    if (posDefaultTaxCountry == 'Canada') {
      provinces = ['BC', 'AB', 'MB', 'NL', 'NS', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT', 'Other'];
      stateTitle = 'Province';
      taxTitle = 'PST Number';
      postalCodeTitle = 'Postal Code';
      taxExemptTitle = 'PST Exempt';
      chargeTaxTitle = 'Charge PST';
      taxChargedTitle = 'PST Charged';
      taxAmountTitle = 'PST Amount'
    } else {
      provinces = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
      stateTitle = 'State';
      taxTitle = 'Tax Number';
      postalCodeTitle = 'Zip Code';
      taxExemptTitle = 'Tax Exempt';
      chargeTaxTitle = 'Charge Tax';
      taxChargedTitle = 'Tax Charged';
      taxAmountTitle = 'Tax Amount'
    }

    return {
      posDefaultTaxCountry,
      posDefaultTaxProvince,
      country,
      provinces,
      province,
      stateTitle,
      postalCodeTitle,
      taxTitle,
      taxExemptTitle,
      chargeTaxTitle,
      taxChargedTitle,
      taxAmountTitle,
    }
  }
}
