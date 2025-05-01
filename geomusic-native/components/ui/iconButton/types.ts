import {
  PressableProps,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import { IconType, IconNames } from '../icon/types';

// Common props shared between both button types
export interface BaseButtonProps extends PressableProps {
  size?: number;
  color?: string;
  overrideStyles?: {
    overrideContainerStyle?: StyleProp<ViewStyle>;
    overrideButtonStyle?: StyleProp<ViewStyle>;
  };
}

// Props specific to vector icons
export interface VectorIconButtonProps<T extends IconType = IconType>
  extends BaseButtonProps {
  iconType: T;
  iconName: IconNames<T>;
  customIconSource?: never; // Not allowed for vector icons
}

// Props specific to custom image icons
export interface CustomIconButtonProps extends BaseButtonProps {
  iconType?: never; // Not allowed for custom icons
  iconName?: never; // Not allowed for custom icons
  customIconSource: ImageSourcePropType;
}

// Union type that can be either vector icon or custom icon props
export type IconButtonProps = VectorIconButtonProps | CustomIconButtonProps;
