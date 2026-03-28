import { useColorScheme } from 'react-native';
import { useSettingsStore } from '../store';
import { COLORS } from '../constants';

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const { settings } = useSettingsStore();
  
  const isDark = settings.theme === 'system' 
    ? systemColorScheme === 'dark'
    : settings.theme === 'dark';
  
  const colors = {
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    accent: COLORS.accent,
    background: isDark ? COLORS.backgroundDark : COLORS.background,
    surface: isDark ? COLORS.surfaceDark : COLORS.surface,
    error: COLORS.error,
    success: COLORS.success,
    warning: COLORS.warning,
    info: COLORS.info,
    text: isDark ? COLORS.textDark : COLORS.text,
    textSecondary: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
    divider: isDark ? COLORS.dividerDark : COLORS.divider,
    border: isDark ? COLORS.borderDark : COLORS.border,
  };
  
  return { isDark, colors };
};
