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

  static async addCustomer(customer) {
    try {
      const response = await RestUtilities.post(
        'customers',
        customer,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateCustomer(customer) {
    try {
      const response = await RestUtilities.put(
        `customers/${customer.customerId}`,
        customer,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async emailStatement(customerId) {
    try {
      const response = await RestUtilities.get(
        `customers/${customerId}/emailstatement`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async printStatement(customerId) {
    try {
      const response = await RestUtilities.getBlob(
        `customers/${customerId}/printstatement`,
      );
      return response;
    } catch (err) {
      return false;
    }
  }
}
