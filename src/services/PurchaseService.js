import RestUtilities from './RestUtilities';

export default class PurchaseService {
  static async savePurchase(purchase) {
    try {
      const response = await RestUtilities.post(
        'purchases',
        purchase,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getPurchases() {
    try {
      const response = await RestUtilities.get(
        'purchases',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getPurchaseDetail(purchaseId) {
    try {
      const response = await RestUtilities.get(
        `purchases/${purchaseId}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async deletePurchase(purchaseId) {
    try {
      const response = await RestUtilities.delete(
        `purchases/${purchaseId}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async deletePurchaseDetail(purchaseDetailId) {
    try {
      const response = await RestUtilities.delete(
        `purchases/purchasedetail/${purchaseDetailId}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updatePurchaseDetailStatus(purchaseDetailId, updatePurchaseDetailStatus) {
    try {
      const response = await RestUtilities.put(
        `purchases/${purchaseDetailId}/status`,
        updatePurchaseDetailStatus,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
