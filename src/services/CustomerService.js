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
}
