import RestUtilities from './RestUtilities';

export default class WebsiteAboutService {
  static async getWebsiteAbouts() {
    try {
      const response = await RestUtilities.get(
        'websiteAbout',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async createWebsiteAbout(websiteAbout) {
    try {
      const response = await RestUtilities.post(
        'websiteAbout',
        websiteAbout,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async deleteWebsiteAbout(websiteAbout) {
    try {
      const response = await RestUtilities.delete(
        `websiteAbout/${websiteAbout.id}`,
        websiteAbout,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateWebsiteAbout(websiteAbout) {
    try {
      const response = await RestUtilities.put(
        `websiteAbout/${websiteAbout.id}`,
        websiteAbout,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateWebsiteAboutImage(id, websiteAbout) {
    try {
      const response = await RestUtilities.postForm(
        `websiteAbout/${id}/upload`,
        websiteAbout,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
