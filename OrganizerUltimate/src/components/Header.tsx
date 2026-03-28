import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../utils/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  showGradient?: boolean;
}

export function Header({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  showGradient = true,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {showGradient ? (
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.leftContainer}>
              {leftIcon && (
                <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
                  {leftIcon}
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
            <View style={styles.rightContainer}>
              {rightIcon && (
                <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
                  {rightIcon}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </LinearGradient>
      ) : (
        <View style={styles.solidHeader}>
          <View style={styles.content}>
            <View style={styles.leftContainer}>
              {leftIcon && (
                <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
                  {leftIcon}
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
            <View style={styles.rightContainer}>
              {rightIcon && (
                <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
                  {rightIcon}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  gradient: {
    paddingTop: SPACING.xl + 20,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  solidHeader: {
    backgroundColor: COLORS.background,
    paddingTop: SPACING.xl + 20,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContainer: {
    width: 44,
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: 44,
    alignItems: 'flex-end',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  iconButton: {
    padding: SPACING.xs,
  },
});