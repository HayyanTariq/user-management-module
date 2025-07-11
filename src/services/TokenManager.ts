// services/TokenManager.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../context/AuthTypes';

export class TokenManager {
  private static TOKEN_KEY = '@auth_token';
  private static REFRESH_TOKEN_KEY = '@auth_refresh_token';
  private static USER_KEY = '@auth_user';

  static setStorageKeys(tokenKey?: string, refreshTokenKey?: string) {
    if (tokenKey) this.TOKEN_KEY = tokenKey;
    if (refreshTokenKey) this.REFRESH_TOKEN_KEY = refreshTokenKey;
  }

  static async saveTokens(
    accessToken: string, 
    refreshToken?: string, 
    user?: User
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(this.TOKEN_KEY, accessToken);
      if (refreshToken) {
        await AsyncStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      }
      if (user) {
        await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error saving tokens:', error);
      throw error;
    }
  }

  static async getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem(this.TOKEN_KEY);
  }

  static async getRefreshToken(): Promise<string | null> {
    return AsyncStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static async getUser(): Promise<User | null> {
    const userJson = await AsyncStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  static async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.TOKEN_KEY,
        this.REFRESH_TOKEN_KEY,
        this.USER_KEY
      ]);
    } catch (error) {
      console.error('Error clearing tokens:', error);
      throw error;
    }
  }

  static async hasValidToken(): Promise<boolean> {
    const token = await this.getAccessToken();
    return !!token;
  }
}