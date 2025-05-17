// constants.ts
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  headers: Record<string, string>;
}

// Development configuration
const devConfig: ApiConfig = {
  baseUrl: 'http://127.0.0.1:5000/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Production configuration
const prodConfig: ApiConfig = {
  baseUrl: 'https://your-production-api.com/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Select config based on environment
export const apiConfig = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

// Helper function to get full URL
export const getApiUrl = (endpoint: string): string => {
  return `${apiConfig.baseUrl}${endpoint}`;
};