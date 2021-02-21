import RestUtilities from './RestUtilities';

export default class WebsitePageService {
  static async getWebsitePage() {
    try {
      const response = await RestUtilities.get(
        'websitepages',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async createWebsitePage(websitePage) {
    try {
      const response = await RestUtilities.post(
        'websitepages',
        websitePage,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async deleteWebsitePage(websitePage) {
    try {
      const response = await RestUtilities.delete(
        `websitepages/${websitePage.id}`,
        websitePage,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateWebsitePage(websitePage) {
    try {
      const response = await RestUtilities.put(
        `websitepages/${websitePage.id}`,
        websitePage,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateWebsitePageImage(url, websitePage) {
    try {
      const response = await RestUtilities.postForm(
        `websitepage/${url}/upload`,
        websitePage,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
