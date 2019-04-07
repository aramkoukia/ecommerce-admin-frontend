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

  static async getUserRoles(email) {
    try {
      const response = await RestUtilities.get(
        `users/${email}/roles`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getUserLocations(email) {
    try {
      const response = await RestUtilities.get(
        `users/${email}/locations`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getUserByAuthCode(authCode) {
    try {
      const response = await RestUtilities.get(
        `users/${authCode}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async UpdateUser(userInfo) {
    try {
      const response = await RestUtilities.put(
        'users/info',
        userInfo,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async UpdateUserRolesAndLocations(userInfo) {
    try {
      const response = await RestUtilities.put(
        'users/permissions',
        userInfo,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async ResetPassword(passwordResetInfo) {
    try {
      const response = await RestUtilities.put(
        'users/resetpassword',
        passwordResetInfo,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async ResetPasscode(passcodeResetInfo) {
    try {
      const response = await RestUtilities.put(
        'users/resetpasscode',
        passcodeResetInfo,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async addUser(user) {
    try {
      const response = await RestUtilities.post(
        'users',
        user,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
