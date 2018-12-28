import RestUtilities from './RestUtilities';
import AuthStore from '../stores/Auth';

export default class Auth {
  static isSignedIn() {
    return !!AuthStore.getToken();
  }

  static getUser() {
    return AuthStore.getUser();
  }

  signInOrRegister(email, password, isRegister) {
    return RestUtilities.post(
      `auth/${isRegister ? 'register' : 'login'}`,
      `username=${email}&password=${password}${
        !isRegister ? '&grant_type=password' : ''
      }`,
    ).then((response) => {
      if (!response.is_error) {
        AuthStore.setToken(response.content.token);
        AuthStore.setUser(email);
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
    return RestUtilities.post('auth/confirm', { token })
      .then(response => true)
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  signOut() {
    AuthStore.removeToken();
    AuthStore.removeUser();
    window.location.replace('/?expired=1');
  }
}
