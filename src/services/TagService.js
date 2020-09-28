import RestUtilities from './RestUtilities';

export default class TagService {
  static async getTags() {
    try {
      const response = await RestUtilities.get(
        'tags',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async addTag(tag) {
    try {
      const response = await RestUtilities.post(
        'tags',
        tag,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
