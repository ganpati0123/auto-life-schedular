export const COLORS = {
  // Primary Colors
  primary: '#1E3A5F',
  primaryLight: '#2D5A8E',
  primaryDark: '#0F1E30',
  
  // Gradient Colors
  gradientStart: '#667EEA',
  gradientEnd: '#764BA2',
  
  // Accent Colors
  accent: '#FF6B6B',
  accentLight: '#FF8E8E',
  
  // Status Colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Background Colors
  background: '#0D1B2A',
  backgroundLight: '#1B2838',
  surface: '#243447',
  surfaceLight: '#2D4059',
  
  // Text Colors
  text: '#FFFFFF',
  textSecondary: '#A0AEC0',
  textMuted: '#718096',
  
  // Calendar Colors
  calendarColors: [
    '#667EEA', // Purple
    '#FF6B6B', // Coral
    '#4CAF50', // Green
    '#FF9800', // Orange
    '#2196F3', // Blue
    '#9C27B0', // Deep Purple
    '#00BCD4', // Cyan
    '#E91E63', // Pink
  ],
  
  // Category Colors
  categoryMeeting: '#667EEA',
  categoryPersonal: '#4CAF50',
  categoryWork: '#FF9800',
  categoryHealth: '#FF6B6B',
  categoryOther: '#A0AEC0',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Australia/Sydney',
];

export const REMINDER_OPTIONS = [
  { label: '5 minutes before', value: 5 },
  { label: '15 minutes before', value: 15 },
  { label: '30 minutes before', value: 30 },
  { label: '1 hour before', value: 60 },
  { label: '1 day before', value: 1440 },
];

export const EMAIL_LABELS = [
  { id: 'work', name: 'Work', color: '#667EEA' },
  { id: 'personal', name: 'Personal', color: '#4CAF50' },
  { id: 'important', name: 'Important', color: '#FF6B6B' },
  { id: 'finance', name: 'Finance', color: '#FF9800' },
  { id: 'travel', name: 'Travel', color: '#2196F3' },
  { id: 'newsletter', name: 'Newsletter', color: '#A0AEC0' },
];