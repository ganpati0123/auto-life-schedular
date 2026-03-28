// Event Types
export type EventCategory = 'meeting' | 'personal' | 'work' | 'health' | 'other';

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export type RSVPStatus = 'pending' | 'accepted' | 'declined' | 'tentative';

export interface Calendar {
  id: string;
  name: string;
  color: string;
  isVisible: boolean;
  isDefault: boolean;
}

export interface Event {
  id: string;
  calendarId: string;
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  category: EventCategory;
  color: string;
  recurrence: RecurrenceType;
  recurrenceEndDate?: Date;
  reminders: number[]; // minutes before event
  attendees: Attendee[];
  isOnline: boolean;
  meetingLink?: string;
  notes?: string;
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
  status: RSVPStatus;
}

// Email Types
export type EmailFolder = 'inbox' | 'sent' | 'drafts' | 'trash' | 'spam';

export interface EmailLabel {
  id: string;
  name: string;
  color: string;
}

export interface EmailAccount {
  id: string;
  email: string;
  name: string;
  type: 'gmail' | 'outlook' | 'icloud';
  isConnected: boolean;
  unreadCount: number;
}

export interface Email {
  id: string;
  accountId: string;
  folder: EmailFolder;
  from: {
    name: string;
    email: string;
  };
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
  preview: string;
  date: Date;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  labels: string[];
  hasAttachments: boolean;
  attachments: Attachment[];
  isPriority: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url?: string;
}

// AI Types
export interface AIMeetingInsight {
  id: string;
  eventId: string;
  summary: string;
  actionItems: ActionItem[];
  transcription?: string;
  createdAt: Date;
}

export interface ActionItem {
  id: string;
  title: string;
  assignee?: string;
  dueDate?: Date;
  isCompleted: boolean;
}

export interface AIScheduleSuggestion {
  id: string;
  suggestedTime: Date;
  duration: number;
  reason: string;
  confidence: number;
}

// Settings Types
export interface UserSettings {
  theme: 'dark' | 'light';
  defaultCalendarId: string;
  defaultEmailAccountId: string;
  notificationsEnabled: boolean;
  aiEnabled: boolean;
  timeZone: string;
  signature: string;
  autoReplyEnabled: boolean;
  autoReplyMessage: string;
}

// View Types
export type CalendarViewType = 'day' | 'week' | 'month' | 'year' | 'agenda';

export interface DateRange {
  start: Date;
  end: Date;
}