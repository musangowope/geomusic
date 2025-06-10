import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
// @ts-ignore
import MapView, { Marker, Region, MapEvent, Callout } from 'react-native-maps';
import { LocationData } from '@/features/music-map/hooks/useGetLocation';
import { Ionicons } from '@expo/vector-icons';
import PlaylistMarker from './PlaylistMarker';
import { SpotifyPlaylistDetailResponse } from '@/features/spotify/interfaces';
import CtaButton from '@/components/ui/button/Button';
import { FontSizes } from '@/constants/Typography';
import {
  addGeoPlaylist,
  fetchPlaylists,
  GeoPlaylist,
} from '@/redux/slices/geoPlaylistSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { useRouter } from 'expo-router';

// Get screen dimensions for proper delta calculations
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.01; // More zoomed in for better accuracy
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export interface MusicMapProps {
  currentLocation: LocationData;
  playlist?: SpotifyPlaylistDetailResponse;
  events?: {
    onPlaylistMarkerPress: (geoPlaylist: GeoPlaylist) => void;
  };
}

const MusicMap = (props: MusicMapProps) => {
  const { currentLocation, playlist, events } = props;
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825, // Default latitude
    longitude: -122.4324, // Default longitude
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  console.log('events', events?.onPlaylistMarkerPress);

  const dispatch = useAppDispatch();

  // State for markers and modal
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  }>(currentLocation);
  const router = useRouter();
  const { playlists: playlistMarkers = [] } = useAppSelector(
    ({ geoPlaylists }) => geoPlaylists
  );

  // Force re-render when markers change
  const [markersKey, setMarkersKey] = useState(0);

  // Fetch playlists when component mounts
  useEffect(() => {
    const loadPlaylists = async () => {
      await dispatch(fetchPlaylists());
      // Update markersKey to force re-render after playlists are loaded
      setMarkersKey((prev) => prev + 1);
    };

    loadPlaylists();
    console.log('do I run again?');
  }, [dispatch]);

  // Update region when currentLocation changes
  useEffect(() => {
    if (currentLocation) {
      const newRegion = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
      setRegion(newRegion);

      // Animate to the new region
      mapRef.current?.animateToRegion(newRegion);
    }
  }, [currentLocation]);

  // Update markersKey when playlistMarkers change to force re-render
  useEffect(() => {
    if (playlistMarkers.length > 0) {
      setMarkersKey((prev) => prev + 1);
    }
  }, [playlistMarkers]);

  // Handle map press to add a new marker
  const handleMapPress = (e: MapEvent) => {
    setSelectedLocation(e.nativeEvent.coordinate);
  };

  // Center map on user location
  const centerOnUser = () => {
    if (currentLocation) {
      mapRef.current?.animateToRegion(
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        1000
      );
    }
  };

  const pinPlaylist = async () => {
    if (!playlist || !selectedLocation) return;

    await dispatch(
      addGeoPlaylist({
        createdAt: Date.now(),
        location: {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        },
        spotifyPlaylist: playlist,
      })
    );

    // Fetch updated playlists after adding a new one
    // await dispatch(fetchPlaylists());

    // Force map to update markers
    setMarkersKey((prev) => prev + 1);
    // TODO: there is probably a better way to do this
    Array.from(Array(2).keys()).forEach(() => {
      router.back();
    });
  };

  // Render markers - removed memoization to ensure it always renders with fresh data
  const renderMarkers = useCallback(() => {
    return (
      <>
        {selectedLocation && playlist && (
          <PlaylistMarker
            key="selected-marker"
            spotifyPlaylist={playlist}
            location={selectedLocation}
          />
        )}
        {playlistMarkers.map((marker, index) => (
          <PlaylistMarker
            key={`marker-${marker.id || index}-${marker.createdAt}`}
            spotifyPlaylist={marker.spotifyPlaylist}
            location={marker.location}
            events={{
              onPress: () => events?.onPlaylistMarkerPress(marker),
            }}
          />
        ))}
      </>
    );
  }, [selectedLocation, playlistMarkers]);

  return (
    <>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onLongPress={handleMapPress}
          key={`map-${markersKey}`}
        >
          {renderMarkers()}
        </MapView>

        {selectedLocation && playlist && (
          <View style={styles.pinButtonContainer}>
            <CtaButton
              onPress={pinPlaylist}
              mode={'secondary'}
              text={'Pin Playlist'}
              style={styles.pinButton}
              textStyle={styles.pinButtonText}
            />
          </View>
        )}

        {/* Custom location button */}
        <TouchableOpacity style={styles.locationButton} onPress={centerOnUser}>
          <Ionicons name="locate" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  pinButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  pinButton: {
    padding: 20,
  },
  pinButtonText: {
    fontSize: FontSizes.xxl,
  },
  locationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default MusicMap;
