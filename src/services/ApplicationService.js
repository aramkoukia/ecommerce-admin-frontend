import RestUtilities from './RestUtilities';

export default class ApplicationService {
  static async getStepsAndStepDetails() {
    try {
      const response = await RestUtilities.get(
        'custom-applications',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async getStepsDetails(id) {
    try {
      const response = await RestUtilities.get(
        `custom-applications/steps/${id}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async createStep(step) {
    try {
      const response = await RestUtilities.post(
        'custom-applications/steps',
        step,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateStep(stepId, step) {
    try {
      const response = await RestUtilities.put(
        `custom-applications/steps/${stepId}`,
        step,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }


  static async deleteStep(stepId) {
    try {
      const response = await RestUtilities.delete(
        `custom-applications/steps/${stepId}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async createStepDetail(stepDetail) {
    try {
      const response = await RestUtilities.post(
        'custom-applications/steps/step-details',
        stepDetail,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateStepDetail(stepDetailId, stepDetail) {
    try {
      const response = await RestUtilities.put(
        `custom-applications/steps/step-details/${stepDetailId}`,
        stepDetail,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }


  static async deleteStepDetail(stepDetailId) {
    try {
      const response = await RestUtilities.delete(
        `custom-applications/steps/step-details/${stepDetailId}`,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateStepDetailImage(id, stepDetail) {
    try {
      const response = await RestUtilities.postForm(
        `custom-applications/step-details/${id}/upload`,
        stepDetail,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
