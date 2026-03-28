import { create } from 'zustand';
import { UserSettings, NotificationSettings, CalendarSettings, EmailSettings, AISettings } from '../types';

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  emailNotifications: true,
  calendarNotifications: true,
  meetingReminders: true,
  aiSuggestions: true,
  sound: true,
  vibration: true,
};

const DEFAULT_CALENDAR_SETTINGS: CalendarSettings = {
  defaultView: 'month',
  weekStartsOn: 0,
  showWeekNumbers: false,
  firstDayOfYear: 1,
  minDate: '2020-01-01',
  maxDate: '2030-12-31',
  defaultEventDuration: 60,
  conflictsWarning: true,
};

const DEFAULT_EMAIL_SETTINGS: EmailSettings = {
  autoArchive: false,
  autoDeleteSpam: true,
  autoDeleteTrash: false,
  priorityInbox: true,
  conversationView: true,
  displayDensity: 'comfortable',
  swipeActions: true,
};

const DEFAULT_AI_SETTINGS: AISettings = {
  enabled: true,
  autoSchedule: false,
  autoReply: false,
  meetingTranscription: true,
  emailSummarization: true,
  model: 'gpt-4',
};

interface SettingsState {
  settings: UserSettings;
  
  // Theme Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Calendar Actions
  updateCalendarSettings: (settings: Partial<CalendarSettings>) => void;
  setDefaultCalendar: (calendarId: string) => void;
  
  // Email Actions
  updateEmailSettings: (settings: Partial<EmailSettings>) => void;
  setDefaultEmailAccount: (accountId: string) => void;
  setDefaultSignature: (signatureId: string) => void;
  
  // AI Actions
  updateAISettings: (settings: Partial<AISettings>) => void;
  setAPIKey: (apiKey: string) => void;
  
  // Notification Actions
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  
  // General Actions
  setTimezone: (timezone: string) => void;
  setLanguage: (language: string) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: {
    id: 'default',
    theme: 'system',
    notifications: DEFAULT_NOTIFICATION_SETTINGS,
    calendar: DEFAULT_CALENDAR_SETTINGS,
    email: DEFAULT_EMAIL_SETTINGS,
    ai: DEFAULT_AI_SETTINGS,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: 'en',
  },
  
  setTheme: (theme) => set((state) => ({
    settings: { ...state.settings, theme }
  })),
  
  updateCalendarSettings: (calendarSettings) => set((state) => ({
    settings: { ...state.settings, calendar: { ...state.settings.calendar, ...calendarSettings } }
  })),
  
  setDefaultCalendar: (calendarId) => set((state) => ({
    settings: { ...state.settings, defaultCalendarId: calendarId }
  })),
  
  updateEmailSettings: (emailSettings) => set((state) => ({
    settings: { ...state.settings, email: { ...state.settings.email, ...emailSettings } }
  })),
  
  setDefaultEmailAccount: (accountId) => set((state) => ({
    settings: { ...state.settings, defaultEmailAccountId: accountId }
  })),
  
  setDefaultSignature: (signatureId) => set((state) => ({
    settings: { ...state.settings, email: { ...state.settings.email, defaultSignatureId: signatureId } }
  })),
  
  updateAISettings: (aiSettings) => set((state) => ({
    settings: { ...state.settings, ai: { ...state.settings.ai, ...aiSettings } }
  })),
  
  setAPIKey: (apiKey) => set((state) => ({
    settings: { ...state.settings, ai: { ...state.settings.ai, apiKey } }
  })),
  
  updateNotificationSettings: (notificationSettings) => set((state) => ({
    settings: { ...state.settings, notifications: { ...state.settings.notifications, ...notificationSettings } }
  })),
  
  setTimezone: (timezone) => set((state) => ({
    settings: { ...state.settings, timezone }
  })),
  
  setLanguage: (language) => set((state) => ({
    settings: { ...state.settings, language }
  })),
  
  resetSettings: () => set({
    settings: {
      id: 'default',
      theme: 'system',
      notifications: DEFAULT_NOTIFICATION_SETTINGS,
      calendar: DEFAULT_CALENDAR_SETTINGS,
      email: DEFAULT_EMAIL_SETTINGS,
      ai: DEFAULT_AI_SETTINGS,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: 'en',
    }
  })
}));
