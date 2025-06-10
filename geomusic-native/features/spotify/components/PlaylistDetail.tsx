import React from 'react';
import { PlaylistTrackItem } from '@/features/spotify/interfaces';
import MiddleCtasCard, {
  MiddleCtasCardProps,
} from '@/components/ui/card/MiddleCtasCard';
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Header from '@/components/ui/Header';
import useThemeColors from '@/hooks/useThemeColors';
import { useGetPlaylistByIdQuery } from '@/redux/queries/spotifyPlaylistQuery';
import { ThemedText } from '@/components/ThemedText';

interface PlaylistDetailProps {
  id: string;
}

const PlaylistDetail = (props: PlaylistDetailProps) => {
  const { id } = props;

  const { data, isLoading, isFetching } = useGetPlaylistByIdQuery(id as string);

  const themeColors = useThemeColors();

  const openSpotifyTrack = async (trackId: string, trackName: string) => {
    try {
      // Spotify app deep link
      const spotifyAppUrl = `spotify:track:${trackId}`;
      // Spotify web fallback
      const spotifyWebUrl = `https://open.spotify.com/track/${trackId}`;

      // Check if Spotify app can be opened
      const canOpenSpotifyApp = await Linking.canOpenURL(spotifyAppUrl);

      if (canOpenSpotifyApp) {
        // Open in Spotify app
        await Linking.openURL(spotifyAppUrl);
      } else {
        // Fallback to web browser
        const canOpenWeb = await Linking.canOpenURL(spotifyWebUrl);
        if (canOpenWeb) {
          await Linking.openURL(spotifyWebUrl);
        } else {
          Alert.alert(
            'Unable to Open Spotify',
            'Please install the Spotify app or check your internet connection.'
          );
        }
      }
    } catch (error) {
      console.error('Error opening Spotify:', error);
      Alert.alert(
        'Error',
        `Unable to open "${trackName}" in Spotify. Please try again.`
      );
    }
  };

  if (isFetching || isLoading)
    return (
      <SafeAreaView>
        <ThemedText>Loading</ThemedText>
      </SafeAreaView>
    );

  const cardProps = (item: PlaylistTrackItem): MiddleCtasCardProps => {
    return {
      title: item.track.name,
      subtitle: item.track.artists.map((artist) => artist.name).join(', '),
      circleImage: item.track.album.images[0].url,
      iconButton: {
        color: themeColors.spotifyGreen,
        size: 32,
        iconType: 'Entypo',
        iconName: 'spotify',
        onPress: () => {
          openSpotifyTrack(item.track.id, item.track.name);
        },
        overrideStyles: {
          overrideButtonStyle: {
            width: 40,
            height: 40,
          },
        },
      },
      ctaButton: {
        mode: 'primary',
        text: 'Preview',
        onPress: () => {
          console.log('cta button');
        },
      },
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header headerText={data?.name}></Header>
      <ScrollView style={styles.scrollView}>
        {data?.tracks.items.map((item, index) => (
          <MiddleCtasCard key={index} {...cardProps(item)} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlaylistDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: ' 100%',
  },
  scrollView: {
    padding: 20,
    width: '100%',
    maxWidth: 400,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});
