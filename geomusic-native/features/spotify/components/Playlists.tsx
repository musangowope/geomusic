import React, { useState } from 'react';
import useThemeColors from '@/hooks/useThemeColors';
import { PlaylistItem } from '@/features/spotify/interfaces';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import Input from '@/components/ui/input/Input';
import TopIconsAndCtaCard, {
  CardWithTopIconButtonsAndCtaProps,
} from '@/components/ui/card/TopIconsAndCtaCard';
import { useRouter } from 'expo-router';

interface PlaylistsProps {
  playlists?: PlaylistItem[];
}

const Playlists = (props: PlaylistsProps) => {
  const themeColors = useThemeColors();
  const [search, setSearch] = useState<string>();
  const { playlists = [] } = props;

  const router = useRouter();

  const onSpotifyButtonPress = (id: string) => {
    // Types can be: album, artist, playlist, track, show, episode
    const spotifyUrl = `spotify:playlist:${id}`;

    Linking.canOpenURL(spotifyUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(spotifyUrl).then(() => {
            Linking.openURL('exp://192.168.1.69:8081');
          });
        } else {
          // If Spotify app is not installed, open in web browser
          const webUrl = `https://open.spotify.com/playlist/${id}`;
          return Linking.openURL(webUrl);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  const cardProps = (data: PlaylistItem): CardWithTopIconButtonsAndCtaProps => {
    return {
      title: data.name,
      subtitle: `${data.tracks.total} songs`,
      circleImage: data.images?.length ? data.images[0].url : undefined,
      cta: {
        onPress: () => {
          router.navigate({
            pathname: '/(playlists)/pin-playlist',
            params: {
              id: data.id,
            },
          });
        },
        mode: 'primary',
        text: 'Pin playlist',
      },
      topCornerCircleButtons: [
        {
          color: themeColors.spotifyGreen,
          size: 32,
          iconType: 'Entypo',
          iconName: 'spotify',
          onPress: () => onSpotifyButtonPress(data.id),
          overrideStyles: {
            overrideButtonStyle: {
              width: 40,
              height: 40,
            },
          },
        },
        {
          onPress: () => router.navigate(`/(playlists)/${data.id}`),
          size: 24,
          iconType: 'AntDesign',
          iconName: 'eye',
          overrideStyles: {
            overrideButtonStyle: {
              width: 40,
              height: 40,
            },
          },
        },
      ],
    };
  };

  const filteredPlaylists = search
    ? playlists.filter((playlist) => {
        return playlist.name.toLowerCase().includes(search.toLowerCase());
      })
    : playlists;

  return (
    <>
      <View style={styles.searchContainer}>
        <Input
          placeholder={'Search playlist'}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <ScrollView style={styles.playlistsContainer}>
        {filteredPlaylists.map((playlist) => (
          <TopIconsAndCtaCard key={playlist.id} {...cardProps(playlist)} />
        ))}
      </ScrollView>
    </>
  );
};

export default Playlists;

const styles = StyleSheet.create({
  playlistsContainer: {
    padding: 20,
    width: '100%',
    maxWidth: 400,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  searchContainer: {
    width: '70%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingBottom: 20,
  },
});
