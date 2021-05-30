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

  static async getWebsiteUsers() {
    try {
      const response = await RestUtilities.get(
        'users/website-users',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async deleteUser(userName) {
    try {
      const response = await RestUtilities.delete(
        `users/${userName}`,
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

  static async linkCustomer(link) {
    try {
      const response = await RestUtilities.put(
        'users/link-customer',
        link,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateUser(userInfo) {
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

  static async updateUserRolesAndLocations(userInfo) {
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

  static async resetPassword(passwordResetInfo) {
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

  static async resetPasscode(passcodeResetInfo) {
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
      return response;
    } catch (err) {
      return false;
    }
  }
}
