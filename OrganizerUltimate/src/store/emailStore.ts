import { create } from 'zustand';
import { EmailAccount, EmailMessage, EmailFolder, EmailLabel, EmailFilter } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface EmailState {
  accounts: EmailAccount[];
  messages: EmailMessage[];
  folders: EmailFolder[];
  labels: EmailLabel[];
  selectedAccountId: string | null;
  currentFolder: string;
  filter: EmailFilter;
  searchQuery: string;
  isLoading: boolean;
  
  // Actions
  addAccount: (account: Omit<EmailAccount, 'id'>) => void;
  updateAccount: (id: string, updates: Partial<EmailAccount>) => void;
  deleteAccount: (id: string) => void;
  setSelectedAccount: (id: string | null) => void;
  
  addMessage: (message: Omit<EmailMessage, 'id' | 'createdAt'>) => void;
  updateMessage: (id: string, updates: Partial<EmailMessage>) => void;
  deleteMessage: (id: string) => void;
  moveMessage: (id: string, folder: string) => void;
  setMessageRead: (id: string, isRead: boolean) => void;
  toggleStar: (id: string) => void;
  
  addFolder: (folder: Omit<EmailFolder, 'id'>) => void;
  updateFolder: (id: string, updates: Partial<EmailFolder>) => void;
  deleteFolder: (id: string) => void;
  setCurrentFolder: (folder: string) => void;
  
  addLabel: (label: Omit<EmailLabel, 'id'>) => void;
  updateLabel: (id: string, updates: Partial<EmailLabel>) => void;
  deleteLabel: (id: string) => void;
  
  setFilter: (filter: EmailFilter) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  
  getMessagesForFolder: (folder: string) => EmailMessage[];
  searchMessages: (query: string) => EmailMessage[];
}

export const useEmailStore = create<EmailState>((set, get) => ({
  accounts: [],
  messages: [],
  folders: [
    { id: 'inbox', accountId: '', name: 'Inbox', path: 'INBOX', type: 'inbox', unreadCount: 0, totalCount: 0 },
    { id: 'sent', accountId: '', name: 'Sent', path: 'Sent', type: 'sent', unreadCount: 0, totalCount: 0 },
    { id: 'drafts', accountId: '', name: 'Drafts', path: 'Drafts', type: 'drafts', unreadCount: 0, totalCount: 0 },
    { id: 'trash', accountId: '', name: 'Trash', path: 'Trash', type: 'trash', unreadCount: 0, totalCount: 0 },
    { id: 'spam', accountId: '', name: 'Spam', path: 'Spam', type: 'spam', unreadCount: 0, totalCount: 0 },
  ],
  labels: [],
  selectedAccountId: null,
  currentFolder: 'inbox',
  filter: {},
  searchQuery: '',
  isLoading: false,
  
  addAccount: (account) => set((state) => ({
    accounts: [...state.accounts, { ...account, id: uuidv4() }]
  })),
  
  updateAccount: (id, updates) => set((state) => ({
    accounts: state.accounts.map(a => a.id === id ? { ...a, ...updates } : a)
  })),
  
  deleteAccount: (id) => set((state) => ({
    accounts: state.accounts.filter(a => a.id !== id)
  })),
  
  setSelectedAccount: (id) => set({ selectedAccountId: id }),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, { ...message, id: uuidv4(), createdAt: new Date() }]
  })),
  
  updateMessage: (id, updates) => set((state) => ({
    messages: state.messages.map(m => m.id === id ? { ...m, ...updates } : m)
  })),
  
  deleteMessage: (id) => set((state) => ({
    messages: state.messages.filter(m => m.id !== id)
  })),
  
  moveMessage: (id, folder) => set((state) => ({
    messages: state.messages.map(m => m.id === id ? { ...m, folder } : m)
  })),
  
  setMessageRead: (id, isRead) => set((state) => ({
    messages: state.messages.map(m => m.id === id ? { ...m, isRead } : m)
  })),
  
  toggleStar: (id) => set((state) => ({
    messages: state.messages.map(m => m.id === id ? { ...m, isStarred: !m.isStarred } : m)
  })),
  
  addFolder: (folder) => set((state) => ({
    folders: [...state.folders, { ...folder, id: uuidv4() }]
  })),
  
  updateFolder: (id, updates) => set((state) => ({
    folders: state.folders.map(f => f.id === id ? { ...f, ...updates } : f)
  })),
  
  deleteFolder: (id) => set((state) => ({
    folders: state.folders.filter(f => f.id !== id)
  })),
  
  setCurrentFolder: (folder) => set({ currentFolder: folder }),
  
  addLabel: (label) => set((state) => ({
    labels: [...state.labels, { ...label, id: uuidv4() }]
  })),
  
  updateLabel: (id, updates) => set((state) => ({
    labels: state.labels.map(l => l.id === id ? { ...l, ...updates } : l)
  })),
  
  deleteLabel: (id) => set((state) => ({
    labels: state.labels.filter(l => l.id !== id)
  })),
  
  setFilter: (filter) => set({ filter }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  getMessagesForFolder: (folder) => {
    const state = get();
    return state.messages.filter(m => m.folder === folder);
  },
  
  searchMessages: (query) => {
    const state = get();
    const lowerQuery = query.toLowerCase();
    return state.messages.filter(m => 
      m.subject.toLowerCase().includes(lowerQuery) ||
      m.body.toLowerCase().includes(lowerQuery) ||
      m.from.email.toLowerCase().includes(lowerQuery)
    );
  }
}));
