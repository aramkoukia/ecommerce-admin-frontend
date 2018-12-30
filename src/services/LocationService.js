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
}
