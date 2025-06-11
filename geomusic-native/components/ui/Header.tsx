import React from 'react';
import { Pressable, PressableProps, StyleSheet, View } from 'react-native';
import { IconProps } from '@/components/ui/icon/types';
import Icon from '@/components/ui/icon/Icon';
import { ThemedText } from '@/components/ThemedText';
import { FontSizes } from '@/constants/Typography';

interface HeaderIconButtonProps {
  pressableProps: PressableProps;
  iconProps: IconProps;
}

interface HeaderProps {
  leftIcon?: HeaderIconButtonProps;
  rightIcon?: HeaderIconButtonProps;
  headerText?: string;
}

const Header = (props: HeaderProps) => {
  const { leftIcon, rightIcon, headerText } = props;
  return (
    <View style={styles.header}>
      {leftIcon && (
        <Pressable {...leftIcon.pressableProps} style={styles.leftIcon}>
          <Icon {...leftIcon.iconProps} />
        </Pressable>
      )}
      {headerText && (
        <ThemedText style={styles.headerText}>{headerText}</ThemedText>
      )}
      {rightIcon && (
        <Pressable {...rightIcon.pressableProps} style={styles.rightIcon}>
          <Icon {...rightIcon.iconProps} />
        </Pressable>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    paddingTop: 25,
    paddingBottom: 25,
    position: 'relative',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerText: {
    fontSize: FontSizes.xl,
  },
  leftIcon: {
    position: 'absolute',
    left: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  rightIcon: {
    position: 'absolute',
    right: 10,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
});
