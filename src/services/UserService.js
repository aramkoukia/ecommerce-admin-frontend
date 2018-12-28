import RestUtilities from './RestUtilities';

export default class UserService {
  static async getUsers() {
    try {
      const response = await RestUtilities.get(
        'users',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getUserRoles(userId) {
    try {
      const response = await RestUtilities.get(
        `users/${userId}/roles`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
