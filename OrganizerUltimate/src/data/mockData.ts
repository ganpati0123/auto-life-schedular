import { Calendar, Event, Email, EmailAccount, EmailLabel, UserSettings } from '../types';
import { addDays, addHours, subDays, subHours, startOfDay, setHours } from 'date-fns';

const now = new Date();
const today = startOfDay(now);

// Sample Calendars
export const initialCalendars: Calendar[] = [
  {
    id: 'cal-1',
    name: 'Work',
    color: '#667EEA',
    isVisible: true,
    isDefault: true,
  },
  {
    id: 'cal-2',
    name: 'Personal',
    color: '#4CAF50',
    isVisible: true,
    isDefault: false,
  },
  {
    id: 'cal-3',
    name: 'Family',
    color: '#FF9800',
    isVisible: true,
    isDefault: false,
  },
  {
    id: 'cal-4',
    name: 'Health',
    color: '#FF6B6B',
    isVisible: false,
    isDefault: false,
  },
];

// Sample Events
export const initialEvents: Event[] = [
  {
    id: 'evt-1',
    calendarId: 'cal-1',
    title: 'Team Standup',
    description: 'Daily standup meeting with the development team',
    location: 'Conference Room A',
    startTime: setHours(today, 9),
    endTime: setHours(today, 9, 30),
    isAllDay: false,
    category: 'meeting',
    color: '#667EEA',
    recurrence: 'daily',
    reminders: [15],
    attendees: [
      { id: 'att-1', name: 'Alice Johnson', email: 'alice@company.com', status: 'accepted' },
      { id: 'att-2', name: 'Bob Smith', email: 'bob@company.com', status: 'accepted' },
    ],
    isOnline: true,
    meetingLink: 'https://meet.company.com/standup',
  },
  {
    id: 'evt-2',
    calendarId: 'cal-1',
    title: 'Project Review',
    description: 'Review progress on Q1 deliverables',
    location: 'Zoom Meeting',
    startTime: setHours(today, 11),
    endTime: setHours(today, 12),
    isAllDay: false,
    category: 'meeting',
    color: '#667EEA',
    recurrence: 'none',
    reminders: [30],
    attendees: [
      { id: 'att-3', name: 'Charlie Davis', email: 'charlie@company.com', status: 'pending' },
    ],
    isOnline: true,
    meetingLink: 'https://zoom.us/j/123456789',
  },
  {
    id: 'evt-3',
    calendarId: 'cal-2',
    title: 'Gym Session',
    description: 'Morning workout',
    location: 'FitLife Gym',
    startTime: setHours(today, 7),
    endTime: setHours(today, 8),
    isAllDay: false,
    category: 'health',
    color: '#FF6B6B',
    recurrence: 'daily',
    reminders: [15],
    attendees: [],
    isOnline: false,
  },
  {
    id: 'evt-4',
    calendarId: 'cal-1',
    title: 'Client Call',
    description: 'Discuss project requirements with client',
    location: 'Phone',
    startTime: setHours(addDays(today, 1), 14),
    endTime: setHours(addDays(today, 1), 15),
    isAllDay: false,
    category: 'meeting',
    color: '#667EEA',
    recurrence: 'none',
    reminders: [15],
    attendees: [
      { id: 'att-4', name: 'David Lee', email: 'david@client.com', status: 'accepted' },
    ],
    isOnline: true,
    meetingLink: 'https://meet.google.com/abc-defg-hij',
  },
  {
    id: 'evt-5',
    calendarId: 'cal-3',
    title: 'Family Dinner',
    description: 'Weekly family dinner',
    location: 'Home',
    startTime: setHours(addDays(today, 2), 18),
    endTime: setHours(addDays(today, 2), 20),
    isAllDay: false,
    category: 'personal',
    color: '#FF9800',
    recurrence: 'weekly',
    reminders: [60],
    attendees: [
      { id: 'att-5', name: 'Mom', email: 'mom@family.com', status: 'accepted' },
      { id: 'att-6', name: 'Dad', email: 'dad@family.com', status: 'accepted' },
    ],
    isOnline: false,
  },
  {
    id: 'evt-6',
    calendarId: 'cal-1',
    title: 'Sprint Planning',
    description: 'Plan tasks for the next sprint',
    location: 'Conference Room B',
    startTime: setHours(addDays(today, 3), 10),
    endTime: setHours(addDays(today, 3), 12),
    isAllDay: false,
    category: 'meeting',
    color: '#667EEA',
    recurrence: 'weekly',
    reminders: [30, 60],
    attendees: [
      { id: 'att-7', name: 'Development Team', email: 'dev@company.com', status: 'pending' },
    ],
    isOnline: true,
    meetingLink: 'https://meet.company.com/sprint',
  },
  {
    id: 'evt-7',
    calendarId: 'cal-2',
    title: 'Doctor Appointment',
    description: 'Annual checkup',
    location: 'Medical Center',
    startTime: setHours(addDays(today, 4), 9),
    endTime: setHours(addDays(today, 4), 10),
    isAllDay: false,
    category: 'health',
    color: '#FF6B6B',
    recurrence: 'none',
    reminders: [1440, 60],
    attendees: [],
    isOnline: false,
  },
  {
    id: 'evt-8',
    calendarId: 'cal-1',
    title: 'All-Hands Meeting',
    description: 'Company-wide all hands',
    location: 'Main Auditorium',
    startTime: setHours(addDays(today, 5), 15),
    endTime: setHours(addDays(today, 5), 16, 30),
    isAllDay: false,
    category: 'meeting',
    color: '#667EEA',
    recurrence: 'monthly',
    reminders: [60, 1440],
    attendees: [],
    isOnline: true,
    meetingLink: 'https://meet.company.com/allhands',
  },
];

