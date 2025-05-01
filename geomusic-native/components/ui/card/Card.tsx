import React, { ReactNode } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import useThemeColors from '@/hooks/useThemeColors';
import { IconButtonProps } from '@/components/ui/iconButton/types';

export interface CardProps {
  title?: string;
  subtitle?: string;
  topCornerCircleButtons?: IconButtonProps[];
  circleImage?: string;
  children?: ReactNode;
}

const Card = (props: CardProps) => {
  const themeColors = useThemeColors();
  const { title, subtitle, circleImage, children } = props;
  return (
    <View style={styles.cardContainer}>
      <View
        style={[
          styles.circle,
          {
            backgroundColor: themeColors.secondary,
          },
        ]}
      />
      <View
        style={[
          styles.cardOverlay,
          {
            backgroundColor: themeColors.secondary,
          },
        ]}
      ></View>
      <View
        style={[
          styles.card,
          {
            backgroundColor: themeColors.surface,
          },
        ]}
      >
        {circleImage && (
          <Image
            style={[
              styles.cardImage,
              {
                borderColor: themeColors.secondary,
              },
            ]}
            src={circleImage}
          />
        )}
        <View style={styles.textContainer}>
          <ThemedText>{title}</ThemedText>
          <ThemedText
            style={{
              color: themeColors.textSecondary,
            }}
          >
            {subtitle}
          </ThemedText>
        </View>
      </View>

      {children && children}
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    height: 155,
    marginBottom: 30,
    width: '100%',
  },

  circle: {
    position: 'absolute',
    right: -10,
    top: -5,
    height: 30,
    width: 30,
    borderRadius: '50%',
  },

  card: {
    height: '100%',
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 20,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  textContainer: {
    width: '60%',
  },

  cardOverlay: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
    position: 'absolute',
    top: 1,
  },
  cardImage: {
    height: 70,
    width: 70,
    borderRadius: '50%',
    marginLeft: -10,
    borderWidth: 2,
  },
});
