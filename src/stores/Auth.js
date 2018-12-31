export default class Auth {
  static STORAGE_KEY = 'token';

  static USER_KEY = 'user';

  static PERMISSIONS_KEY = 'permissions';

  static getToken() {
    return window.localStorage.getItem(Auth.STORAGE_KEY);
  }

  static setToken(token) {
    window.localStorage.setItem(Auth.STORAGE_KEY, token);
  }

  static removeToken() {
    window.localStorage.removeItem(Auth.STORAGE_KEY);
  }

  static getUser() {
    return window.localStorage.getItem(Auth.USER_KEY);
  }

  static setUser(token) {
    window.localStorage.setItem(Auth.USER_KEY, token);
  }

  static removeUser() {
    window.localStorage.removeItem(Auth.USER_KEY);
  }

  static setUserPermissions(permissions) {
    window.localStorage.setItem(Auth.PERMISSIONS_KEY, JSON.stringify(permissions));
  }

  static getUserPermissions() {
    return window.localStorage.getItem(Auth.PERMISSIONS_KEY) !== 'undefined' ? JSON.parse(window.localStorage.getItem(Auth.PERMISSIONS_KEY)) : [];
  }

  static removeUserPermissions() {
    window.localStorage.removeItem(Auth.PERMISSIONS_KEY);
  }
}
