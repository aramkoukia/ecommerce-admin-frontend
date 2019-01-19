import RestUtilities from './RestUtilities';

export default class LocationService {
  static getLocations() {
    try {
      const response = RestUtilities.get(
        'locations',
      );
      return response;
    } catch (err) {
      return false;
    }
  }

  static getLocationsForUser() {
    try {
      const response = RestUtilities.get(
        'locations/foruser',
      );
      return response;
    } catch (err) {
      return false;
    }
  }
}
