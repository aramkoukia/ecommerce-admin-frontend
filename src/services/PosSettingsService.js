
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

  static async getClientPosSettings() {
    try {
      const response = await RestUtilities.get(
        'clientPosSettings',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async createClientPosSetting(clientPosSetting) {
    try {
      const response = await RestUtilities.post(
        'clientPosSettings',
        clientPosSetting,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async deleteClientPosSetting(clientPosSetting) {
    try {
      const response = await RestUtilities.delete(
        `clientPosSettings/${clientPosSetting.id}`,
        clientPosSetting,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateClientPosSetting(clientPosSetting) {
    try {
      const response = await RestUtilities.put(
        `clientPosSettings/${clientPosSetting.id}`,
        clientPosSetting,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
