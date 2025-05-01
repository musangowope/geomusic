import React from 'react';
import { IconProps } from '@/components/ui/icon/types';
import { Button, Pressable, PressableProps, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import useThemeColors from '@/hooks/useThemeColors';

export interface CtaButtonProps extends PressableProps {
  mode: 'primary' | 'secondary';
  icon?: IconProps;
  text: string;
}

const CtaButton = (props: CtaButtonProps) => {
  const { text, mode, ...rest } = props;
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
      ]}
    >
      <ThemedText>{text}</ThemedText>
    </Pressable>
  );
};

export default CtaButton;

const styles = StyleSheet.create({
  button: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 8,
    paddingBottom: 8,
    borderWidth: 1,
    borderRadius: 18,
  },
});
