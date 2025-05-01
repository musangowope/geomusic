import React from 'react';
import { useSpotifyAuth } from '@/features/authentication/hooks/useSpotifyAuth';
import { Redirect, usePathname } from 'expo-router';

const AuthRedirect = () => {
  const { isAuthenticated } = useSpotifyAuth();
  const currentPath = usePathname();
  const unAuthedRoutes = ['/login'];
  const isInUnAuthedRoute = unAuthedRoutes.includes(currentPath);

  if (!isInUnAuthedRoute && isAuthenticated) {
    return <></>;
  } else if (isAuthenticated && isInUnAuthedRoute) {
    return <Redirect href="/(auth)" />;
  } else {
    return <Redirect href="/login" />;
  }
};

export default AuthRedirect;