// Sample Email Accounts
export const initialEmailAccounts: EmailAccount[] = [
  {
    id: 'acc-1',
    email: 'john.doe@gmail.com',
    name: 'John Doe',
    type: 'gmail',
    isConnected: true,
    unreadCount: 5,
  },
  {
    id: 'acc-2',
    email: 'john.doe@company.com',
    name: 'John Doe (Work)',
    type: 'outlook',
    isConnected: true,
    unreadCount: 12,
  },
  {
    id: 'acc-3',
    email: 'johndoe@icloud.com',
    name: 'John Doe',
    type: 'icloud',
    isConnected: false,
    unreadCount: 0,
  },
];

// Sample Emails
export const initialEmails: Email[] = [
  {
    id: 'email-1',
    accountId: 'acc-1',
    folder: 'inbox',
    from: { name: 'Sarah Connor', email: 'sarah.connor@techcorp.com' },
    to: ['john.doe@gmail.com'],
    cc: [],
    bcc: [],
    subject: 'Project Update - Phase 2 Complete',
    preview: 'Great news! We have successfully completed phase 2 of the project ahead of schedule...',
    body: `Hi John,

Great news! We have successfully completed phase 2 of the project ahead of schedule. The team has been working tirelessly to ensure everything is in order.

Key highlights:
- All deliverables completed on time
- Quality assurance tests passed
- Client feedback has been extremely positive

I've attached the detailed report for your review. Let's schedule a call to discuss the next steps.

Best regards,
Sarah`,
    date: subHours(now, 2),
    isRead: false,
    isStarred: true,
    isArchived: false,
    labels: ['work', 'important'],
    hasAttachments: true,
    attachments: [
      { id: 'att-1', name: 'Phase2_Report.pdf', size: '2.4 MB', type: 'pdf' },
      { id: 'att-2', name: 'Project_Timeline.xlsx', size: '156 KB', type: 'xlsx' },
    ],
    isPriority: true,
  },
  {
    id: 'email-2',
    accountId: 'acc-1',
    folder: 'inbox',
    from: { name: 'Newsletter', email: 'newsletter@techweekly.com' },
    to: ['john.doe@gmail.com'],
    cc: [],
    bcc: [],
    subject: 'This Week in Tech: AI Breakthroughs',
    preview: 'This week saw major advances in artificial intelligence with new models...',
    body: `This Week in Tech

Top Stories:

1. AI Breakthroughs - New models achieving human-level performance
2. Quantum Computing - Major milestone in quantum error correction
3. Green Tech - Renewable energy costs hit new lows

[Read more on our website...]`,
    date: subHours(now, 5),
    isRead: true,
    isStarred: false,
    isArchived: false,
    labels: ['newsletter'],
    hasAttachments: false,
    attachments: [],
    isPriority: false,
  },
  {
    id: 'email-3',
    accountId: 'acc-2',
    folder: 'inbox',
    from: { name: 'HR Department', email: 'hr@company.com' },
    to: ['john.doe@company.com'],
    cc: [],
    bcc: [],
    subject: 'Reminder: Submit Your Timesheet',
    preview: 'This is a reminder that your timesheet for last week needs to be submitted...',
    body: `Dear John,

This is a reminder that your timesheet for last week needs to be submitted by end of day Friday.

Please ensure all your hours are logged correctly and any overtime is properly documented.

If you have any questions, please contact the HR department.

Best,
HR Team`,
    date: subHours(now, 8),
    isRead: false,
    isStarred: false,
    isArchived: false,
    labels: ['work'],
    hasAttachments: false,
    attachments: [],
    isPriority: false,
  },
  {
    id: 'email-4',
    accountId: 'acc-1',
    folder: 'inbox',
    from: { name: 'Emily Chen', email: 'emily.chen@startup.io' },
    to: ['john.doe@gmail.com'],
    cc: [],
    bcc: [],
    subject: 'Coffee Next Week?',
    preview: 'Hey John! I was in the area next week and thought we could catch up...',
    body: `Hey John!

I was in the area next week and thought we could catch up. It's been ages since we last met!

Let me know if you're free on Tuesday or Wednesday afternoon.

Cheers,
Emily`,
    date: subDays(now, 1),
    isRead: true,
    isStarred: true,
    isArchived: false,
    labels: ['personal'],
    hasAttachments: false,
    attachments: [],
    isPriority: false,
  },
  {
    id: 'email-5',
    accountId: 'acc-2',
    folder: 'inbox',
    from: { name: 'Mike Wilson', email: 'mike.wilson@vendor.com' },
    to: ['john.doe@company.com'],
    cc: [],
    bcc: [],
    subject: 'Invoice #INV-2024-0456',
    preview: 'Please find attached the invoice for services rendered last month...',
    body: `Dear John,

Please find attached the invoice for services rendered last month.

Invoice Details:
- Invoice #: INV-2024-0456
- Amount: $5,500.00
- Due Date: March 15, 2024

Please process this payment at your earliest convenience.

Thank you for your business!

Best,
Mike Wilson
Accounts Payable`,
    date: subDays(now, 2),
    isRead: true,
    isStarred: false,
    isArchived: false,
    labels: ['finance'],
    hasAttachments: true,
    attachments: [
      { id: 'att-3', name: 'INV-2024-0456.pdf', size: '124 KB', type: 'pdf' },
    ],
    isPriority: true,
  },
  {
    id: 'email-6',
    accountId: 'acc-1',
    folder: 'sent',
    from: { name: 'John Doe', email: 'john.doe@gmail.com' },
    to: ['sarah.connor@techcorp.com'],
    cc: [],
    bcc: [],
    subject: 'Re: Project Update - Phase 2 Complete',
    preview: 'Thanks Sarah! Great work by the team. I would love to schedule a call...',
    body: `Hi Sarah,

Thanks for the update! Great work by the team. I would love to schedule a call to discuss the next steps.

How about Monday at 2 PM?

Best,
John`,
    date: subHours(now, 1),
    isRead: true,
    isStarred: false,
    isArchived: false,
    labels: [],
    hasAttachments: false,
    attachments: [],
    isPriority: false,
  },
  {
    id: 'email-7',
    accountId: 'acc-1',
    folder: 'drafts',
    from: { name: 'John Doe', email: 'john.doe@gmail.com' },
    to: ['boss@company.com'],
    cc: [],
    bcc: [],
    subject: 'Weekly Status Report',
    preview: '',
    body: `Hi,

Here's my weekly status report:

1. Completed all assigned tasks
2. Attended all meetings
3. Ongoing projects on track

Best,
John`,
    date: now,
    isRead: true,
    isStarred: false,
    isArchived: false,
    labels: [],
    hasAttachments: false,
    attachments: [],
    isPriority: false,
  },
  {
    id: 'email-8',
    accountId: 'acc-1',
    folder: 'trash',
    from: { name: 'Spam', email: ' Offers' },
    to: ['john.doe@gmail.com'],
    cc: [],
    bcc: [],
    subject: 'YOU WON A FREE IPHONE!',
    preview: 'Click here to claim your free iPhone now!',
    body: `CONGRATULATIONS!

You have been selected to win a FREE iPhone 15!

Click the link below to claim your prize now!

[CLAIM NOW]`,
    date: subDays(now, 5),
    isRead: true,
    isStarred: false,
    isArchived: false,
    labels: [],
    hasAttachments: false,
    attachments: [],
    isPriority: false,
  },
  {
    id: 'email-9',
    accountId: 'acc-2',
    folder: 'inbox',
    from: { name: 'Marketing Team', email: 'marketing@company.com' },
    to: ['john.doe@company.com'],
    cc: [],
    bcc: [],
    subject: 'New Product Launch - Next Month',
    preview: 'We are excited to announce our upcoming product launch scheduled for next month...',
    body: `Team,

We are excited to announce our upcoming product launch scheduled for next month.

Key Details:
- Launch Date: April 15, 2024
- Product: SmartHome Hub Pro
- Target Market: Residential customers

All team members are requested to attend the launch preparation meeting next week.

Regards,
Marketing Team`,
    date: subHours(now, 12),
    isRead: false,
    isStarred: false,
    isArchived: false,
    labels: ['work'],
    hasAttachments: true,
    attachments: [
      { id: 'att-4', name: 'Product_Specs.pdf', size: '3.2 MB', type: 'pdf' },
    ],
    isPriority: false,
  },
  {
    id: 'email-10',
    accountId: 'acc-1',
    folder: 'inbox',
    from: { name: 'Travel Deals', email: 'deals@airlines.com' },
    to: ['john.doe@gmail.com'],
    cc: [],
    bcc: [],
    subject: 'Flash Sale - 50% Off International Flights!',
    preview: 'Book now and save big on your next vacation...',
    body: `🌍 FLASH SALE! 🌍

50% OFF International Flights!

Book your next adventure now and save big!

Destinations include:
- Paris
- Tokyo
- London
- Sydney
- And many more!

Offer valid until March 31, 2024.

[BOOK NOW]`,
    date: subDays(now, 3),
    isRead: true,
    isStarred: false,
    isArchived: true,
    labels: ['travel'],
    hasAttachments: false,
    attachments: [],
    isPriority: false,
  },
];

