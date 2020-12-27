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

  static async updateTag(tag) {
    try {
      const response = await RestUtilities.put(
        `tags/${tag.tagId}`,
        tag,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async deleteTag(tagId) {
    try {
      const response = await RestUtilities.delete(
        `tags/${tagId}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
