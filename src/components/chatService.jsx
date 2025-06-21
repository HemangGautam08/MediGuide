import { Client } from "@gradio/client";
import { AI_MODELS } from './models/models'; // assuming models are imported here if needed

// Gradio endpoints for different models
const GRADIO_ENDPOINTS = {
  'mistralai': 'https://675d7436e0ad38cdc0.gradio.live',
  'deepseekai': 'https://675d7436e0ad38cdc0.gradio.live'
};

export class ChatService {
  static async callGradioAPI(message, model) {
    const endpoint = GRADIO_ENDPOINTS[model.id];

    try {
      // Connect to the Gradio client
      const client = await Client.connect(endpoint);

      // Make the prediction call
      const result = await client.predict("/predict", {
        message: message
      });

      // Extract the response from the result
      if (result && result.data) {
        // Handle different response formats
        if (Array.isArray(result.data)) {
          return result.data[0] || 'No response received';
        }
        if (typeof result.data === 'string') {
          return result.data;
        }
        if (typeof result.data === 'object' && result.data.response) {
          return result.data.response;
        }
        return JSON.stringify(result.data);
      }

      return 'No response received from the model';

    } catch (error) {
      // Handle different types of errors
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          throw new Error(`Network error: Unable to reach ${model.provider} servers. Please check your internet connection.`);
        }
        if (error.message.includes('404')) {
          throw new Error(`Service not found: ${model.provider} endpoint is not available. The model may be offline.`);
        }
        if (error.message.includes('500')) {
          throw new Error(`Server error: ${model.provider} service is experiencing issues. Please try again later.`);
        }
        if (error.message.includes('timeout')) {
          throw new Error(`Request timeout: ${model.provider} is taking too long to respond. Please try again.`);
        }
        if (error.message.includes('CORS')) {
          throw new Error(`Access error: Unable to connect to ${model.provider} due to security restrictions.`);
        }
      }

      throw new Error(`Failed to connect to ${model.provider}: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  }

  static async sendMessage(message, model) {
    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      return await ChatService.callGradioAPI(message, model);
    } catch (error) {
      // Re-throw the error to be handled by the component
      throw error;
    }
  }
}
