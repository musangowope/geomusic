import React from 'react';
import Card, { CardProps } from '@/components/ui/card/Card';
import { IconButtonProps } from '@/components/ui/iconButton/types';
import { StyleSheet, View } from 'react-native';
import CtaButton, { CtaButtonProps } from '../button/Button';
import IconButton from '@/components/ui/iconButton/IconButton';

export interface CardWithTopIconButtonsAndCtaProps extends CardProps {
  cta?: CtaButtonProps;
  topCornerCircleButtons?: IconButtonProps[];
}

const TopIconsAndCtaCard = (props: CardWithTopIconButtonsAndCtaProps) => {
  const { cta, topCornerCircleButtons = [], ...rest } = props;
  return (
    <Card {...rest}>
      {cta && (
        <View style={styles.ctaContainer}>
          <CtaButton {...cta} />
        </View>
      )}
      {topCornerCircleButtons.length > 0 ? (
        <View style={styles.topCornerCircleButtons}>
          {topCornerCircleButtons.map((button, index) => (
            <IconButton key={index} {...button} />
          ))}
        </View>
      ) : null}
    </Card>
  );
};

export default TopIconsAndCtaCard;

const styles = StyleSheet.create({
  ctaContainer: {
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
  topCornerCircleButtons: {
    position: 'absolute',
    top: 10,
    right: 15,
    flexDirection: 'row',
    gap: 5,
  },
});
