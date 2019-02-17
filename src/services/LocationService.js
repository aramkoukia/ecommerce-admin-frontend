import RestUtilities from './RestUtilities';

export default class LocationService {
  static async getLocations() {
    try {
      const response = await RestUtilities.get(
        'locations',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getLocationsForUser() {
    try {
      const response = await RestUtilities.get(
        'locations/foruser',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async addLocation(location) {
    try {
      const response = await RestUtilities.post(
        'locations',
        location,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
