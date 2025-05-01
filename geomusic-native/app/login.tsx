import { Button, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { useSpotifyAuth } from '@/features/authentication/hooks/useSpotifyAuth';

export default function LoginScreen() {
  const { login } = useSpotifyAuth();

  const handleLogin = async () => {
    try {
      await login();
    } catch (e) {
      console.error('Failed to login', e);
    }
  };
  return (
    <ThemedView style={styles.container}>
      <Button title="Login" onPress={handleLogin} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
