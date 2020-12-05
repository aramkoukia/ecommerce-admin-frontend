import RestUtilities from './RestUtilities';

export default class LoginHistoryService {
  static async getLoginHistories() {
    try {
      const response = await RestUtilities.get(
        'loginhistory',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
