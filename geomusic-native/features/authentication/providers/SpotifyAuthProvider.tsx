import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as WebBrowser from 'expo-web-browser';
import {
  makeRedirectUri,
  useAuthRequest,
  exchangeCodeAsync,
} from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// Initialize WebBrowser for auth session
WebBrowser.maybeCompleteAuthSession();

// Spotify API endpoints
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

// Storage keys
export const TOKEN_STORAGE_KEY = '@SpotifyAuth:token';
export const EXPIRATION_STORAGE_KEY = '@SpotifyAuth:expiration';
export const REFRESH_TOKEN_STORAGE_KEY = '@SpotifyAuth:refreshToken';

// Interfaces
interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyUserProfile {
  id: string;
  display_name: string;
  email: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  images: SpotifyImage[];
  product: string;
  type: string;
  uri: string;
  country?: string;
  followers?: {
    total: number;
  };
}

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export interface SpotifyAuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshToken: string | null;
  authToken: string | null;
  userInfo: SpotifyUserProfile | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

interface SpotifyAuthProviderProps {
  children: ReactNode;
}

// Create context
export const SpotifyAuthContext = createContext<
  SpotifyAuthContextValue | undefined
>(undefined);

export const SpotifyAuthProvider: React.FC<SpotifyAuthProviderProps> = ({
  children,
}) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userInfo, setUserInfo] = useState<SpotifyUserProfile | null>(null);

  const router = useRouter();

  const redirectUri = makeRedirectUri({
    scheme: 'com.playfului.geomusic-native',
  });

  console.log('redirectUri', redirectUri);

  // Environment variables (replace with your actual client ID and secret)
  const clientId = process.env.EXPO_PUBLIC_CLIENT_ID || '';
  const clientSecret = process.env.EXPO_PUBLIC_CLIENT_SECRET || '';
  const scopes = [
    'user-read-email',
    'playlist-modify-public',
    'user-read-private',
    'user-read-playback-state',
    'user-modify-playback-state',
    'playlist-read-private',
  ];

  // Set up auth request
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      scopes,
      usePKCE: false,
      redirectUri,
    },
    discovery
  );

  // Load stored auth data on mount
  useEffect(() => {
    const loadTokens = async (): Promise<void> => {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
        const storedExpiration = await AsyncStorage.getItem(
          EXPIRATION_STORAGE_KEY
        );
        const storedRefreshToken = await AsyncStorage.getItem(
          REFRESH_TOKEN_STORAGE_KEY
        );

        if (storedToken && storedExpiration && storedRefreshToken) {
          const expirationTime = new Date(storedExpiration);

          // Check if token is expired
          if (expirationTime > new Date()) {
            setAuthToken(storedToken);
            setExpirationDate(expirationTime);
            setRefreshToken(storedRefreshToken);
            // Load user info with valid token
            fetchUserInfo(storedToken);
          } else {
            // Token expired, try to refresh
            refreshAccessToken(storedRefreshToken);
          }
        }
      } catch (error) {
        console.error('Failed to load authentication state', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTokens();
  }, []);

  // Handle authentication response
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      exchangeCodeForToken(code);
    } else if (response?.type === 'error') {
      console.error('Authentication error:', response.error);
      setIsLoading(false);
    }
  }, [response]);

  // Exchange authorization code for tokens
  const exchangeCodeForToken = async (code: string): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('code', code);
      const tokenResult = await exchangeCodeAsync(
        {
          clientId,
          clientSecret,
          code,
          redirectUri,
          extraParams: {
            grant_type: 'authorization_code',
          },
        },
        discovery
      );

      const { accessToken, refreshToken, expiresIn } = tokenResult;

      // Calculate expiration date
      const expiration = new Date();
      expiration.setSeconds(expiration.getSeconds() + expiresIn);

      // Save everything to state and storage
      await storeAuthData(accessToken, refreshToken, expiration);

      // Fetch user data
      fetchUserInfo(accessToken);
    } catch (error) {
      console.error('Token exchange error:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      router.replace('/(auth)');
    } else {
      router.replace('/login');
    }
  }, [userInfo]);

  // Refresh the access token
  const refreshAccessToken = async (
    storedRefreshToken: string
  ): Promise<void> => {
    try {
      setIsLoading(true);

      const refreshResponse = await fetch(discovery.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${require('react-native').Base64.btoa(
            `${clientId}:${clientSecret}`
          )}`,
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: storedRefreshToken,
        }).toString(),
      });

      const refreshData =
        (await refreshResponse.json()) as SpotifyTokenResponse;

      if (refreshResponse.ok) {
        const { access_token, expires_in, refresh_token } = refreshData;

        // Calculate new expiration
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + expires_in);

        // Sometimes Spotify doesn't return a new refresh token, so use the old one if needed
        const newRefreshToken = refresh_token || storedRefreshToken;

        // Store updated tokens
        await storeAuthData(access_token, newRefreshToken, expiration);

        // Get user info with new token
        fetchUserInfo(access_token);
      } else {
        throw new Error(
          (refreshData as any).error_description || 'Failed to refresh token'
        );
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Store authentication data
  const storeAuthData = async (
    token: string,
    refresh: string,
    expiration: Date
  ): Promise<void> => {
    try {
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      await AsyncStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refresh);
      await AsyncStorage.setItem(
        EXPIRATION_STORAGE_KEY,
        expiration.toISOString()
      );

      setAuthToken(token);
      setRefreshToken(refresh);
      setExpirationDate(expiration);
    } catch (error) {
      console.error('Failed to store auth data:', error);
    }
  };

  // Fetch user information
  const fetchUserInfo = async (token: string): Promise<void> => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = (await response.json()) as SpotifyUserProfile;
        console.log('userData', userData);
        setUserInfo(userData);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Log the user out
  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      await AsyncStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
      await AsyncStorage.removeItem(EXPIRATION_STORAGE_KEY);

      setAuthToken(null);
      setRefreshToken(null);
      setExpirationDate(null);
      setUserInfo(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Calculate if token is valid
  const isTokenValid = (): boolean => {
    return Boolean(authToken && expirationDate && new Date() < expirationDate);
  };

  // Start the login flow
  const login = async (): Promise<void> => {
    if (request) {
      await promptAsync();
    }
  };

  // Provide context value
  const value: SpotifyAuthContextValue = {
    isAuthenticated: isTokenValid(),
    isLoading,
    refreshToken,
    authToken,
    userInfo,
    login,
    logout,
  };

  return (
    <SpotifyAuthContext.Provider value={value}>
      {children}
    </SpotifyAuthContext.Provider>
  );
};
