
import RestUtilities from './RestUtilities';

export default class CustomerStatementSettingsService {
  static async getSettings() {
    try {
      const response = await RestUtilities.get(
        'customerstatementsettings',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateSettings(settings) {
    try {
      const response = await RestUtilities.post(
        'customerstatementsettings',
        settings,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
