import RestUtilities from "./RestUtilities";
import AuthStore from "../stores/Auth";

export default class Auth {
  static isSignedIn() {
    return !!AuthStore.getToken();
  }

  signInOrRegister(email, password, isRegister) {
    return RestUtilities.post(
      `/api/auth/${isRegister ? "register" : "login"}`,
      `username=${email}&password=${password}${
        !isRegister ? "&grant_type=password" : ""
      }`
    ).then(response => {
      if (!response.is_error) {
        AuthStore.setToken(response.content.token);
      }
      return response;
    });
  }

  signIn(email, password) {
    return this.signInOrRegister(email, password, false);
  }

  register(email, password) {
    return this.signInOrRegister(email, password, true);
  }

  confirm(token) {
    return RestUtilities.post("/api/auth/confirm", { token: token })
      .then(response => {
        return true;
      })
      .catch(err => {
        console.log(err);
        return false;
      });
  }

  signOut() {
    AuthStore.removeToken();
  }
}
