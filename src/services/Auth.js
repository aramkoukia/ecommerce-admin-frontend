import RestUtilities from './RestUtilities';
import AuthStore from '../stores/Auth';

export default class Auth {
  static isSignedIn() {
    return !!AuthStore.getToken();
  }

  static getUser() {
    return AuthStore.getUser();
  }

  static signInOrRegister(email, password, isRegister) {
    return RestUtilities.post(
      `auth/${isRegister ? 'register' : 'login'}`,
      `username=${email}&password=${password}${
        !isRegister ? '&grant_type=password' : ''
      }`,
    ).then((response) => {
      if (!response.is_error) {
        AuthStore.setToken(response.content.token);
        AuthStore.setUser(email);
        AuthStore.setUserPermissions(response.content.permissions);
      }
      return response;
    });
  }

  static signIn(email, password) {
    return Auth.signInOrRegister(email, password, false);
  }

  static register(email, password) {
    return Auth.signInOrRegister(email, password, true);
  }

  static userHasPermission(permission) {
    const permissions = AuthStore.getUserPermissions();
    return permissions ? permissions.includes(permission) : false;
  }

  static confirm(token) {
    return RestUtilities.post('auth/confirm', { token })
      .then(true)
      .catch(false);
  }

  static signOut() {
    AuthStore.removeToken();
    AuthStore.removeUser();
    window.location.replace('/?expired=1');
  }
}
