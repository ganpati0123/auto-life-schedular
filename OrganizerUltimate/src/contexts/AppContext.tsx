import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import {
  Calendar,
  Event,
  Email,
  EmailAccount,
  EmailLabel,
  UserSettings,
  CalendarViewType,
  DateRange,
  AIMeetingInsight,
  AIScheduleSuggestion,
} from '../types';
import {
  initialCalendars,
  initialEvents,
  initialEmails,
  initialEmailAccounts,
  initialEmailLabels,
  initialSettings,
  sampleAIMeetingInsights,
  sampleAIScheduleSuggestions,
} from '../data/mockData';

// State Type
interface AppState {
  // Calendar State
  calendars: Calendar[];
  events: Event[];
  selectedCalendarId: string | null;
  calendarView: CalendarViewType;
  currentDate: Date;
  dateRange: DateRange;
  
  // Email State
  emailAccounts: EmailAccount[];
  emails: Email[];
  emailLabels: EmailLabel[];
  selectedEmailAccountId: string | null;
  selectedEmailFolder: string;
  selectedEmail: Email | null;
  
  // AI State
  aiMeetingInsights: AIMeetingInsight[];
  aiScheduleSuggestions: AIScheduleSuggestion[];
  aiEnabled: boolean;
  
  // Settings State
  settings: UserSettings;
}

// Action Types
type AppAction =
  | { type: 'SET_CALENDARS'; payload: Calendar[] }
  | { type: 'ADD_CALENDAR'; payload: Calendar }
  | { type: 'UPDATE_CALENDAR'; payload: Calendar }
  | { type: 'DELETE_CALENDAR'; payload: string }
  | { type: 'SET_EVENTS'; payload: Event[] }
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'UPDATE_EVENT'; payload: Event }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'SET_SELECTED_CALENDAR'; payload: string | null }
  | { type: 'SET_CALENDAR_VIEW'; payload: CalendarViewType }
  | { type: 'SET_CURRENT_DATE'; payload: Date }
  | { type: 'SET_DATE_RANGE'; payload: DateRange }
  | { type: 'SET_EMAIL_ACCOUNTS'; payload: EmailAccount[] }
  | { type: 'ADD_EMAIL_ACCOUNT'; payload: EmailAccount }
  | { type: 'UPDATE_EMAIL_ACCOUNT'; payload: EmailAccount }
  | { type: 'SET_EMAILS'; payload: Email[] }
  | { type: 'ADD_EMAIL'; payload: Email }
  | { type: 'UPDATE_EMAIL'; payload: Email }
  | { type: 'DELETE_EMAIL'; payload: string }
  | { type: 'SET_SELECTED_EMAIL_ACCOUNT'; payload: string | null }
  | { type: 'SET_SELECTED_EMAIL_FOLDER'; payload: string }
  | { type: 'SET_SELECTED_EMAIL'; payload: Email | null }
  | { type: 'SET_EMAIL_LABELS'; payload: EmailLabel[] }
  | { type: 'SET_AI_MEETING_INSIGHTS'; payload: AIMeetingInsight[] }
  | { type: 'ADD_AI_MEETING_INSIGHT'; payload: AIMeetingInsight }
  | { type: 'SET_AI_SCHEDULE_SUGGESTIONS'; payload: AIScheduleSuggestion[] }
  | { type: 'SET_AI_ENABLED'; payload: boolean }
  | { type: 'SET_SETTINGS'; payload: UserSettings }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> };

