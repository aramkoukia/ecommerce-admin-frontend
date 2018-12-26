import RestUtilities from "./RestUtilities";

export default class OrderService {
  async saveOrder(order) {
    try {
      const response = await RestUtilities.post(
        "orders",  
        order
      );
      return response.content;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async getOrders() {
    try {
      const response = await RestUtilities.get(
        "orders"
      );
      return response.content;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async getOrdersByLocation(locationId) {
    try {
      const response = await RestUtilities.get(
        `orders/location/${locationId}`
      );
      return response.content;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async getOrderDetail(orderId) {
    try {
      const response = await RestUtilities.get(
        `orders/${orderId}`
      );
      return response.content;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  

}
