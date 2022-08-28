export default class PosSetting {
  static POSStoreId = 'posStoreId';

  static POSTerminalId = 'posTerminalId';

  static getPOSStoreId() {
    return window.localStorage.getItem(PosSetting.POSStoreId);
  }

  static setPOSStoreId(storeId) {
    window.localStorage.setItem(PosSetting.POSStoreId, storeId);
  }

  static getPOSTerminalId() {
    return window.localStorage.getItem(PosSetting.POSTerminalId);
  }

  static setPOSTerminalId(terminalId) {
    window.localStorage.setItem(PosSetting.POSTerminalId, terminalId);
  }
}