// Initial State
const initialState: AppState = {
  calendars: initialCalendars,
  events: initialEvents,
  selectedCalendarId: 'cal-1',
  calendarView: 'week',
  currentDate: new Date(),
  dateRange: {
    start: new Date(),
    end: new Date(),
  },
  
  emailAccounts: initialEmailAccounts,
  emails: initialEmails,
  emailLabels: initialEmailLabels,
  selectedEmailAccountId: 'acc-1',
  selectedEmailFolder: 'inbox',
  selectedEmail: null,
  
  aiMeetingInsights: sampleAIMeetingInsights,
  aiScheduleSuggestions: sampleAIScheduleSuggestions,
  aiEnabled: true,
  
  settings: initialSettings,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CALENDARS':
      return { ...state, calendars: action.payload };
    case 'ADD_CALENDAR':
      return { ...state, calendars: [...state.calendars, action.payload] };
    case 'UPDATE_CALENDAR':
      return {
        ...state,
        calendars: state.calendars.map((cal) =>
          cal.id === action.payload.id ? action.payload : cal
        ),
      };
    case 'DELETE_CALENDAR':
      return {
        ...state,
        calendars: state.calendars.filter((cal) => cal.id !== action.payload),
      };
    case 'SET_EVENTS':
      return { ...state, events: action.payload };
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map((evt) =>
          evt.id === action.payload.id ? action.payload : evt
        ),
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter((evt) => evt.id !== action.payload),
      };
    case 'SET_SELECTED_CALENDAR':
      return { ...state, selectedCalendarId: action.payload };
    case 'SET_CALENDAR_VIEW':
      return { ...state, calendarView: action.payload };
    case 'SET_CURRENT_DATE':
      return { ...state, currentDate: action.payload };
    case 'SET_DATE_RANGE':
      return { ...state, dateRange: action.payload };
    case 'SET_EMAIL_ACCOUNTS':
      return { ...state, emailAccounts: action.payload };
    case 'ADD_EMAIL_ACCOUNT':
      return { ...state, emailAccounts: [...state.emailAccounts, action.payload] };
    case 'UPDATE_EMAIL_ACCOUNT':
      return {
        ...state,
        emailAccounts: state.emailAccounts.map((acc) =>
          acc.id === action.payload.id ? action.payload : acc
        ),
      };
    case 'SET_EMAILS':
      return { ...state, emails: action.payload };
    case 'ADD_EMAIL':
      return { ...state, emails: [action.payload, ...state.emails] };
    case 'UPDATE_EMAIL':
      return {
        ...state,
        emails: state.emails.map((email) =>
          email.id === action.payload.id ? action.payload : email
        ),
      };
    case 'DELETE_EMAIL':
      return {
        ...state,
        emails: state.emails.filter((email) => email.id !== action.payload),
      };
    case 'SET_SELECTED_EMAIL_ACCOUNT':
      return { ...state, selectedEmailAccountId: action.payload };
    case 'SET_SELECTED_EMAIL_FOLDER':
      return { ...state, selectedEmailFolder: action.payload };
    case 'SET_SELECTED_EMAIL':
      return { ...state, selectedEmail: action.payload };
    case 'SET_EMAIL_LABELS':
      return { ...state, emailLabels: action.payload };
    case 'SET_AI_MEETING_INSIGHTS':
      return { ...state, aiMeetingInsights: action.payload };
    case 'ADD_AI_MEETING_INSIGHT':
      return { ...state, aiMeetingInsights: [...state.aiMeetingInsights, action.payload] };
    case 'SET_AI_SCHEDULE_SUGGESTIONS':
      return { ...state, aiScheduleSuggestions: action.payload };
    case 'SET_AI_ENABLED':
      return { ...state, aiEnabled: action.payload, settings: { ...state.settings, aiEnabled: action.payload } };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    default:
      return state;
  }
}

// Context Type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  
  // Calendar Actions
  addCalendar: (calendar: Calendar) => void;
  updateCalendar: (calendar: Calendar) => void;
  deleteCalendar: (id: string) => void;
  toggleCalendarVisibility: (id: string) => void;
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  setCalendarView: (view: CalendarViewType) => void;
  setCurrentDate: (date: Date) => void;
  
  // Email Actions
  addEmailAccount: (account: EmailAccount) => void;
  updateEmailAccount: (account: EmailAccount) => void;
  addEmail: (email: Email) => void;
  updateEmail: (email: Email) => void;
  deleteEmail: (id: string) => void;
  setSelectedEmailFolder: (folder: string) => void;
  setSelectedEmail: (email: Email | null) => void;
  markEmailAsRead: (id: string) => void;
  toggleEmailStar: (id: string) => void;
  archiveEmail: (id: string) => void;
  moveEmailToFolder: (id: string, folder: string) => void;
  
  // AI Actions
  setAIEnabled: (enabled: boolean) => void;
  addAIMeetingInsight: (insight: AIMeetingInsight) => void;
  
  // Settings Actions
  updateSettings: (settings: Partial<UserSettings>) => void;
  
  // Helper Functions
  getEventsForDateRange: (start: Date, end: Date) => Event[];
  getEmailsForAccount: (accountId: string) => Email[];
  getEmailsForFolder: (accountId: string, folder: string) => Email[];
  getUnreadCount: (accountId: string) => number;
}

