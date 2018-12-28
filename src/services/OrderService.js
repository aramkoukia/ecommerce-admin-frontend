import RestUtilities from './RestUtilities';

export default class OrderService {
  async saveOrder(order) {
    try {
      const response = await RestUtilities.post(
        'orders',
        order,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  async updateOrderStatus(orderId, orderStatus) {
    try {
      const response = await RestUtilities.put(
        `orders/${orderId}/status`,
        orderStatus,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  async getOrders() {
    try {
      const response = await RestUtilities.get(
        'orders',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  async getOrdersByLocation(locationId) {
    try {
      const response = await RestUtilities.get(
        `orders/location/${locationId}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  async getOrderDetail(orderId) {
    try {
      const response = await RestUtilities.get(
        `orders/${orderId}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  async emailOrder(orderId) {
    try {
      const response = await RestUtilities.get(
        `orders/${orderId}/email`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  async printOrder(orderId) {
    try {
      const response = await RestUtilities.getBlob(`orders/${orderId}/print`);
      return response;
    } catch (err) {
      return false;
    }
  }
}
