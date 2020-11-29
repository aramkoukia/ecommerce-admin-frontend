import RestUtilities from './RestUtilities';

export default class WebsiteSlider {
  static async getWebsiteSliders() {
    try {
      const response = await RestUtilities.get(
        'websitesliders',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async createWebsiteSlider(websiteSlider) {
    try {
      const response = await RestUtilities.post(
        'websitesliders',
        websiteSlider,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async deleteWebsiteSlider(websiteSlider) {
    try {
      const response = await RestUtilities.delete(
        `websitesliders/${websiteSlider.id}`,
        websiteSlider,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateWebsiteSlider(websiteSlider) {
    try {
      const response = await RestUtilities.put(
        `websitesliders/${websiteSlider.id}`,
        websiteSlider,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateWebsiteSliderImage(id, websiteSlider) {
    try {
      const response = await RestUtilities.postForm(
        `websitesliders/${id}/upload`,
        websiteSlider,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
