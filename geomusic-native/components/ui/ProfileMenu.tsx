import React, { useEffect, useState, useRef } from 'react';
import {
  Image,
  StyleSheet,
  Pressable,
  View,
  LayoutChangeEvent,
  TouchableWithoutFeedback,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import useThemeColors from '@/hooks/useThemeColors';
import { AntDesign } from '@expo/vector-icons';

interface MenuItem {
  onClick: () => void;
  text: string;
}

export interface ProfileMenuProps {
  image: string;
  menuItems: MenuItem[];
}

const ProfileMenu = ({ image, menuItems }: ProfileMenuProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const animatedContainerWidth = useSharedValue(100);
  const animatedMenuContainerHeight = useSharedValue(0);
  const animatedMenuContainerPaddingTop = useSharedValue(0);
  const themeColors = useThemeColors();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationLockTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<View>(null);

  // Reference to store the measured menu height
  const [menuHeight, setMenuHeight] = useState(0);

  // Function to temporarily lock animations
  const lockAnimationBriefly = () => {
    setIsAnimating(true);

    // Clear any existing animation lock timeout
    if (animationLockTimeoutRef.current) {
      clearTimeout(animationLockTimeoutRef.current);
    }

    // Set a short timeout to unlock animations
    animationLockTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 150); // Shorter lock time (150ms instead of waiting for full animation)
  };

  const openMenu = () => {
    // Don't allow opening if already animating
    if (isAnimating) return;

    // Clear any existing close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    lockAnimationBriefly();
    setIsMenuVisible(true);
    setIsOpen(true);
  };

  const closeMenu = () => {
    // Don't allow closing if already animating
    if (isAnimating) return;

    lockAnimationBriefly();
    setIsOpen(false);

    // Set a timeout to hide the menu after animation completes
    closeTimeoutRef.current = setTimeout(() => {
      setIsMenuVisible(false);
    }, 200); // Shorter timeout, just enough to let animation finish
  };

  const toggleMenu = () => {
    // Prevent toggling during animation
    if (isAnimating) return;

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      if (animationLockTimeoutRef.current) {
        clearTimeout(animationLockTimeoutRef.current);
      }
    };
  }, []);

  // Measure the menu container height
  const onMenuLayout = (event: LayoutChangeEvent) => {
    if (!menuHeight) {
      const { height } = event.nativeEvent.layout;
      setMenuHeight(height + 10);
    }
  };

  // Update animations when open state changes
  useEffect(() => {
    // Only proceed if we have a valid menu height
    if (menuHeight <= 0) return;

    // Faster spring animation config
    const springConfig = {
      damping: 20,
      mass: 0.6,
      stiffness: 150,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    };

    // Animate container width
    animatedContainerWidth.value = withSpring(isOpen ? 150 : 100, springConfig);

    // Animate menu height and padding
    animatedMenuContainerHeight.value = withSpring(
      isOpen ? menuHeight : 0,
      springConfig
    );

    animatedMenuContainerPaddingTop.value = withSpring(
      isOpen ? 40 : 0,
      springConfig
    );
  }, [isOpen, menuHeight]);

  // Create animated styles
  const animatedContainerStyles = useAnimatedStyle(() => {
    return {
      width: animatedContainerWidth.value,
    };
  });

  const animatedMenuContainerStyles = useAnimatedStyle(() => {
    return {
      height: animatedMenuContainerHeight.value,
      paddingTop: animatedMenuContainerPaddingTop.value,
      opacity: animatedMenuContainerHeight.value / (menuHeight || 1), // Prevent division by zero
    };
  });

  // Handle click outside
  const handleClickOutside = () => {
    if (isOpen) {
      closeMenu();
    }
  };

  return (
    <>
      {/* Overlay to capture clicks outside when menu is open */}
      {isOpen && (
        <TouchableWithoutFeedback onPress={handleClickOutside}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View
        style={[styles.container, animatedContainerStyles]}
        ref={menuRef}
      >
        <Pressable
          style={[
            styles.profileHeader,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.secondary,
            },
          ]}
          onPress={toggleMenu}
        >
          <Image
            style={[styles.image, { borderColor: themeColors.secondary }]}
            source={{
              uri: image,
              height: 55,
              width: 55,
            }}
          />
          <AntDesign
            name="caretdown"
            size={12}
            color={themeColors.secondary}
            style={styles.profileHeaderChevron}
          />
        </Pressable>

        {/* Hidden container to measure content height */}
        {!menuHeight && (
          <View
            style={styles.hiddenContainer}
            onLayout={onMenuLayout}
            pointerEvents="none"
          >
            {menuItems.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.menuItem,
                  { backgroundColor: themeColors.surface },
                ]}
              >
                <ThemedText>{item.text}</ThemedText>
              </View>
            ))}
          </View>
        )}

        {/* Only render the menu when it should be visible */}
        {(isMenuVisible || isOpen) && (
          <Animated.View
            style={[
              styles.menuContainer,
              animatedMenuContainerStyles,
              { backgroundColor: themeColors.background },
            ]}
          >
            {menuItems.map((item, index) => (
              <Pressable
                key={index}
                style={[
                  styles.menuItem,
                  { backgroundColor: themeColors.surface },
                ]}
                onPress={() => {
                  item.onClick();
                  closeMenu();
                }}
              >
                <ThemedText>{item.text}</ThemedText>
              </Pressable>
            ))}
          </Animated.View>
        )}
      </Animated.View>
    </>
  );
};

// Static styles
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    zIndex: 98, // Just below the menu container
  },
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 99,
  },
  profileHeader: {
    padding: 7,
    borderRadius: 45,
    width: '100%',
    zIndex: 9,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  profileHeaderChevron: {
    position: 'absolute',
    right: 15,
  },
  image: {
    borderRadius: 27.5, // Half of the height/width (55/2)
    borderWidth: 2,
  },
  menuContainer: {
    overflow: 'hidden',
    marginTop: -30,
    padding: 10,
    paddingTop: 0, // This will be animated
    gap: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  hiddenContainer: {
    position: 'absolute',
    opacity: 0,
    marginTop: -30,
    padding: 10,
    gap: 10,
  },
  menuItem: {
    padding: 8,
    borderRadius: 8,
    textAlign: 'center',
  },
});

export default ProfileMenu;
