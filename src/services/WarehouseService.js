import RestUtilities from './RestUtilities';

export default class WarehouseService {
  static async getWarehouses() {
    try {
      const response = await RestUtilities.get(
        'warehouses',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async addWarehouse(location) {
    try {
      const response = await RestUtilities.post(
        'warehouses',
        location,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateWarehouse(warehouse) {
    try {
      const response = await RestUtilities.put(
        `warehouses/${warehouse.warehouseId}`,
        warehouse,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async deleteWarehouse(warehouseId) {
    try {
      const response = await RestUtilities.delete(
        `warehouses/${warehouseId}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
