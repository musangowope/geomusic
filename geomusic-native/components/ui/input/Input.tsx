import React from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from 'react-native';
import useThemeColors from '@/hooks/useThemeColors';
import { TextInputProps } from 'react-native/Libraries/Components/TextInput/TextInput';
import { FontSizes } from '@/constants/Typography';

interface InputProps extends TextInputProps {
  dismissKeyboardOnOutsidePress?: boolean;
}

const Input = (props: InputProps) => {
  const { dismissKeyboardOnOutsidePress = true, ...restProps } = props;
  const themeColors = useThemeColors();

  const inputContent = (
    <TextInput
      clearButtonMode={'while-editing'}
      {...restProps}
      placeholderTextColor={themeColors.textSecondary}
      style={[
        styles.input,
        {
          backgroundColor: themeColors.surface,
          color: themeColors.textPrimary,
        },
      ]}
    />
  );

  // If dismissKeyboardOnOutsidePress is false, just return the input
  if (!dismissKeyboardOnOutsidePress) {
    return inputContent;
  }

  // Otherwise wrap it in a TouchableWithoutFeedback to dismiss keyboard on outside press
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View>{inputContent}</View>
    </TouchableWithoutFeedback>
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
