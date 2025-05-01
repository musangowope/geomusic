import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { playlistsApi } from '@/redux/api/playlistApi';

export const store = configureStore({
  reducer: {
    [playlistsApi.reducerPath]: playlistsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(playlistsApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
