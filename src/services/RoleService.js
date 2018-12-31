import RestUtilities from './RestUtilities';

export default class RoleService {
  static async getRoles() {
    try {
      const response = await RestUtilities.get(
        'roles',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
