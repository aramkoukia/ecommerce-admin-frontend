import RestUtilities from './RestUtilities';

export default class ApplicationService {
  static async getApplications() {
    try {
      const response = await RestUtilities.get(
        'custom-applications',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getApplicationSteps(id) {
    try {
      const response = await RestUtilities.get(
        `custom-applications/${id}/steps`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async createApplicationStep(applicationId, step) {
    try {
      const response = await RestUtilities.post(
        `custom-applications/${applicationId}/step`,
        step,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateApplicationStep(applicationId, step) {
    try {
      const response = await RestUtilities.put(
        `custom-applications/${applicationId}/step`,
        step,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async deleteApplicationStep(applicationId, step) {
    try {
      const response = await RestUtilities.delete(
        `custom-applications/${applicationId}/step/${step.stepDetailId}/delete`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
