export default class Auth {
  static STORAGE_KEY = "token";
  static USER_KEY = "user";

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
}
