import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../utils/theme';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  colors?: string[];
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function GradientButton({
  title,
  onPress,
  colors = [COLORS.gradientStart, COLORS.gradientEnd],
  style,
  textStyle,
  disabled = false,
  icon,
}: GradientButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.buttonWrapper, style]}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={disabled ? [COLORS.textMuted, COLORS.textMuted] : colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.button, disabled && styles.disabledButton]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function IconButton({
  icon,
  onPress,
  style,
  size = 'medium',
  variant = 'primary',
}: IconButtonProps) {
  const sizeStyles = {
    small: styles.iconButtonSmall,
    medium: styles.iconButtonMedium,
    large: styles.iconButtonLarge,
  };

  const variantStyles = {
    primary: styles.iconButtonPrimary,
    secondary: styles.iconButtonSecondary,
    ghost: styles.iconButtonGhost,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.iconButton,
        sizeStyles[size],
        variantStyles[variant],
        style,
      ]}
      activeOpacity={0.7}
    >
      {icon}
    </TouchableOpacity>
  );
}

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export function Card({ children, style, onPress }: CardProps) {
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.card, style]}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
}

interface BadgeProps {
  count: number;
  size?: number;
  color?: string;
}

export function Badge({ count, size = 18, color = COLORS.accent }: BadgeProps) {
  if (count === 0) return null;

  return (
    <View style={[styles.badge, { width: size, height: size, backgroundColor: color }]}>
      <Text style={[styles.badgeText, { fontSize: size - 6 }]}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
}

interface AvatarProps {
  name: string;
  size?: number;
  color?: string;
}

export function Avatar({ name, size = 40, color }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const backgroundColor = color || COLORS.calendarColors[name.length % COLORS.calendarColors.length];

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size / 2.5 }]}>{initials}</Text>
    </View>
  );
}

interface DividerProps {
  style?: ViewStyle;
}

export function Divider({ style }: DividerProps) {
  return <View style={[styles.divider, style]} />;
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>{icon}</View>
      <Text style={styles.emptyStateTitle}>{title}</Text>
      <Text style={styles.emptyStateDescription}>{description}</Text>
      {action && <View style={styles.emptyStateAction}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    overflow: 'hidden',
    borderRadius: BORDER_RADIUS.lg,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.medium,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  iconContainer: {
    marginRight: SPACING.sm,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.round,
  },
  iconButtonSmall: {
    width: 32,
    height: 32,
  },
  iconButtonMedium: {
    width: 44,
    height: 44,
  },
  iconButtonLarge: {
    width: 56,
    height: 56,
  },
  iconButtonPrimary: {
    backgroundColor: COLORS.primary,
  },
  iconButtonSecondary: {
    backgroundColor: COLORS.surface,
  },
  iconButtonGhost: {
    backgroundColor: 'transparent',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.surfaceLight,
    marginVertical: SPACING.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyStateIcon: {
    marginBottom: SPACING.md,
  },
  emptyStateTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyStateAction: {
    marginTop: SPACING.lg,
  },
});