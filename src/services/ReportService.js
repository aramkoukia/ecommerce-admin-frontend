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

  static async getSalesReport(fromDate, toDate) {
    try {
      const response = await RestUtilities.get(
        `reports/salesreport?fromDate=${fromDate}&toDate=${toDate}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getSales(fromDate, toDate) {
    try {
      const response = await RestUtilities.get(
        `reports/sales?fromDate=${fromDate}&toDate=${toDate}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getProductSales(fromDate, toDate) {
    try {
      const response = await RestUtilities.get(
        `reports/productsales?fromDate=${fromDate}&toDate=${toDate}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getProductTypeSales(fromDate, toDate) {
    try {
      const response = await RestUtilities.get(
        `reports/producttypesales?fromDate=${fromDate}&toDate=${toDate}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getPayments(fromDate, toDate) {
    try {
      const response = await RestUtilities.get(
        `reports/payments?fromDate=${fromDate}&toDate=${toDate}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getPaymentsByOrderStatus(fromDate, toDate) {
    try {
      const response = await RestUtilities.get(
        `reports/paymentsbypaymenttype?fromDate=${fromDate}&toDate=${toDate}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getPaymentsTotal(fromDate, toDate) {
    try {
      const response = await RestUtilities.get(
        `reports/paymentstotal?fromDate=${fromDate}&toDate=${toDate}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getPurchases(fromDate, toDate) {
    try {
      const response = await RestUtilities.get(
        `reports/purchases?fromDate=${fromDate}&toDate=${toDate}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getCustomerPaid(fromDate, toDate) {
    try {
      const response = await RestUtilities.get(
        `reports/customerpaid?fromDate=${fromDate}&toDate=${toDate}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getCustomerUnPaid(fromDate, toDate) {
    try {
      const response = await RestUtilities.get(
        `reports/customerunpaid?fromDate=${fromDate}&toDate=${toDate}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
