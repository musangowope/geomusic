import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SpotifyPlaylistDetailResponse } from '@/features/spotify/interfaces';
import {
  addDataToCollection,
  deleteDocument,
  getDataFromCollection,
  updateDocument,
} from '@/features/firebase/config';

// Define the GeoPlaylist interface that extends SpotifyPlaylistDetailResponse with location data
export interface GeoPlaylist {
  location: {
    latitude: number;
    longitude: number;
  };
  createdAt?: number; // timestamp
  createdBy?: string; // user ID who created this geotagged playlist
  spotifyPlaylist: SpotifyPlaylistDetailResponse;
  id?: string;
}

// Define the state interface
interface GeoPlaylistsState {
  playlists: GeoPlaylist[];
  filteredPlaylists: GeoPlaylist[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentFilter: {
    type: 'none' | 'location';
    value: any;
  };
}

// Initial state
const initialState: GeoPlaylistsState = {
  playlists: [],
  filteredPlaylists: [],
  status: 'idle',
  error: null,
  currentFilter: {
    type: 'none',
    value: null,
  },
};

// Collection name in Firestore
const COLLECTION_NAME = 'playlists';

// Async thunks
export const fetchPlaylists = createAsyncThunk(
  'playlists/fetchPlaylists',
  async () => {
    const response = await getDataFromCollection(COLLECTION_NAME);
    return response as GeoPlaylist[];
  }
);

export const fetchPlaylistsNearLocation = createAsyncThunk(
  'playlists/fetchPlaylistsNearLocation',
  async ({
    latitude,
    longitude,
    radiusInKm,
  }: {
    latitude: number;
    longitude: number;
    radiusInKm: number;
  }) => {
    // First get all playlists
    const allPlaylists = (await getDataFromCollection(
      COLLECTION_NAME
    )) as GeoPlaylist[];

    // Filter playlists based on distance
    const nearbyPlaylists = allPlaylists.filter((playlist) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        playlist.location.latitude,
        playlist.location.longitude
      );
      return distance <= radiusInKm;
    });

    return {
      playlists: nearbyPlaylists,
      location: { latitude, longitude, radiusInKm },
    };
  }
);

export const addGeoPlaylist = createAsyncThunk(
  'playlists/addGeoPlaylist',
  async (data: Omit<GeoPlaylist, 'id'>) => {
    // Ensure createdAt is set
    const playlistWithTimestamp = {
      ...data,
      createdAt: Date.now(),
    };

    const docRef = await addDataToCollection(
      COLLECTION_NAME,
      playlistWithTimestamp
    );
    return { ...playlistWithTimestamp, id: docRef.id };
  }
);

export const updateGeoPlaylist = createAsyncThunk(
  'playlists/updateGeoPlaylist',
  async ({ id, updates }: { id: string; updates: Partial<GeoPlaylist> }) => {
    await updateDocument(COLLECTION_NAME, id, updates);
    return { id: id, ...updates };
  }
);

export const deleteGeoPlaylist = createAsyncThunk(
  'playlists/deleteGeoPlaylist',
  async (id: string) => {
    await deleteDocument(COLLECTION_NAME, id);
    return id;
  }
);

// Helper function to calculate distance between two points using Haversine formula
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// Create the slice
const playlistsSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    clearFilter: (state) => {
      state.filteredPlaylists = state.playlists;
      state.currentFilter = { type: 'none', value: null };
    },
    setFilteredPlaylists: (state, action: PayloadAction<GeoPlaylist[]>) => {
      state.filteredPlaylists = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchPlaylists
      .addCase(fetchPlaylists.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlaylists.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.playlists = action.payload;
        state.filteredPlaylists = action.payload;
        state.currentFilter = { type: 'none', value: null };
      })
      .addCase(fetchPlaylists.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch playlists';
      })

      // Handle fetchPlaylistsNearLocation
      .addCase(fetchPlaylistsNearLocation.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlaylistsNearLocation.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.filteredPlaylists = action.payload.playlists;
        state.currentFilter = {
          type: 'location',
          value: action.payload.location,
        };
      })
      .addCase(fetchPlaylistsNearLocation.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.error.message || 'Failed to fetch nearby playlists';
      })

      // Handle addGeoPlaylist
      .addCase(addGeoPlaylist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addGeoPlaylist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.playlists.push(action.payload);

        // If no filter is applied, also add to filtered playlists
        if (state.currentFilter.type === 'none') {
          state.filteredPlaylists.push(action.payload);
        }
        // If location filter is applied, we'd need to check distance
        // This is more complex and might require recalculating the entire filter
        else if (state.currentFilter.type === 'location') {
          const { latitude, longitude, radiusInKm } = state.currentFilter.value;
          const distance = calculateDistance(
            latitude,
            longitude,
            action.payload.location.latitude,
            action.payload.location.longitude
          );

          if (distance <= radiusInKm) {
            state.filteredPlaylists.push(action.payload);
          }
        }
      })
      .addCase(addGeoPlaylist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to add playlist';
      })

      // Handle updateGeoPlaylist
      .addCase(updateGeoPlaylist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateGeoPlaylist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id, ...updates } = action.payload;

        // Update in main playlists array
        const playlistIndex = state.playlists.findIndex(
          (playlist) => playlist.id === id
        );
        if (playlistIndex !== -1) {
          state.playlists[playlistIndex] = {
            ...state.playlists[playlistIndex],
            ...updates,
          };
        }

        // Update in filtered playlists array if present
        const filteredIndex = state.filteredPlaylists.findIndex(
          (playlist) => playlist.id === id
        );
        if (filteredIndex !== -1) {
          state.filteredPlaylists[filteredIndex] = {
            ...state.filteredPlaylists[filteredIndex],
            ...updates,
          };
        }
      })
      .addCase(updateGeoPlaylist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update playlist';
      })

      // Handle deleteGeoPlaylist
      .addCase(deleteGeoPlaylist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteGeoPlaylist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const id = action.payload;
        state.playlists = state.playlists.filter(
          (playlist) => playlist.id !== id
        );
        state.filteredPlaylists = state.filteredPlaylists.filter(
          (playlist) => playlist.id !== id
        );
      })
      .addCase(deleteGeoPlaylist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete playlist';
      });
  },
});

// Export actions and reducer
export const { clearFilter, setFilteredPlaylists } = playlistsSlice.actions;
export default playlistsSlice.reducer;
