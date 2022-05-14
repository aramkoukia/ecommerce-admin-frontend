
import RestUtilities from './RestUtilities';

export default class PosSettingsService {
  static async pairPos(request) {
    try {
      const response = await RestUtilities.post(
        'moneris/pair',
        request,
      );
      return response;
    } catch (err) {
      return false;
    }
  }

  static async unpairPos(request) {
    try {
      const response = await RestUtilities.post(
        'moneris/unpair',
        request,
      );
      return response;
    } catch (err) {
      return false;
    }
  }

  static async initializePos(request) {
    try {
      const response = await RestUtilities.post(
        'moneris/initialize',
        request,
      );
      return response;
    } catch (err) {
      return false;
    }
  }

  static async enableMobilePinpad(request) {
    try {
      const response = await RestUtilities.post(
        'moneris/enableMobilePinpad',
        request,
      );
      return response;
    } catch (err) {
      return false;
    }
  }

  static async disableMobilePinpad(request) {
    try {
      const response = await RestUtilities.post(
        'moneris/disableMobilePinpad',
        request,
      );
      return response;
    } catch (err) {
      return false;
    }
  }

  static async batchClose(request) {
    try {
      const response = await RestUtilities.post(
        'moneris/batchclose',
        request,
      );
      return response;
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
