const axios = require("axios");

class VAPIService {
  constructor() {
    this.baseURL = "https://api.vapi.ai";
    this.apiKey = process.env.VAPI_API_KEY;
  }

  /**
   * Start a call using a pre-configured workflow
   * @param {Object} callDetails - Call configuration
   * @returns {Promise} Call start response
   */
  async startWorkflowCall(callDetails) {
    const { workflowId, metadata } = callDetails;

    try {
      const response = await axios.post(
        `${this.baseURL}/workflow/${workflowId}/start`,
        {
          metadata: {
            ...metadata,
            type: "interview_workflow",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error starting workflow call:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
}

module.exports = new VAPIService();
