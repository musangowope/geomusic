import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import useThemeColors from '@/hooks/useThemeColors';
import { TextInputProps } from 'react-native/Libraries/Components/TextInput/TextInput';
import FontSizes from '@/constants/Typography';

const Input = (props: TextInputProps) => {
  const themeColors = useThemeColors();
  return (
    <TextInput
      {...props}
      placeholderTextColor={themeColors.textSecondary}
      style={[
        styles.input,
        {
          backgroundColor: themeColors.surface,
          color: themeColors.textPrimary,
        },
      ]}
    ></TextInput>
  );
};

export default Input;

const styles = StyleSheet.create({
  input: {
    borderRadius: 30,
    padding: 15,
    fontSize: FontSizes.md,
  },
});
