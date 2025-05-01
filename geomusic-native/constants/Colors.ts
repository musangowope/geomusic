/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    spotifyGreen: '#1DB954', // Play buttons, Spotify-branded elements
    primary: '#20C997', // Main CTA buttons
    secondary: '#9775FA', // Secondary buttons
    background: '#F8F9FA', // App background
    surface: '#FFFFFF', // Cards, modals
    textPrimary: '#2D3436', // Main text (dark charcoal)
    textSecondary: '#636E72', // Subtle text (medium gray)

    // Existing
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    spotifyGreen: '#1DB954', // Play buttons, Spotify-branded elements
    primary: '#2EE6CA', // Main CTA (darker mint for better contrast)
    secondary: '#6C5CE7', // Secondary buttons (desaturated purple
    background: '#121212', // App background (warm white)
    surface: '#181818', // Cards, modals (pure white)

    textPrimary: '#FFFFFF', // Main text
    textSecondary: '#B3B3B3', // Subtle text

    //Existing
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
