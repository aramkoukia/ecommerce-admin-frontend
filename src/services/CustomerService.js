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

  static async getCustomersWithBalance(showDisabled) {
    try {
      const response = await RestUtilities.get(
        `customers/withbalance?showDisabled=${showDisabled}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getCustomersAwaitingPayments(showOverDue) {
    try {
      const response = await RestUtilities.get(
        `customers/AwaitingPayments?showOverDue=${showOverDue}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getCustomersAwaitingPaymentsSummary() {
    try {
      const response = await RestUtilities.get(
        'customers/AwaitingPaymentsSummary',
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

  static async getCustomerOrderSummary(customerId) {
    try {
      const response = await RestUtilities.get(
        `customers/${customerId}/ordersummary`,
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

  static async emailStatement(customerId, fromDate, toDate) {
    try {
      const response = await RestUtilities.get(
        `customers/${customerId}/emailstatement?fromDate=${fromDate}&toDate=${toDate}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async printStatement(customerId, fromDate, toDate) {
    try {
      const response = await RestUtilities.getBlob(
        `customers/${customerId}/printstatement?fromDate=${fromDate}&toDate=${toDate}`,
      );
      return response;
    } catch (err) {
      return false;
    }
  }
}
