import RestUtilities from './RestUtilities';

export default class CustomerStoreCreditService {
  static async getCustomerStoreCredits(customerId) {
    try {
      const response = await RestUtilities.get(
        `customerstorecredits/${customerId}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async addCustomerStoreCredits(customerStoreCredit) {
    try {
      const response = await RestUtilities.post(
        'customerstorecredits',
        customerStoreCredit,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