// Create Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider Component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Calendar Actions
  const addCalendar = useCallback((calendar: Calendar) => {
    dispatch({ type: 'ADD_CALENDAR', payload: calendar });
  }, []);
  
  const updateCalendar = useCallback((calendar: Calendar) => {
    dispatch({ type: 'UPDATE_CALENDAR', payload: calendar });
  }, []);
  
  const deleteCalendar = useCallback((id: string) => {
    dispatch({ type: 'DELETE_CALENDAR', payload: id });
  }, []);
  
  const toggleCalendarVisibility = useCallback((id: string) => {
    const calendar = state.calendars.find((c) => c.id === id);
    if (calendar) {
      dispatch({ type: 'UPDATE_CALENDAR', payload: { ...calendar, isVisible: !calendar.isVisible } });
    }
  }, [state.calendars]);
  
  const addEvent = useCallback((event: Event) => {
    dispatch({ type: 'ADD_EVENT', payload: event });
  }, []);
  
  const updateEvent = useCallback((event: Event) => {
    dispatch({ type: 'UPDATE_EVENT', payload: event });
  }, []);
  
  const deleteEvent = useCallback((id: string) => {
    dispatch({ type: 'DELETE_EVENT', payload: id });
  }, []);
  
  const setCalendarView = useCallback((view: CalendarViewType) => {
    dispatch({ type: 'SET_CALENDAR_VIEW', payload: view });
  }, []);
  
  const setCurrentDate = useCallback((date: Date) => {
    dispatch({ type: 'SET_CURRENT_DATE', payload: date });
  }, []);
  
  // Email Actions
  const addEmailAccount = useCallback((account: EmailAccount) => {
    dispatch({ type: 'ADD_EMAIL_ACCOUNT', payload: account });
  }, []);
  
  const updateEmailAccount = useCallback((account: EmailAccount) => {
    dispatch({ type: 'UPDATE_EMAIL_ACCOUNT', payload: account });
  }, []);
  
  const addEmail = useCallback((email: Email) => {
    dispatch({ type: 'ADD_EMAIL', payload: email });
  }, []);
  
  const updateEmail = useCallback((email: Email) => {
    dispatch({ type: 'UPDATE_EMAIL', payload: email });
  }, []);
  
  const deleteEmail = useCallback((id: string) => {
    dispatch({ type: 'DELETE_EMAIL', payload: id });
  }, []);
  
  const setSelectedEmailFolder = useCallback((folder: string) => {
    dispatch({ type: 'SET_SELECTED_EMAIL_FOLDER', payload: folder });
  }, []);
  
  const setSelectedEmail = useCallback((email: Email | null) => {
    dispatch({ type: 'SET_SELECTED_EMAIL', payload: email });
  }, []);
  
  const markEmailAsRead = useCallback((id: string) => {
    const email = state.emails.find((e) => e.id === id);
    if (email && !email.isRead) {
      dispatch({ type: 'UPDATE_EMAIL', payload: { ...email, isRead: true } });
    }
  }, [state.emails]);
  
  const toggleEmailStar = useCallback((id: string) => {
    const email = state.emails.find((e) => e.id === id);
    if (email) {
      dispatch({ type: 'UPDATE_EMAIL', payload: { ...email, isStarred: !email.isStarred } });
    }
  }, [state.emails]);
  
  const archiveEmail = useCallback((id: string) => {
    const email = state.emails.find((e) => e.id === id);
    if (email) {
      dispatch({ type: 'UPDATE_EMAIL', payload: { ...email, isArchived: true } });
    }
  }, [state.emails]);
  
  const moveEmailToFolder = useCallback((id: string, folder: string) => {
    const email = state.emails.find((e) => e.id === id);
    if (email) {
      dispatch({ type: 'UPDATE_EMAIL', payload: { ...email, folder: folder as any } });
    }
  }, [state.emails]);
  
  // AI Actions
  const setAIEnabled = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_AI_ENABLED', payload: enabled });
  }, []);
  
  const addAIMeetingInsight = useCallback((insight: AIMeetingInsight) => {
    dispatch({ type: 'ADD_AI_MEETING_INSIGHT', payload: insight });
  }, []);
  
  // Settings Actions
  const updateSettings = useCallback((settings: Partial<UserSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);
  
  // Helper Functions
  const getEventsForDateRange = useCallback((start: Date, end: Date): Event[] => {
    return state.events.filter((event) => {
      const eventStart = new Date(event.startTime);
      return eventStart >= start && eventStart <= end;
    });
  }, [state.events]);
  
  const getEmailsForAccount = useCallback((accountId: string): Email[] => {
    return state.emails.filter((email) => email.accountId === accountId);
  }, [state.emails]);
  
  const getEmailsForFolder = useCallback((accountId: string, folder: string): Email[] => {
    return state.emails.filter(
      (email) => email.accountId === accountId && email.folder === folder
    );
  }, [state.emails]);
  
  const getUnreadCount = useCallback((accountId: string): number => {
    return state.emails.filter(
      (email) => email.accountId === accountId && !email.isRead && email.folder === 'inbox'
    ).length;
  }, [state.emails]);
  
  const value: AppContextType = {
    state,
    dispatch,
    addCalendar,
    updateCalendar,
    deleteCalendar,
    toggleCalendarVisibility,
    addEvent,
    updateEvent,
    deleteEvent,
    setCalendarView,
    setCurrentDate,
    addEmailAccount,
    updateEmailAccount,
    addEmail,
    updateEmail,
    deleteEmail,
    setSelectedEmailFolder,
    setSelectedEmail,
    markEmailAsRead,
    toggleEmailStar,
    archiveEmail,
    moveEmailToFolder,
    setAIEnabled,
    addAIMeetingInsight,
    updateSettings,
    getEventsForDateRange,
    getEmailsForAccount,
    getEmailsForFolder,
    getUnreadCount,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom Hook
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}