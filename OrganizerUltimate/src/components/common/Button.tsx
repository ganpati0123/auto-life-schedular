import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, BORDER_RADIUS, FONT_SIZES } from '../../constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();
  
  const getBackgroundColor = () => {
    if (disabled) return colors.divider;
    switch (variant) {
      case 'primary': return colors.primary;
      case 'secondary': return colors.secondary;
      case 'outline': return 'transparent';
      case 'text': return 'transparent';
      default: return colors.primary;
    }
  };
  
  const getTextColor = () => {
    if (disabled) return colors.textSecondary;
    switch (variant) {
      case 'primary': return '#FFFFFF';
      case 'secondary': return '#FFFFFF';
      case 'outline': return colors.primary;
      case 'text': return colors.primary;
      default: return '#FFFFFF';
    }
  };
  
  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small': return { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.sm };
      case 'medium': return { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md };
      case 'large': return { paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg };
    }
  };
  
  const getFontSize = (): number => {
    switch (size) {
      case 'small': return FONT_SIZES.sm;
      case 'medium': return FONT_SIZES.md;
      case 'large': return FONT_SIZES.lg;
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        getSizeStyles(),
        {
          backgroundColor: getBackgroundColor(),
          borderColor: variant === 'outline' ? colors.primary : 'transparent',
          borderWidth: variant === 'outline' ? 1 : 0,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, { color: getTextColor(), fontSize: getFontSize() }, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  text: {
    fontWeight: '600',
  },
});
