
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
}
