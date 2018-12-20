export default class Auth {
  static STORAGE_KEY = "token";

  static getToken() {
    return window.localStorage.getItem(Auth.STORAGE_KEY);
  }

  static setToken(token) {
    window.localStorage.setItem(Auth.STORAGE_KEY, token);
  }

  static removeToken() {
    window.localStorage.removeItem(Auth.STORAGE_KEY);
  }
}
