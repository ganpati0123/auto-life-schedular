import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, BORDER_RADIUS } from '../../constants';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: ViewStyle;
  disabled?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 'medium',
  variant = 'secondary',
  style,
  disabled = false,
}) => {
  const { colors } = useTheme();
  
  const getSize = () => {
    switch (size) {
      case 'small': return 32;
      case 'medium': return 44;
      case 'large': return 56;
    }
  };
  
  const getBackgroundColor = () => {
    if (disabled) return colors.divider;
    switch (variant) {
      case 'primary': return colors.primary;
      case 'secondary': return colors.surface;
      case 'ghost': return 'transparent';
    }
  };
  
  const buttonSize = getSize();
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: buttonSize,
          height: buttonSize,
          backgroundColor: getBackgroundColor(),
          borderColor: variant === 'secondary' ? colors.border : 'transparent',
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 1,
  },
});
