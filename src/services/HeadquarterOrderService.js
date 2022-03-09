import RestUtilities from './RestUtilities';

export default class HeadquarterOrderService {
  static async getOrders() {
    try {
      const response = await RestUtilities.get(
        'headquarterorders',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getOrdersByBrand(brandId, fromDate, toDate) {
    try {
      const response = await RestUtilities.get(
        `headquarterorders/brand/${brandId}?fromDate=${fromDate}&todate=${toDate}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getCustomerOrdersByDate(customerId, fromDate, toDate) {
    try {
      const response = await RestUtilities.get(
        `headquarterorders/customer/${customerId}/bydate?fromDate=${fromDate}&toDate=${toDate}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getOrderDetail(orderId) {
    try {
      const response = await RestUtilities.get(
        `headquarterorders/${orderId}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
