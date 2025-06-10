import React from 'react';
import { Marker } from 'react-native-maps';
import { Image, StyleSheet, View } from 'react-native';
import useThemeColors from '@/hooks/useThemeColors';
import { GeoPlaylist } from '@/redux/slices/geoPlaylistSlice';
export interface PlaylistMarkerProps extends GeoPlaylist {
  events?: {
    onPress?: (id: string) => void;
  };
}

const PlaylistMarker = (props: PlaylistMarkerProps) => {
  const { location, spotifyPlaylist: playlist, events } = props;

  const title = playlist?.name;
  const description = playlist?.description;
  const themeColors = useThemeColors();

  return (
    <Marker
      onPress={() => events?.onPress?.(playlist?.id ?? '')}
      coordinate={location}
      title={title}
      description={description}
      // Remove the default pin
      anchor={{ x: 0.5, y: 0.5 }}
    >
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
