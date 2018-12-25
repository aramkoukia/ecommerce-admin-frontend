import RestUtilities from "./RestUtilities";

export default class LocationService {
  static async getLocations() {
    try {
      const response = await RestUtilities.get(
        "locations"
      );
      return response.content;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
