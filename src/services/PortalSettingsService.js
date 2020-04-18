
import RestUtilities from './RestUtilities';

export default class PortalSettingsService {
  static async getPortalSettings() {
    try {
      const response = await RestUtilities.get(
        'portalsettings',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
