import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import PlaylistDetail from '@/features/spotify/components/PlaylistDetail';

const PlaylistDetailScreen = () => {
  const { id } = useLocalSearchParams();
  return <PlaylistDetail id={id as string} />;
};

export default PlaylistDetailScreen;
