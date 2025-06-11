import React from 'react';
import Card, { CardProps } from '@/components/ui/card/Card';
import { IconButtonProps } from '@/components/ui/iconButton/types';
import CtaButton, { CtaButtonProps } from '@/components/ui/button/Button';
import IconButton from '@/components/ui/iconButton/IconButton';
import { StyleSheet, View } from 'react-native';

export interface MiddleCtasCardProps extends CardProps {
  iconButton: IconButtonProps;
  ctaButton: CtaButtonProps;
}

const MiddleCtasCard = (props: MiddleCtasCardProps) => {
  const { iconButton, ctaButton, ...card } = props;
  return (
    <Card {...card}>
      <View style={styles.buttons}>
        <IconButton {...iconButton} />
        <CtaButton {...ctaButton} />
      </View>
    </Card>
  );
};

export default MiddleCtasCard;

const styles = StyleSheet.create({
  buttons: {
    position: 'absolute',
    top: 10,
    right: 15,
    flexDirection: 'row',
    gap: 10,
  },
});