// Sample Email Labels
export const initialEmailLabels: EmailLabel[] = [
  { id: 'work', name: 'Work', color: '#667EEA' },
  { id: 'personal', name: 'Personal', color: '#4CAF50' },
  { id: 'important', name: 'Important', color: '#FF6B6B' },
  { id: 'finance', name: 'Finance', color: '#FF9800' },
  { id: 'travel', name: 'Travel', color: '#2196F3' },
  { id: 'newsletter', name: 'Newsletter', color: '#A0AEC0' },
];

// Initial Settings
export const initialSettings: UserSettings = {
  theme: 'dark',
  defaultCalendarId: 'cal-1',
  defaultEmailAccountId: 'acc-1',
  notificationsEnabled: true,
  aiEnabled: true,
  timeZone: 'America/New_York',
  signature: 'Best regards,\nJohn Doe',
  autoReplyEnabled: false,
  autoReplyMessage: '',
};

// AI Insights and Suggestions
export const sampleAIMeetingInsights = [
  {
    id: 'insight-1',
    eventId: 'evt-1',
    summary: 'Daily standup completed. Key updates from team: Alice completed feature X, Bob is working on feature Y, no blockers reported.',
    actionItems: [
      { id: 'action-1', title: 'Review Alice\'s PR for feature X', assignee: 'John', dueDate: addDays(today, 1), isCompleted: false },
      { id: 'action-2', title: 'Sync with Bob on feature Y progress', assignee: 'John', dueDate: today, isCompleted: false },
    ],
    createdAt: subHours(now, 1),
  },
];

export const sampleAIScheduleSuggestions = [
  {
    id: 'suggestion-1',
    suggestedTime: setHours(addDays(today, 1), 15),
    duration: 60,
    reason: 'Optimal time based on your calendar availability and focus hours',
    confidence: 0.92,
  },
  {
    id: 'suggestion-2',
    suggestedTime: setHours(addDays(today, 2), 10),
    duration: 30,
    reason: 'Best time for quick sync with team before lunch',
    confidence: 0.85,
  },
];