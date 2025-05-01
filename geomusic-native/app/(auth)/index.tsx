import { StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { useSpotifyAuth } from '@/features/authentication/hooks/useSpotifyAuth';
import MusicMap from '@/features/music-map/components/MusicMap';
import ProfileMenu, { ProfileMenuProps } from '@/components/ui/ProfileMenu';
import IconButton from '@/components/ui/iconButton/IconButton';
import { Link, useRouter } from 'expo-router';

export default function HomeScreen() {
  const { userInfo, logout } = useSpotifyAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  const profileImage = userInfo?.images[0].url || '';

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
      <MusicMap />

      <View style={styles.searchButtonContainer}>
        <IconButton iconName={'search1'} iconType={'AntDesign'} />
      </View>
      <View style={styles.addPlaylistButtonContainer}>
        <Link href="/(playlists)">
          <IconButton
            iconName={'music-note-plus'}
            iconType={'MaterialCommunityIcons'}
          />
        </Link>
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
    zIndex: 99,
  },
});
