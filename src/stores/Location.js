export default class Location {
  static STORE_LOCATION_KEY = 'storeLocation';

  static getStoreLocation() {
    return window.localStorage.getItem(Location.STORE_LOCATION_KEY);
  }

  static setStoreLocation(locationId) {
    window.localStorage.setItem(Location.STORE_LOCATION_KEY, locationId);
  }

  static removeStoreLocation() {
    window.localStorage.removeItem(Location.STORE_LOCATION_KEY);
  }
}
