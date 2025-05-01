import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_STORAGE_KEY } from '@/features/authentication/providers/SpotifyAuthProvider';
import {
  SpotifyPlaylistsResponse,
  PlaylistItem,
  SpotifyPlaylistDetailResponse,
} from '@/features/spotify/interfaces';

export const playlistsApi = createApi({
  reducerPath: 'playlistsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.spotify.com/v1/',
    prepareHeaders: async (headers) => {
      // Get the token from AsyncStorage
      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        headers.set('Content-Type', 'application/json');
      } else {
        console.error('No access to Spotify API');
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPlaylists: builder.query<PlaylistItem[], void>({
      query: () => 'me/playlists',
      transformResponse: (response: SpotifyPlaylistsResponse) => response.items,
    }),
    getPlaylistById: builder.query<SpotifyPlaylistDetailResponse, string>({
      query: (playlistId) => `playlists/${playlistId}`,
    }),
    getUserPlaylists: builder.query<PlaylistItem[], string>({
      query: (userId) => `users/${userId}/playlists`,
      transformResponse: (response: SpotifyPlaylistsResponse) => response.items,
    }),
  }),
});

export const {
  useGetPlaylistsQuery,
  useGetPlaylistByIdQuery,
  useGetUserPlaylistsQuery,
} = playlistsApi;
