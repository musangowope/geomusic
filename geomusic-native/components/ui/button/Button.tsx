import React from 'react';
import { IconProps } from '@/components/ui/icon/types';
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import useThemeColors from '@/hooks/useThemeColors';
import * as RN from 'react-native';

export interface CtaButtonProps extends PressableProps {
  mode: 'primary' | 'secondary';
  icon?: IconProps;
  text: string;
  style?: RN.StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const CtaButton = (props: CtaButtonProps) => {
  const { text, mode, style, textStyle, ...rest } = props;
  const themeColors = useThemeColors();

  const borderColor =
    mode === 'primary' ? themeColors.primary : themeColors.secondary;

  return (
    <Pressable
      {...rest}
      style={[
        styles.button,
        {
          borderColor: borderColor,
          backgroundColor: themeColors.background,
        },
        // Moving the custom style to the end of the array ensures it will override previous styles
        style,
      ]}
    >
      <ThemedText style={textStyle}>{text}</ThemedText>
    </Pressable>
  );
};

export default CtaButton;

const styles = StyleSheet.create({
  button: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
    paddingBottom: 6,
    borderWidth: 1,
    borderRadius: 18,
    alignSelf: 'flex-start', // This makes the button width auto-adjust to content
  },
});
