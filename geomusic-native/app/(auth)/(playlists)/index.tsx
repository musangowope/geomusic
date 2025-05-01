import React from 'react';
import { useGetPlaylistsQuery } from '@/redux/api/playlistApi';
import useThemeColors from '@/hooks/useThemeColors';
import { SafeAreaView, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Header from '@/components/ui/Header';
import Playlists from '@/features/spotify/components/Playlists';
import { useRouter } from 'expo-router';

const PlaylistsScreen = () => {
  const { error, data, isFetching, isLoading } = useGetPlaylistsQuery();
  const themeColors = useThemeColors();
  const router = useRouter();

  if (isFetching || isLoading)
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ThemedText>Loading</ThemedText>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        headerText="Select a playlist to pin"
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
      />
      <Playlists playlists={data} />
    </SafeAreaView>
  );
};

export default PlaylistsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
