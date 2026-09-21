/**
 * API Service for AutoPrice AI.
 * Centralizes all backend REST calls using environment-configured URLs.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL.replace(/\/+$/, '');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        let errorMessage = `Server error (${response.status})`;
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
          }
        } catch {
          // Response was not JSON
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Cannot connect to AutoPrice AI backend. Please verify FastAPI server is running on port 8000.');
      }
      throw err;
    }
  }

  async checkHealth() {
    return this.request('/api/health');
  }

  async getBrandsAndModels() {
    return this.request('/api/brands-models');
  }

  async getSampleCars() {
    return this.request('/api/sample-cars');
  }

  async getModelInfo() {
    return this.request('/api/model-info');
  }

  async predictPrice(carData) {
    return this.request('/api/predict', {
      method: 'POST',
      body: JSON.stringify(carData),
    });
  }

  async compareCars(carA, carB) {
    return this.request('/api/compare', {
      method: 'POST',
      body: JSON.stringify({ car_a: carA, car_b: carB }),
    });
  }

  async downloadPdfReport(carData) {
    const url = `${this.baseUrl}/api/generate-report`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      });

      if (!response.ok) {
        throw new Error(`Report generation failed (${response.status})`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `AutoPrice_Valuation_${carData.brand || 'Vehicle'}_${carData.year || 2024}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      return true;
    } catch (err) {
      console.error('PDF download error:', err);
      throw err;
    }
  }
}

export const api = new ApiService();
