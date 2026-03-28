export const COLORS = {
  primary: '#1E3A5F',
  secondary: '#00BFA5',
  accent: '#FFD700',
  background: '#FFFFFF',
  backgroundDark: '#121212',
  surface: '#F5F5F5',
  surfaceDark: '#1E1E1E',
  error: '#E53935',
  success: '#43A047',
  warning: '#FF9800',
  info: '#2196F3',
  text: '#212121',
  textDark: '#FFFFFF',
  textSecondary: '#757575',
  textSecondaryDark: '#B0B0B0',
  divider: '#E0E0E0',
  dividerDark: '#424242',
  border: '#E0E0E0',
  borderDark: '#424242',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  
  // Calendar event colors
  eventColors: [
    '#E53935', // Red
    '#D81B60', // Pink
    '#8E24AA', // Purple
    '#5E35B1', // Deep Purple
    '#3949AB', // Indigo
    '#1E88E5', // Blue
    '#039BE5', // Light Blue
    '#00ACC1', // Cyan
    '#00897B', // Teal
    '#43A047', // Green
    '#7CB342', // Light Green
    '#C0CA33', // Lime
    '#FDD835', // Yellow
    '#FFB300', // Amber
    '#FB8C00', // Orange
    '#F4511E', // Deep Orange
  ],
  
  // Email provider colors
  providerColors: {
    gmail: '#EA4335',
    outlook: '#0078D4',
    icloud: '#A2AAAD',
    custom: '#757575',
  },
  
  // Priority colors
  priorityColors: {
    high: '#E53935',
    medium: '#FF9800',
    low: '#43A047',
  },
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
  round: 999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.0,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5.0,
    elevation: 5,
  },
};

export const EMAIL_PROVIDERS = {
  gmail: {
    name: 'Gmail',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 465,
    imapHost: 'imap.gmail.com',
    imapPort: 993,
  },
  outlook: {
    name: 'Outlook',
    smtpHost: 'smtp.office365.com',
    smtpPort: 587,
    imapHost: 'outlook.office365.com',
    imapPort: 993,
  },
  icloud: {
    name: 'iCloud',
    smtpHost: 'smtp.mail.me.com',
    smtpPort: 587,
    imapHost: 'imap.mail.me.com',
    imapPort: 993,
  },
};

export const DEFAULT_REMINDERS = [
  { minutesBefore: 5, method: 'popup' as const },
  { minutesBefore: 15, method: 'popup' as const },
  { minutesBefore: 30, method: 'email' as const },
  { minutesBefore: 60, method: 'popup' as const },
];

export const DEFAULT_CALENDARS = [
  {
    id: 'personal',
    name: 'Personal',
    color: '#1E88E5',
    isVisible: true,
    isDefault: true,
    canEdit: true,
    canShare: true,
    accessLevel: 'owner' as const,
    owner: 'user',
  },
  {
    id: 'work',
    name: 'Work',
    color: '#43A047',
    isVisible: true,
    isDefault: false,
    canEdit: true,
    canShare: true,
    accessLevel: 'owner' as const,
    owner: 'user',
  },
  {
    id: 'family',
    name: 'Family',
    color: '#FB8C00',
    isVisible: true,
    isDefault: false,
    canEdit: true,
    canShare: true,
    accessLevel: 'owner' as const,
    owner: 'user',
  },
];

export const DEFAULT_EMAIL_FOLDERS = [
  { id: 'inbox', name: 'Inbox', type: 'inbox' as const, path: 'INBOX' },
  { id: 'sent', name: 'Sent', type: 'sent' as const, path: 'Sent' },
  { id: 'drafts', name: 'Drafts', type: 'drafts' as const, path: 'Drafts' },
  { id: 'trash', name: 'Trash', type: 'trash' as const, path: 'Trash' },
  { id: 'spam', name: 'Spam', type: 'spam' as const, path: 'Spam' },
];

export const AI_PROMPTS = {
  scheduleMeeting: `You are an AI executive assistant. Based on the user's request, create a meeting event with all necessary details.`,
  summarizeEmail: `Summarize the following email thread in a concise manner, highlighting key points and action items.`,
  draftReply: `Draft a professional email reply based on the context provided.`,
  findTime: `Given the user's calendar availability and meeting requirements, suggest the best time slots.`,
};

export const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
];

export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'ar', label: 'Arabic' },
];
