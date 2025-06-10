import { StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { useSpotifyAuth } from '@/features/authentication/hooks/useSpotifyAuth';
import MusicMap, {
  MusicMapProps,
} from '@/features/music-map/components/MusicMap';
import ProfileMenu, { ProfileMenuProps } from '@/components/ui/ProfileMenu';
import IconButton from '@/components/ui/iconButton/IconButton';
import { Link, useRouter } from 'expo-router';
import useGetLocation from '@/features/music-map/hooks/useGetLocation';
import { GeoPlaylist } from '@/redux/slices/geoPlaylistSlice';

export default function HomeScreen() {
  const { userInfo, logout } = useSpotifyAuth();

  const router = useRouter();

  const { currentLocation } = useGetLocation();

  const handleLogout = async () => {
    await logout();
  };

  const profileImage = userInfo?.images[0].url || '';

  const onMarkerPress = (geoPlaylist: GeoPlaylist) => {
    router.navigate(`/${geoPlaylist.spotifyPlaylist.id}`);
  };

  const musicMapProps: MusicMapProps | null = currentLocation
    ? {
        currentLocation,
        events: {
          onPlaylistMarkerPress: onMarkerPress,
        },
      }
    : null;

  console.log('music props', musicMapProps);

  const profileMenuProps: ProfileMenuProps | null = profileImage
    ? {
        image: profileImage,
        menuItems: [
          {
            text: 'My Playlists',
            onClick: () => router.navigate('/(playlists)'),
          },
          {
            text: 'Logout',
            onClick: handleLogout,
          },
        ],
      }
    : null;

  return (
    <ThemedView style={styles.container}>
      {profileMenuProps && <ProfileMenu {...profileMenuProps} />}
      {musicMapProps && <MusicMap {...musicMapProps} />}

      <View style={styles.searchButtonContainer}>
        <IconButton iconName={'search1'} iconType={'AntDesign'} />
      </View>
      <View style={styles.addPlaylistButtonContainer}>
        <IconButton
          onPress={() => {
            router.navigate('/(playlists)');
          }}
          iconName={'music-note-plus'}
          iconType={'MaterialCommunityIcons'}
        />
      </View>
      {/*<Button onPress={handleLogout} title="Logout"></Button>*/}
      {/*<Playlists />*/}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    height: '100%',
  },
  searchButtonContainer: {
    position: 'absolute',
    top: 50,
    right: 100,
    zIndex: 99,
  },
  addPlaylistButtonContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 999,
  },
});
