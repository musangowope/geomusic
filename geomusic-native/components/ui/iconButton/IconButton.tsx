import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Image,
  ImageStyle,
  StyleProp,
} from 'react-native';
import useThemeColors from '@/hooks/useThemeColors';
import { IconButtonProps } from './types';
import Icon from '../icon/Icon';

/**
 * A button component that displays an icon (either vector or custom image)
 * with a circular design and optional styling overrides.
 */
function IconButton({
  iconType,
  iconName,
  customIconSource,
  size = 24,
  color,
  overrideStyles: {
    overrideButtonStyle = {},
    overrideContainerStyle = {},
  } = {},
  ...pressableProps
}: IconButtonProps): JSX.Element {
  const themeColors = useThemeColors();

  // Use provided colors or default to theme colors
  const finalIconColor = color || themeColors.textPrimary;

  return (
    <View style={[styles.container, overrideContainerStyle]}>
      {/*<View*/}
      {/*  style={[*/}
      {/*    styles.halfCircle,*/}
      {/*    {*/}
      {/*      backgroundColor: themeColors.secondary,*/}
      {/*    },*/}
      {/*  ]}*/}
      {/*/>*/}
      <Pressable
        style={[
          styles.circleButton,
          {
            borderColor: themeColors.secondary,
            backgroundColor: themeColors.background,
          },
          overrideButtonStyle,
        ]}
        {...pressableProps}
      >
        {customIconSource ? (
          // Render custom image icon
          <Image
            source={customIconSource}
            style={
              {
                width: size,
                height: size,
                resizeMode: 'contain',
              } as StyleProp<ImageStyle>
            }
          />
        ) : (
          // Render vector icon
          iconType &&
          iconName && (
            <Icon
              iconType={iconType}
              iconName={iconName}
              size={size}
              color={finalIconColor}
            />
          )
        )}
      </Pressable>
    </View>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  circleButton: {
    width: 67,
    height: 67,
    borderRadius: 33.5, // Half of width/height for perfect circle
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  // halfCircle: {
  //   height: 15,
  //   width: 15,
  //   borderRadius: 7.5, // Half of width/height for perfect circle
  //   position: 'absolute',
  //   top: 2.5,
  //   right: 2.5,
  //   zIndex: 10,
  // },
});
