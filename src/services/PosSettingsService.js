
import RestUtilities from './RestUtilities';

export default class PosSettingsService {
  static async pairPos() {
    try {
      const response = await RestUtilities.get(
        'moneris/pair',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async unpairPos() {
    try {
      const response = await RestUtilities.get(
        'moneris/unpair',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async initializePos() {
    try {
      const response = await RestUtilities.get(
        'moneris/initialize',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
