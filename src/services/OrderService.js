import RestUtilities from './RestUtilities';
import PosSetting from '../stores/PosSetting';

export default class OrderService {

  static async uploadAttachment(orderId, orderFile) {
    try {
      const response = await RestUtilities.postForm(
        `orders/${orderId}/attach-to-invoice`,
        orderFile,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async downloadAttachment(orderId, fileName) {
    try {
      const response = await RestUtilities.requestAnyBlob(
        `orders/${orderId}/invoice-attachment`,
        fileName,
      );
      return response;
    } catch (err) {
      return false;
    }
  }

  static async deleteAttachment(orderId) {
    try {
      const response = await RestUtilities.get(
        `orders/${orderId}/delete-attachment`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async uploadAttachmentV2(orderId, orderFile) {
    try {
      const response = await RestUtilities.postForm(
        `orders/${orderId}/attach-to-invoice-v2`,
        orderFile,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async downloadAttachmentV2(orderId, id, fileName) {
    try {
      const response = await RestUtilities.requestAnyBlob(
        `orders/${orderId}/invoice-attachment-v2/${id}`,
        fileName,
      );
      return response;
    } catch (err) {
      return false;
    }
  }

  static async deleteAttachmentV2(orderId, id) {
    try {
      const response = await RestUtilities.get(
        `orders/${orderId}/delete-attachment-v2/${id}/`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getOrderAttachments(orderId) {
    try {
      const response = await RestUtilities.get(
        `orders/${orderId}/order-attachments`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async saveOrder(order, idempotency) {
    try {
      const response = await RestUtilities.post(
        'orders',
        order,
        idempotency,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async processInventory(inventory) {
    try {
      const response = await RestUtilities.post(
        'orders/processIncomingOrderInventory',
        inventory,
      );
      return response.is_error
        ? { is_error: response.is_error, content: response.error_content }
        : { is_error: response.is_error, content: response.content };
    } catch (err) {
      return false;
    }
  }

  static async getIncomingOrdersList(showProcessed) {
    try {
      const response = await RestUtilities.get(
        `orders/incoming?showProcessed=${showProcessed}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async payByMoneris(orderId) {
    try {
      const localPOSStoreId = PosSetting.getPOSStoreId();
      const localPOSTerminalId = PosSetting.getPOSTerminalId();
      const response = await RestUtilities.get(
        `orders/${orderId}/sendforpayment?localPOSStoreId=${localPOSStoreId}&localPOSTerminalId=${localPOSTerminalId}`,
      );
      return response.is_error
        ? { is_error: response.is_error, content: response.error_content }
        : { is_error: response.is_error, content: response.content };
    } catch (err) {
      return false;
    }
  }

  static async updateOrder(orderId, order) {
    try {
      const response = await RestUtilities.put(
        `orders/${orderId}`,
        order,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateOrderStatus(orderId, orderStatus, idempotency) {
    try {
      const response = await RestUtilities.post(
        `orders/${orderId}/status`,
        orderStatus,
        idempotency,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateOrderPayment(orderId, orderPayment, idempotency) {
    try {
      const response = await RestUtilities.post(
        `orders/${orderId}/payment`,
        orderPayment,
        idempotency,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateOrderLocation(orderId, locationId) {
    try {
      const response = await RestUtilities.put(
        `orders/${orderId}/move/${locationId}`,
        {},
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateOrderInfo(orderId, orderInfo) {
    try {
      const response = await RestUtilities.put(
        `orders/${orderId}/info`,
        orderInfo,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateOrderCustomer(orderId, orderCustomer) {
    try {
      const response = await RestUtilities.put(
        `orders/${orderId}/customer`,
        orderCustomer,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getOrders() {
    try {
      const response = await RestUtilities.get(
        'orders',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getOrdersByLocation(locationId, fromDate, toDate) {
    try {
      const response = await RestUtilities.get(
        `orders/location/${locationId}?fromDate=${fromDate}&todate=${toDate}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getCustomerOrders(customerId) {
    try {
      const response = await RestUtilities.get(
        `orders/customer/${customerId}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getCustomerOrdersByDate(customerId, fromDate, toDate) {
    try {
      const response = await RestUtilities.get(
        `orders/customer/${customerId}/bydate?fromDate=${fromDate}&toDate=${toDate}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getOrderDetail(orderId) {
    try {
      const response = await RestUtilities.get(
        `orders/${orderId}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async emailOrder(orderId, email) {
    try {
      const response = await RestUtilities.get(
        `orders/${orderId}/email?email=${email}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async printOrder(orderId) {
    try {
      const response = await RestUtilities.getBlob(`orders/${orderId}/print`);
      return response;
    } catch (err) {
      return false;
    }
  }

  static async packingOrder(orderId) {
    try {
      const response = await RestUtilities.getBlob(`orders/${orderId}/packingSlip`);
      return response;
    } catch (err) {
      return false;
    }
  }

  static async validateInventory(inventoryValidationRequest) {
    try {
      const response = await RestUtilities.put(
        'orders/validateinventory',
        inventoryValidationRequest,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
