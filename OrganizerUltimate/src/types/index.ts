// Calendar Types
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  color: string;
  calendarId: string;
  attendees: Attendee[];
  reminders: Reminder[];
  recurring?: RecurringConfig;
  timezone?: string;
  meetingLink?: string;
  isOrganizer: boolean;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendee {
  id: string;
  email: string;
  name: string;
  responseStatus: 'accepted' | 'declined' | 'tentative' | 'needsAction';
}

export interface Reminder {
  id: string;
  minutesBefore: number;
  method: 'popup' | 'email' | 'sms';
}

export interface RecurringConfig {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: Date;
  count?: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  monthOfYear?: number;
}

export type EventStatus = 'confirmed' | 'tentative' | 'cancelled';

export interface Calendar {
  id: string;
  name: string;
  color: string;
  isVisible: boolean;
  isDefault: boolean;
  canEdit: boolean;
  canShare: boolean;
  accessLevel: 'owner' | 'editor' | 'viewer';
  owner: string;
}

export type CalendarViewType = 'day' | 'week' | 'month' | 'year' | 'agenda';

// Email Types
export interface EmailAccount {
  id: string;
  email: string;
  displayName: string;
  provider: 'gmail' | 'outlook' | 'icloud' | 'custom';
  smtpHost: string;
  smtpPort: number;
  imapHost: string;
  imapPort: number;
  username: string;
  password?: string;
  useSSL: boolean;
  isActive: boolean;
  syncEnabled: boolean;
  lastSyncAt?: Date;
}

export interface EmailMessage {
  id: string;
  accountId: string;
  messageId: string;
  inReplyTo?: string;
  references?: string[];
  subject: string;
  body: string;
  bodyHtml?: string;
  from: EmailAddress;
  to: EmailAddress[];
  cc: EmailAddress[];
  bcc: EmailAddress[];
  attachments: Attachment[];
  isRead: boolean;
  isStarred: boolean;
  isPriority: boolean;
  folder: string;
  labels: string[];
  spamScore?: number;
  receivedAt: Date;
  sentAt?: Date;
  createdAt: Date;
}

export interface EmailAddress {
  email: string;
  name?: string;
}

export interface Attachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  uri?: string;
}

export interface EmailFolder {
  id: string;
  accountId: string;
  name: string;
  path: string;
  type: 'inbox' | 'sent' | 'drafts' | 'trash' | 'spam' | 'custom';
  unreadCount: number;
  totalCount: number;
}

export interface EmailLabel {
  id: string;
  accountId: string;
  name: string;
  color: string;
}

export interface EmailSignature {
  id: string;
  accountId: string;
  name: string;
  content: string;
  isDefault: boolean;
}

export interface AutoReply {
  id: string;
  accountId: string;
  enabled: boolean;
  subject?: string;
  message: string;
  startDate?: Date;
  endDate?: Date;
  contactsOnly: boolean;
}

// AI Assistant Types
export interface AIConversation {
  id: string;
  messages: AIMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: AIAction[];
}

export interface AIAction {
  id: string;
  type: 'schedule_event' | 'send_email' | 'create_task' | 'search_emails' | 'summarize';
  data: any;
  executed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  relatedEmailId?: string;
  relatedEventId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MeetingNote {
  id: string;
  eventId: string;
  title: string;
  content: string;
  attendees: string[];
  actionItems: Task[];
  createdAt: Date;
}

export interface ScheduleSuggestion {
  id: string;
  proposedTime: Date;
  duration: number;
  title: string;
  description?: string;
  attendees: string[];
  confidence: number;
  reason: string;
}

// Settings Types
export interface UserSettings {
  id: string;
  theme: 'light' | 'dark' | 'system';
  defaultCalendarId?: string;
  defaultEmailAccountId?: string;
  notifications: NotificationSettings;
  calendar: CalendarSettings;
  email: EmailSettings;
  ai: AISettings;
  timezone: string;
  language: string;
}

export interface NotificationSettings {
  enabled: boolean;
  emailNotifications: boolean;
  calendarNotifications: boolean;
  meetingReminders: boolean;
  aiSuggestions: boolean;
  sound: boolean;
  vibration: boolean;
}

export interface CalendarSettings {
  defaultView: CalendarViewType;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  showWeekNumbers: boolean;
  firstDayOfYear: number;
  minDate: string;
  maxDate: string;
  defaultEventDuration: number;
  conflictsWarning: boolean;
}

export interface EmailSettings {
  autoArchive: boolean;
  autoDeleteSpam: boolean;
  autoDeleteTrash: boolean;
  defaultSignatureId?: string;
  priorityInbox: boolean;
  conversationView: boolean;
  displayDensity: 'comfortable' | 'compact';
  swipeActions: boolean;
}

export interface AISettings {
  enabled: boolean;
  autoSchedule: boolean;
  autoReply: boolean;
  meetingTranscription: boolean;
  emailSummarization: boolean;
  apiKey?: string;
  model: 'gpt-4' | 'gpt-3.5-turbo';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Filter Types
export interface EventFilter {
  calendarIds?: string[];
  startDate?: Date;
  endDate?: Date;
  searchQuery?: string;
}

export interface EmailFilter {
  accountId?: string;
  folder?: string;
  labelIds?: string[];
  isRead?: boolean;
  isStarred?: boolean;
  isPriority?: boolean;
  startDate?: Date;
  endDate?: Date;
  searchQuery?: string;
  from?: string;
  to?: string;
  subject?: string;
  hasAttachment?: boolean;
  minAttachmentCount?: number;
}

// Action Types
export interface EmailAction {
  type: 'archive' | 'delete' | 'mark_read' | 'mark_unread' | 'star' | 'unstar' | 'move' | 'label' | 'spam' | 'not_spam';
  folderId?: string;
  labelIds?: string[];
}

export interface EventAction {
  type: 'delete' | 'update' | 'duplicate';
  event?: Partial<CalendarEvent>;
}
