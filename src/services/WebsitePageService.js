import RestUtilities from './RestUtilities';

export default class WebsitePageService {
  static async getWebsitePages() {
    try {
      const response = await RestUtilities.get(
        'websitepage',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getWebsitePage(url) {
    try {
      const response = await RestUtilities.get(
        `websitepage/${url}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async createWebsitePage(websitePage) {
    try {
      const response = await RestUtilities.post(
        'websitepage',
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
        `websitepage/${websitePage.id}`,
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
        `websitepage/${websitePage.id}`,
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
