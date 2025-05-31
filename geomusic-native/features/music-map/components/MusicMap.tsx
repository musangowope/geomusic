import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  Dimensions,
  Image,
  Keyboard,
} from 'react-native';
// @ts-ignore
import MapView, { Marker, Region, MapEvent, Callout } from 'react-native-maps';
import useGetLocation, {
  LocationData,
} from '@/features/music-map/hooks/useGetLocation';
import { Ionicons } from '@expo/vector-icons';
import PlaylistMarker, { PlaylistMarkerProps } from './PlaylistMarker';
import { ThemedText } from '@/components/ThemedText';
import { SpotifyPlaylistDetailResponse } from '@/features/spotify/interfaces';
import CtaButton from '@/components/ui/button/Button';
import { FontSizes } from '@/constants/Typography';
import {
  addGeoPlaylist,
  fetchPlaylists,
} from '@/redux/slices/geoPlaylistSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { useRouter } from 'expo-router';

// Get screen dimensions for proper delta calculations
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.01; // More zoomed in for better accuracy
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

interface MusicMapProps {
  currentLocation: LocationData;
  playlist?: SpotifyPlaylistDetailResponse;
}

const MusicMap = (props: MusicMapProps) => {
  const { currentLocation, playlist } = props;
  // const { currentLocation } = useGetLocation();
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825, // Default latitude
    longitude: -122.4324, // Default longitude
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

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

  console.log('playlisyMarkers', playlistMarkers);

  useEffect(() => {
    // Fetch playlists when component mounts
    dispatch(fetchPlaylists());
  }, []);

  //

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
    console.log('playlist pinned', playlist);
    if (!playlist || !selectedLocation) return;

    await dispatch(
      addGeoPlaylist({
        createdAt: Date.now(),
        ...playlist,
        location: {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        },
      })
    );

    // Fetch updated playlists after adding a new one
    await dispatch(fetchPlaylists());

    // Force map to update markers
    setMarkersKey((prev) => prev + 1);

    router.replace('/(auth)');
  };

  // Memoize the rendering of markers for better performance
  const renderMarkers = useCallback(() => {
    return (
      <>
        <PlaylistMarker
          key="selected-marker"
          playlist={playlist}
          coordinate={selectedLocation}
        />
        {playlistMarkers.map((marker, index) => (
          <PlaylistMarker
            key={`marker-${marker.id || index}-${marker.createdAt}`}
            playlist={marker}
            coordinate={marker.location}
          />
        ))}
      </>
    );
  }, [selectedLocation, playlist, playlistMarkers, markersKey]);

  return (
    <>
      <ThemedText>
        {selectedLocation?.latitude} {selectedLocation?.longitude}
      </ThemedText>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          // TODO: I might change this ux later
          onLongPress={handleMapPress}
          key={`map-${markersKey}`}
        >
          {renderMarkers()}
        </MapView>

        {selectedLocation && (
          <View style={styles.pinButtonContainer}>
            <CtaButton
              onPress={pinPlaylist}
              mode={'secondary'}
              text={'Pin Playlist'}
              style={styles.pinButton}
              textStyle={styles.pinButtonText}
            ></CtaButton>
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
