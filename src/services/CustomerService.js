import RestUtilities from './RestUtilities';

export default class CustomerService {
  static async getCustomers() {
    try {
      const response = await RestUtilities.get(
        'customers',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getCustomersWithBalance() {
    try {
      const response = await RestUtilities.get(
        'customers/withbalance',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getCustomer(customerId) {
    try {
      const response = await RestUtilities.get(
        `customers/${customerId}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
