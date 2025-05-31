import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import Header from '@/components/ui/Header';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import MiddleCtasCard, {
  MiddleCtasCardProps,
} from '@/components/ui/card/MiddleCtasCard';
import useThemeColors from '@/hooks/useThemeColors';
import { PlaylistTrackItem } from '@/features/spotify/interfaces';
import { useGetPlaylistByIdQuery } from '@/redux/queries/spotifyPlaylistQuery';

const PlaylistDetailScreen = () => {
  const { id } = useLocalSearchParams();
  console.log('id', id);
  const { data, isLoading, isFetching } = useGetPlaylistByIdQuery(id as string);
  const themeColors = useThemeColors();

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
          console.log('hello');
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

export default PlaylistDetailScreen;

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
