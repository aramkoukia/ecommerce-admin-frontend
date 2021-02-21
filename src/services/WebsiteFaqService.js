import RestUtilities from './RestUtilities';

export default class WebsiteFaqService {
  static async getWebsiteFaqs() {
    try {
      const response = await RestUtilities.get(
        'websiteFaq',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async createWebsiteFaq(websiteFaq) {
    try {
      const response = await RestUtilities.post(
        'websiteFaq',
        websiteFaq,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async deleteWebsiteFaq(websiteFaq) {
    try {
      const response = await RestUtilities.delete(
        `websiteFaq/${websiteFaq.id}`,
        websiteFaq,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateWebsiteFaq(websiteFaq) {
    try {
      const response = await RestUtilities.put(
        `websiteFaq/${websiteFaq.id}`,
        websiteFaq,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateWebsiteFaqImage(websiteFaq) {
    try {
      const response = await RestUtilities.postForm(
        'websiteFaq/upload',
        websiteFaq,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
