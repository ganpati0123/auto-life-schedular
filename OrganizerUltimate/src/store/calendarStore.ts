import { create } from 'zustand';
import { Calendar, CalendarEvent, CalendarViewType, EventFilter } from '../types';
import { DEFAULT_CALENDARS } from '../constants';
import { v4 as uuidv4 } from 'uuid';

interface CalendarState {
  calendars: Calendar[];
  events: CalendarEvent[];
  selectedDate: Date;
  currentView: CalendarViewType;
  selectedCalendarIds: string[];
  filter: EventFilter;
  
  // Actions
  setSelectedDate: (date: Date) => void;
  setCurrentView: (view: CalendarViewType) => void;
  addCalendar: (calendar: Omit<Calendar, 'id'>) => void;
  updateCalendar: (id: string, updates: Partial<Calendar>) => void;
  deleteCalendar: (id: string) => void;
  toggleCalendarVisibility: (id: string) => void;
  setSelectedCalendars: (ids: string[]) => void;
  
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  setFilter: (filter: EventFilter) => void;
  
  getEventsForDate: (date: Date) => CalendarEvent[];
  getEventsForRange: (startDate: Date, endDate: Date) => CalendarEvent[];
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  calendars: DEFAULT_CALENDARS,
  events: [],
  selectedDate: new Date(),
  currentView: 'month',
  selectedCalendarIds: DEFAULT_CALENDARS.map(c => c.id),
  filter: {},
  
  setSelectedDate: (date) => set({ selectedDate: date }),
  setCurrentView: (view) => set({ currentView: view }),
  
  addCalendar: (calendar) => set((state) => ({
    calendars: [...state.calendars, { ...calendar, id: uuidv4() }]
  })),
  
  updateCalendar: (id, updates) => set((state) => ({
    calendars: state.calendars.map(c => c.id === id ? { ...c, ...updates } : c)
  })),
  
  deleteCalendar: (id) => set((state) => ({
    calendars: state.calendars.filter(c => c.id !== id)
  })),
  
  toggleCalendarVisibility: (id) => set((state) => ({
    calendars: state.calendars.map(c => 
      c.id === id ? { ...c, isVisible: !c.isVisible } : c
    )
  })),
  
  setSelectedCalendars: (ids) => set({ selectedCalendarIds: ids }),
  
  addEvent: (event) => set((state) => ({
    events: [...state.events, {
      ...event,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    }]
  })),
  
  updateEvent: (id, updates) => set((state) => ({
    events: state.events.map(e => 
      e.id === id ? { ...e, ...updates, updatedAt: new Date() } : e
    )
  })),
  
  deleteEvent: (id) => set((state) => ({
    events: state.events.filter(e => e.id !== id)
  })),
  
  setFilter: (filter) => set({ filter }),
  
  getEventsForDate: (date) => {
    const state = get();
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    
    return state.events.filter(e => {
      const eventStart = new Date(e.startDate);
      const eventEnd = new Date(e.endDate);
      const inCalendar = state.selectedCalendarIds.includes(e.calendarId);
      
      if (!inCalendar) return false;
      
      if (e.allDay) {
        return eventStart <= dayEnd && eventEnd >= dayStart;
      }
      
      return eventStart <= dayEnd && eventEnd >= dayStart;
    });
  },
  
  getEventsForRange: (startDate, endDate) => {
    const state = get();
    return state.events.filter(e => {
      const eventStart = new Date(e.startDate);
      const eventEnd = new Date(e.endDate);
      const inCalendar = state.selectedCalendarIds.includes(e.calendarId);
      
      if (!inCalendar) return false;
      
      return eventStart <= endDate && eventEnd >= startDate;
    });
  }
}));
