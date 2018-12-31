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

  static async getPermissions() {
    try {
      const response = await RestUtilities.get(
        'roles/permissions',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getRolePermissions(roleName) {
    try {
      const response = await RestUtilities.get(
        `roles/${roleName}/permissions`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateRolePermissions(roleInfo) {
    try {
      const response = await RestUtilities.put(
        'roles/permissions',
        roleInfo,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
