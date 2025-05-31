import React from 'react';
import { Callout, Marker } from 'react-native-maps';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SpotifyPlaylistDetailResponse } from '@/features/spotify/interfaces';
import useThemeColors from '@/hooks/useThemeColors';
import CtaButton from '@/components/ui/button/Button';
import { ThemedText } from '@/components/ThemedText';
import { useAppDispatch } from '@/redux/store';
import { addGeoPlaylist } from '@/redux/slices/geoPlaylistSlice';

export interface PlaylistMarkerProps {
  id?: string;
  playlist?: SpotifyPlaylistDetailResponse;
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

const PlaylistMarker = (props: PlaylistMarkerProps) => {
  const { coordinate, playlist } = props;
  const dispatch = useAppDispatch();

  const title = playlist?.name;
  const description = playlist?.description;
  const themeColors = useThemeColors();

  const pinPlaylist = async () => {
    console.log('playlist pinned', playlist);
    if (!playlist) return;
    dispatch(
      addGeoPlaylist({
        createdAt: 0,
        ...playlist,
        location: {
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
        },
      })
    );
  };

  return (
    <Marker
      coordinate={coordinate}
      title={title}
      description={description}
      // Remove the default pin
      anchor={{ x: 0.5, y: 0.5 }}
    >
      {/* Custom marker UI */}

      <View
        style={[
          styles.borderOuter,
          {
            backgroundColor: themeColors.background,
            borderColor: themeColors.secondary,
          },
        ]}
      >
        <View
          style={[
            styles.borderInner,
            {
              borderColor: themeColors.secondary,
            },
          ]}
        >
          <Image
            src={playlist?.images[0]?.url}
            style={styles.borderInnerImage}
          />
        </View>
      </View>

      {/*<Callout tooltip onPress={(e) => e.stopPropagation()}>*/}
      {/*  <View*/}
      {/*    style={[*/}
      {/*      styles.calloutView,*/}
      {/*      {*/}
      {/*        backgroundColor: themeColors.surface,*/}
      {/*      },*/}
      {/*    ]}*/}
      {/*  >*/}
      {/*    <ThemedText style={styles.calloutTitle}>{title}</ThemedText>*/}
      {/*    {description && (*/}
      {/*      <ThemedText style={styles.calloutDescription}>*/}
      {/*        {description}*/}
      {/*      </ThemedText>*/}
      {/*    )}*/}
      {/*    {playlist?.images?.[0]?.url && (*/}
      {/*      <Image*/}
      {/*        source={{ uri: playlist.images[0].url }}*/}
      {/*        style={styles.calloutImage}*/}
      {/*        resizeMode="cover"*/}
      {/*      />*/}
      {/*    )}*/}
      {/*    <View style={styles.buttonContainer}>*/}
      {/*      <TouchableOpacity*/}
      {/*        style={[*/}
      {/*          styles.buttonWrapper,*/}
      {/*          { backgroundColor: themeColors.primary },*/}
      {/*        ]}*/}
      {/*        onPress={pinPlaylist}*/}
      {/*        activeOpacity={0.7}*/}
      {/*      >*/}
      {/*        <ThemedText style={styles.buttonText}>Pin playlist</ThemedText>*/}
      {/*      </TouchableOpacity>*/}
      {/*    </View>*/}
      {/*  </View>*/}
      {/*</Callout>*/}
    </Marker>
  );
};

export default PlaylistMarker;

const styles = StyleSheet.create({
  borderOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 90,
    borderRadius: 50,
    borderWidth: 1,
  },
  borderInner: {
    width: 80,
    height: 80,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 1,
  },
  borderInnerImage: {
    width: '100%',
    height: '100%',
  },
  calloutView: {
    width: 200,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  calloutDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  calloutImage: {
    width: '100%',
    height: 100,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 5,
  },
  buttonWrapper: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
