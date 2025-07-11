// services/AuthApiClient.ts
import { AuthConfig, AuthResponse, User } from '../context/AuthTypes';
import { TokenManager } from './TokenManager';

export class AuthApiClient {
  private config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = config;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.config.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
  }

  async signup(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    return this.request<AuthResponse>(this.config.endpoints.signup, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    return this.request<AuthResponse>(this.config.endpoints.login, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    await this.request<void>(this.config.endpoints.logout, {
      method: 'POST',
    });
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return this.request<AuthResponse>(this.config.endpoints.refresh, {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await TokenManager.getAccessToken();
      if (!token) return null;

      const response = await fetch(`${this.config.baseURL}${this.config.endpoints.user}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) return null;

      const data = await response.json();
      return data.user || null;
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      return null;
    }
  }

  async googleSignIn(idToken: string): Promise<AuthResponse> {
    return this.request<AuthResponse>(this.config.endpoints.googleSignIn || '/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  }

  async deleteAccount(): Promise<void> {
    await this.request<void>(this.config.endpoints.delete, {
      method: 'DELETE',
    });
  }
}