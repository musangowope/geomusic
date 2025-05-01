import { SafeAreaView, StyleSheet, View } from 'react-native';

import MusicMap from '@/features/music-map/components/MusicMap';
import Header from '@/components/ui/Header';
import { useLocalSearchParams, useRouter } from 'expo-router';
import useThemeColors from '@/hooks/useThemeColors';
import Input from '@/components/ui/input/Input';
import { useGetPlaylistByIdQuery } from '@/redux/api/playlistApi';
import { SpotifyPlaylistDetailResponse } from '@/features/spotify/interfaces';
import Card, { CardProps } from '@/components/ui/card/Card';
import { ThemedView } from '@/components/ThemedView';

export default function PinPlaylistScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  console.log('id', id);
  const { data, isLoading, isFetching } = useGetPlaylistByIdQuery(id as string);
  const themeColors = useThemeColors();

  if (isLoading || isFetching) return null;

  console.log('data', data);

  const cardProps = (data: SpotifyPlaylistDetailResponse): CardProps => {
    return {
      title: data.name,
      circleImage: data.images[0].url,
      subtitle: `${data.tracks.total} songs`,
    };
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ThemedView>
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
        <View style={styles.header}>
          {/*<Card {...cardProps(data as SpotifyPlaylistDetailResponse)} />*/}
          <Input placeholder="Add or coordinates" />
        </View>
      </ThemedView>
      <MusicMap />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    height: '100%',
  },
  header: {
    padding: 20,
    width: '100%',
    maxWidth: 400,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});
