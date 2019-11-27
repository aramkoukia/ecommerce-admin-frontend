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

  static async getSalesByPurchasePriceReport(fromDate, toDate) {
    try {
      const response = await RestUtilities.get(
        `reports/salesbypurchaseprice?fromDate=${fromDate}&toDate=${toDate}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getSalesByPurchasePriceDetailReport(fromDate, toDate) {
    try {
      const response = await RestUtilities.get(
        `reports/salesbypurchasepricedetail?fromDate=${fromDate}&toDate=${toDate}`,
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

  static async getProductSalesDetail(fromDate, toDate) {
    try {
      const response = await RestUtilities.get(
        `reports/productsalesdetail?fromDate=${fromDate}&toDate=${toDate}`,
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

  static async getPurchaseSummary(fromDate, toDate) {
    try {
      const response = await RestUtilities.get(
        `reports/purchasesummary?fromDate=${fromDate}&toDate=${toDate}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getPurchaseDetail(fromDate, toDate) {
    try {
      const response = await RestUtilities.get(
        `reports/purchasedetail?fromDate=${fromDate}&toDate=${toDate}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getSalesForecastReport(fromDate, toDate) {
    try {
      const response = await RestUtilities.get(
        `reports/SalesForcast?fromDate=${fromDate}&toDate=${toDate}`,
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

  static async getProductSalesProfit(fromSalesDate, toSalesDate, fromPurchaseDate, toPurchaseDate) {
    try {
      const response = await RestUtilities.get(
        `reports/purchaseprofit?fromSalesDate=${fromSalesDate}&toSalesDate=${toSalesDate}&fromPurchaseDate=${fromPurchaseDate}&toPurchaseDate=${toPurchaseDate}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getInventoryValue() {
    try {
      const response = await RestUtilities.get(
        'reports/inventoryvalue',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getInventoryValueTotal() {
    try {
      const response = await RestUtilities.get(
        'reports/Inventoryvaluetotal',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getInventoryValueTotalByCategory() {
    try {
      const response = await RestUtilities.get(
        'reports/Inventoryvaluetotalbycategory',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
