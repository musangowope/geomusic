import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { spotifyPlaylistsQuery } from '@/redux/queries/spotifyPlaylistQuery';
import playlistsReducer from './slices/geoPlaylistSlice';

/**
 * Configure the Redux store with optimized settings
 */
export const store = configureStore({
  reducer: {
    [spotifyPlaylistsQuery.reducerPath]: spotifyPlaylistsQuery.reducer,
    geoPlaylists: playlistsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Optimize serialization checks for better performance
      serializableCheck: {
        // Ignore RTK Query action types in serialization checks
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'spotifyPlaylistsQuery/executeQuery/fulfilled',
        ],
        // Ignore paths that might contain non-serializable values (like Firebase timestamps)
        ignoredPaths: [
          `${spotifyPlaylistsQuery.reducerPath}.queries`,
          'geoPlaylists.playlists',
        ],
      },
      // Disable immutability checks in production for better performance
      immutableCheck: process.env.NODE_ENV === 'development',
    }).concat(spotifyPlaylistsQuery.middleware),
  // Enable Redux DevTools in development only
  devTools: process.env.NODE_ENV !== 'production',
});

// Setup listeners for RTK Query to enable refetchOnFocus and other features
setupListeners(store.dispatch);

// Export types for TypeScript
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Optional: Create a pre-typed useDispatch and useSelector hooks
// These can be imported in a separate hooks.ts file if preferred
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
