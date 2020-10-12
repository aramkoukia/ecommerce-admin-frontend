
import RestUtilities from './RestUtilities';

export default class CustomerStatementSettingsService {
  static async getSettings() {
    try {
      const response = await RestUtilities.get(
        'invoiceemailandprintsettings',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateSettings(settings) {
    try {
      const response = await RestUtilities.post(
        'invoiceemailandprintsettings',
        settings,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
