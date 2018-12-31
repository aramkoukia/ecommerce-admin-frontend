import RestUtilities from './RestUtilities';

export default class ReportService {
  static async getMonthlySummary() {
    try {
      const response = await RestUtilities.get(
        'reports/monthlysummary',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getMonthlySales() {
    try {
      const response = await RestUtilities.get(
        'reports/monthlysales',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getMonthlyPurchases() {
    try {
      const response = await RestUtilities.get(
        'reports/monthlypurchases',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getDailySales() {
    try {
      const response = await RestUtilities.get(
        'reports/dailysales',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }    

}
