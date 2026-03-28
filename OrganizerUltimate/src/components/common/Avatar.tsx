import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { getInitials } from '../../utils';
import { BORDER_RADIUS, FONT_SIZES } from '../../constants';

interface AvatarProps {
  name?: string;
  imageUrl?: string;
  size?: number;
  style?: ViewStyle;
  backgroundColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  imageUrl,
  size = 40,
  style,
  backgroundColor,
}) => {
  const { colors } = useTheme();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const fontSize = size * 0.4;
  
  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={[
          styles.avatar,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      />
    );
  }
  
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: backgroundColor || colors.primary,
        },
        style,
      ]}
    >
      <Text style={[styles.initials, { fontSize }]}>
        {name ? getInitials(name) : '?'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
