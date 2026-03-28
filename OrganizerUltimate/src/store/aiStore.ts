import { create } from 'zustand';
import { AIConversation, AIMessage, Task, ScheduleSuggestion, MeetingNote } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AIState {
  conversations: AIConversation[];
  activeConversationId: string | null;
  tasks: Task[];
  suggestions: ScheduleSuggestion[];
  meetingNotes: MeetingNote[];
  isProcessing: boolean;
  lastError: string | null;
  
  // Conversation Actions
  createConversation: () => void;
  deleteConversation: (id: string) => void;
  setActiveConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: Omit<AIMessage, 'id' | 'timestamp'>) => void;
  
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  
  // Suggestion Actions
  addSuggestion: (suggestion: Omit<ScheduleSuggestion, 'id'>) => void;
  acceptSuggestion: (id: string) => void;
  dismissSuggestion: (id: string) => void;
  
  // Meeting Notes Actions
  createMeetingNote: (note: Omit<MeetingNote, 'id' | 'createdAt'>) => void;
  updateMeetingNote: (id: string, updates: Partial<MeetingNote>) => void;
  deleteMeetingNote: (id: string) => void;
  
  // Status Actions
  setProcessing: (processing: boolean) => void;
  setError: (error: string | null) => void;
  
  // Selectors
  getActiveConversation: () => AIConversation | null;
  getPendingTasks: () => Task[];
  getActiveSuggestions: () => ScheduleSuggestion[];
}

export const useAIStore = create<AIState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  tasks: [],
  suggestions: [],
  meetingNotes: [],
  isProcessing: false,
  lastError: null,
  
  createConversation: () => {
    const newConversation: AIConversation = {
      id: uuidv4(),
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    set((state) => ({
      conversations: [...state.conversations, newConversation],
      activeConversationId: newConversation.id
    }));
  },
  
  deleteConversation: (id) => set((state) => ({
    conversations: state.conversations.filter(c => c.id !== id),
    activeConversationId: state.activeConversationId === id ? null : state.activeConversationId
  })),
  
  setActiveConversation: (id) => set({ activeConversationId: id }),
  
  addMessage: (conversationId, message) => set((state) => ({
    conversations: state.conversations.map(c => 
      c.id === conversationId 
        ? { 
            ...c, 
            messages: [...c.messages, { ...message, id: uuidv4(), timestamp: new Date() }],
            updatedAt: new Date()
          } 
        : c
    )
  })),
  
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, {
      ...task,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    }]
  })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(t => 
      t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
    )
  })),
  
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== id)
  })),
  
  completeTask: (id) => set((state) => ({
    tasks: state.tasks.map(t => 
      t.id === id ? { ...t, status: 'completed', updatedAt: new Date() } : t
    )
  })),
  
  addSuggestion: (suggestion) => set((state) => ({
    suggestions: [...state.suggestions, { ...suggestion, id: uuidv4() }]
  })),
  
  acceptSuggestion: (id) => set((state) => ({
    suggestions: state.suggestions.filter(s => s.id !== id)
  })),
  
  dismissSuggestion: (id) => set((state) => ({
    suggestions: state.suggestions.filter(s => s.id !== id)
  })),
  
  createMeetingNote: (note) => set((state) => ({
    meetingNotes: [...state.meetingNotes, { ...note, id: uuidv4(), createdAt: new Date() }]
  })),
  
  updateMeetingNote: (id, updates) => set((state) => ({
    meetingNotes: state.meetingNotes.map(n => 
      n.id === id ? { ...n, ...updates } : n
    )
  })),
  
  deleteMeetingNote: (id) => set((state) => ({
    meetingNotes: state.meetingNotes.filter(n => n.id !== id)
  })),
  
  setProcessing: (processing) => set({ isProcessing: processing }),
  
  setError: (error) => set({ lastError: error }),
  
  getActiveConversation: () => {
    const state = get();
    return state.conversations.find(c => c.id === state.activeConversationId) || null;
  },
  
  getPendingTasks: () => {
    const state = get();
    return state.tasks.filter(t => t.status !== 'completed');
  },
  
  getActiveSuggestions: () => {
    return get().suggestions;
  }
}));
