import axios, { AxiosInstance } from 'axios';

interface TokenResponse {
  type: string;
  username: string;
  application_name: string;
  client_id: string;
  token_type: string;
  access_token: string;
  expires_in: number;
  state: string;
}

class AmadeusServerClient {
  private axiosInstance: AxiosInstance;
  private accessToken: string | null = null;
  private tokenExpiresAt: number | null = null;
  private apiKey: string;
  private apiSecret: string;
  private baseURL: string;

  constructor() {
    this.apiKey = process.env.AMADEUS_API_KEY || '';
    this.apiSecret = process.env.AMADEUS_API_SECRET || '';
    this.baseURL = process.env.AMADEUS_API_URL || 'https://test.api.amadeus.com';

    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to ensure token is valid
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        // Skip auth for token endpoint
        if (config.url?.includes('/security/oauth2/token')) {
          return config;
        }

        await this.ensureValidToken();
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        // If token expired, refresh and retry once
        if (error.response?.status === 401 && !error.config._retry) {
          error.config._retry = true;
          this.accessToken = null;
          this.tokenExpiresAt = null;
          await this.ensureValidToken();
          error.config.headers.Authorization = `Bearer ${this.accessToken}`;
          return this.axiosInstance.request(error.config);
        }
        return Promise.reject(error);
      }
    );
  }

  private async getAccessToken(): Promise<string> {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('Amadeus API credentials not found in environment variables');
    }

    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', this.apiKey);
      params.append('client_secret', this.apiSecret);

      const response = await axios.post<TokenResponse>(
        `${this.baseURL}/v1/security/oauth2/token`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      // Set expiration time with 5 minute buffer
      this.tokenExpiresAt = Date.now() + (response.data.expires_in - 300) * 1000;

      return this.accessToken;
    } catch (error: any) {
      throw new Error('Failed to authenticate with Amadeus API');
    }
  }

  private async ensureValidToken(): Promise<void> {
    if (!this.accessToken || !this.tokenExpiresAt || Date.now() >= this.tokenExpiresAt) {
      await this.getAccessToken();
    }
  }

  public async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(url, { params });
      return response.data;
    } catch (error: any) {
      const status = error.response?.status;
      const errorData = error.response?.data;

      // Provide user-friendly error messages
      if (status === 401) {
        throw new Error('Authentication failed. Please check your Amadeus API credentials.');
      } else if (status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (status === 400) {
        const errorMsg = errorData?.errors?.[0]?.detail || 'Invalid request parameters';
        throw new Error(errorMsg);
      } else {
        throw new Error('Failed to fetch data from Amadeus API. Please try again.');
      }
    }
  }
}

// Export singleton instance
export const amadeusServerClient = new AmadeusServerClient();
