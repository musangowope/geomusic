import { SafeAreaView, StyleSheet, View } from 'react-native';

import MusicMap from '@/features/music-map/components/MusicMap';
import Header from '@/components/ui/Header';
import { useLocalSearchParams, useRouter } from 'expo-router';
import useThemeColors from '@/hooks/useThemeColors';
import { ThemedView } from '@/components/ThemedView';
import { AddressAutocomplete } from '@/features/music-map/components/AutoSearchSuggestion';
import useGetLocation, {
  LocationData,
} from '@/features/music-map/hooks/useGetLocation';
import React, { useEffect, useState } from 'react';
import googleMapsService, {
  PlacePrediction,
} from '@/features/music-map/services/google-maps.service';
import { useGetPlaylistByIdQuery } from '@/redux/queries/spotifyPlaylistQuery';

export default function PinPlaylistScreen() {
  const [locationState, setLocation] = useState<LocationData | null>(null);
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const {
    data: playlist,
    isLoading,
    isFetching,
  } = useGetPlaylistByIdQuery(id as string);
  const themeColors = useThemeColors();

  const { currentLocation } = useGetLocation();
  const onSelectAddress = (address: PlacePrediction) => {
    (async () => {
      const placeDetails = await googleMapsService.getPlaceDetails(
        address.place_id
      );
      if (!placeDetails) return;
      const { location } = placeDetails;
      setLocation({
        latitude: location.latitude,
        longitude: location.longitude,
      });
    })();
  };
  useEffect(() => {
    if (!currentLocation) return;
    setLocation(currentLocation);
  }, [currentLocation]);

  if (isLoading || isFetching) return null;

  return (
    <SafeAreaView style={styles.screen}>
      <ThemedView style={styles.headerContainer}>
        <Header
          leftIcon={{
            iconProps: {
              iconType: 'AntDesign',
              iconName: 'arrowleft',
              color: themeColors.textPrimary,
            },
            pressableProps: {
              onPress: () => router.back(),
            },
          }}
          headerText={'Choose a location'}
        />
        <ThemedView style={styles.inputButtonContainer}>
          <ThemedView style={styles.autoSuggestion}>
            <AddressAutocomplete onSelectAddress={onSelectAddress} />
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {locationState && (
        <ThemedView style={styles.musicMapContainer}>
          <MusicMap currentLocation={locationState} playlist={playlist} />
        </ThemedView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: 'black',
    flex: 1,
    height: '100%',
    position: 'relative',
  },
  headerContainer: {
    position: 'relative',
    zIndex: 99,
    paddingBottom: 20,
    // paddingRight: 20,
    // paddingLeft: 20,
  },

  autoSuggestion: {
    marginBottom: 20,
  },
  inputButtonContainer: {
    paddingRight: 30,
    paddingLeft: 30,
  },

  musicMapContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    // top: 0,
    bottom: 0,
    left: 0,
  },

  cta: {
    // display:
    // width: 150,
  },
});
