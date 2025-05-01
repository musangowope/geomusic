import * as ExpoVectorIcons from '@expo/vector-icons';
import { StyleProp, ViewStyle } from 'react-native';

// Get all icon types from Expo Vector Icons
export type IconType = keyof typeof ExpoVectorIcons;

// Create a type that maps each icon type to its available icon names
export type IconNames<T extends IconType> = T extends 'AntDesign'
  ? keyof typeof ExpoVectorIcons.AntDesign.glyphMap
  : T extends 'Entypo'
    ? keyof typeof ExpoVectorIcons.Entypo.glyphMap
    : T extends 'EvilIcons'
      ? keyof typeof ExpoVectorIcons.EvilIcons.glyphMap
      : T extends 'Feather'
        ? keyof typeof ExpoVectorIcons.Feather.glyphMap
        : T extends 'FontAwesome'
          ? keyof typeof ExpoVectorIcons.FontAwesome.glyphMap
          : T extends 'FontAwesome5'
            ? keyof typeof ExpoVectorIcons.FontAwesome5.glyphMap
            : T extends 'Fontisto'
              ? keyof typeof ExpoVectorIcons.Fontisto.glyphMap
              : T extends 'Foundation'
                ? keyof typeof ExpoVectorIcons.Foundation.glyphMap
                : T extends 'Ionicons'
                  ? keyof typeof ExpoVectorIcons.Ionicons.glyphMap
                  : T extends 'MaterialCommunityIcons'
                    ? keyof typeof ExpoVectorIcons.MaterialCommunityIcons.glyphMap
                    : T extends 'MaterialIcons'
                      ? keyof typeof ExpoVectorIcons.MaterialIcons.glyphMap
                      : T extends 'Octicons'
                        ? keyof typeof ExpoVectorIcons.Octicons.glyphMap
                        : T extends 'SimpleLineIcons'
                          ? keyof typeof ExpoVectorIcons.SimpleLineIcons.glyphMap
                          : T extends 'Zocial'
                            ? keyof typeof ExpoVectorIcons.Zocial.glyphMap
                            : string;

// Props for the Icon component (vector icons only)
export interface IconProps {
  iconType: IconType;
  iconName: IconNames<IconType>;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}
