import RestUtilities from './RestUtilities';

export default class OrderService {
  static async saveOrder(order) {
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

  static async updateOrderStatus(orderId, orderStatus) {
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

  static async getOrders() {
    try {
      const response = await RestUtilities.get(
        'orders',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getOrdersByLocation(locationId, showAllOrders) {
    try {
      const response = await RestUtilities.get(
        `orders/location/${locationId}?showAllOrders=${showAllOrders}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getCustomerOrders(customerId) {
    try {
      const response = await RestUtilities.get(
        `orders/customer/${customerId}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getOrderDetail(orderId) {
    try {
      const response = await RestUtilities.get(
        `orders/${orderId}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async emailOrder(orderId, email) {
    try {
      const response = await RestUtilities.get(
        `orders/${orderId}/email?email=${email}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async printOrder(orderId) {
    try {
      const response = await RestUtilities.getBlob(`orders/${orderId}/print`);
      return response;
    } catch (err) {
      return false;
    }
  }
}
