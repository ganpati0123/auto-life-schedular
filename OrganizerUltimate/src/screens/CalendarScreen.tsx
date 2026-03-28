import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet, Modal, TouchableOpacity, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '../hooks/useTheme';
import { useCalendarStore } from '../store';
import { CalendarHeader, EventItem, EventForm } from '../components/calendar';
import { EmptyState, IconButton } from '../components/common';
import { CalendarEvent } from '../types';
import { generateMarkedDates, formatDate } from '../utils';
import { SPACING } from '../constants';
import { format } from 'date-fns';

export const CalendarScreen: React.FC = () => {
  const { colors } = useTheme();
  const { 
    selectedDate, 
    setSelectedDate, 
    events, 
    currentView,
    getEventsForDate,
    deleteEvent,
  } = useCalendarStore();
  
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();
  
  const dayEvents = getEventsForDate(selectedDate);
  
  const markedDates = useMemo(() => {
    return generateMarkedDates(events, selectedDate);
  }, [events, selectedDate]);
  
  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(new Date(day.dateString));
  };
  
  const handleEventPress = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventForm(true);
  };
  
  const handleCreateEvent = () => {
    setSelectedEvent(undefined);
    setShowEventForm(true);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CalendarHeader />
      
      <View style={styles.calendarWrapper}>
        <Calendar
          current={format(selectedDate, 'yyyy-MM-dd')}
          onDayPress={handleDayPress}
          markedDates={markedDates}
          markingType="dot"
          theme={{
            backgroundColor: colors.background,
            calendarBackground: colors.background,
            textSectionTitleColor: colors.textSecondary,
            selectedDayBackgroundColor: colors.primary,
            selectedDayTextColor: '#FFFFFF',
            todayTextColor: colors.primary,
            dayTextColor: colors.text,
            textDisabledColor: colors.textSecondary,
            dotColor: colors.primary,
            arrowColor: colors.primary,
            monthTextColor: colors.text,
          }}
        />
      </View>
      
      <View style={styles.eventsSection}>
        <View style={styles.eventsHeader}>
          <Text style={[styles.eventsTitle, { color: colors.text }]}>
            {format(selectedDate, 'EEEE, MMMM d')}
          </Text>
          <IconButton
            icon={<Text style={{ fontSize: 24 }}>+</Text>}
            onPress={handleCreateEvent}
            size="small"
          />
        </View>
        
        {dayEvents.length > 0 ? (
          <FlatList
            data={dayEvents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EventItem
                event={item}
                onPress={handleEventPress}
              />
            )}
            contentContainerStyle={styles.eventsList}
          />
        ) : (
          <EmptyState
            title="No Events"
            description="No events scheduled for this day. Tap + to create one."
          />
        )}
      </View>
      
      <Modal
        visible={showEventForm}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEventForm(false)}
      >
        <EventForm
          event={selectedEvent}
          onClose={() => {
            setShowEventForm(false);
            setSelectedEvent(undefined);
          }}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarWrapper: {
    paddingHorizontal: SPACING.sm,
  },
  eventsSection: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  eventsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    marginTop: SPACING.md,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  eventsList: {
    paddingBottom: SPACING.xxl,
  },
});