import React from 'react';
import * as ExpoVectorIcons from '@expo/vector-icons';
import { IconProps } from './types';

/**
 * A universal icon component that renders vector icons from Expo.
 */
const Icon = ({
  iconType,
  iconName,
  size = 24,
  color,
  style,
}: IconProps): JSX.Element => {
  // Render the appropriate vector icon
  if (iconType && iconName) {
    const IconComponent = ExpoVectorIcons[iconType];
    return (
      <IconComponent
        name={iconName as string}
        size={size}
        color={color}
        style={style}
      />
    );
  }

  // Return empty fragment if no valid icon configuration is provided
  return <></>;
};

export default Icon;
