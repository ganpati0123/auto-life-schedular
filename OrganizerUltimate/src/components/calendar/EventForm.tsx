import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useCalendarStore } from '../../store';
import { Input, Button, Card } from '../common';
import { CalendarEvent } from '../../types';
import { SPACING, FONT_SIZES, COLORS, BORDER_RADIUS } from '../../constants';

interface EventFormProps {
  event?: CalendarEvent;
  onClose: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({ event, onClose }) => {
  const { colors } = useTheme();
  const { calendars, addEvent, updateEvent } = useCalendarStore();
  
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [location, setLocation] = useState(event?.location || '');
  const [allDay, setAllDay] = useState(event?.allDay || false);
  const [calendarId, setCalendarId] = useState(event?.calendarId || calendars[0]?.id || 'personal');
  const [meetingLink, setMeetingLink] = useState(event?.meetingLink || '');
  const [color, setColor] = useState(event?.color || COLORS.eventColors[0]);
  
  const handleSave = () => {
    if (!title.trim()) return;
    
    const eventData = {
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      startDate: event?.startDate || new Date(),
      endDate: event?.endDate || new Date(),
      allDay,
      color,
      calendarId,
      attendees: event?.attendees || [],
      reminders: event?.reminders || [],
      meetingLink: meetingLink.trim(),
      isOrganizer: true,
      status: 'confirmed' as const,
    };
    
    if (event) {
      updateEvent(event.id, eventData);
    } else {
      addEvent(eventData);
    }
    
    onClose();
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>
        {event ? 'Edit Event' : 'New Event'}
      </Text>
      
      <Input
        label="Title"
        value={title}
        onChangeText={setTitle}
        placeholder="Event title"
      />
      
      <Input
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Add description"
        multiline
        numberOfLines={3}
      />
      
      <Input
        label="Location"
        value={location}
        onChangeText={setLocation}
        placeholder="Add location"
      />
      
      <Input
        label="Meeting Link"
        value={meetingLink}
        onChangeText={setMeetingLink}
        placeholder="Zoom, Meet, Teams link"
      />
      
      <View style={styles.switchRow}>
        <Text style={[styles.label, { color: colors.text }]}>All Day</Text>
        <Switch
          value={allDay}
          onValueChange={setAllDay}
          trackColor={{ false: colors.divider, true: colors.primary }}
        />
      </View>
      
      <Text style={[styles.label, { color: colors.text }]}>Calendar</Text>
      <View style={styles.calendarSelector}>
        {calendars.map((cal) => (
          <TouchableOpacity
            key={cal.id}
            onPress={() => setCalendarId(cal.id)}
            style={[
              styles.calendarOption,
              { backgroundColor: calendarId === cal.id ? cal.color : colors.surface },
            ]}
          >
            <Text
              style={[
                styles.calendarText,
                { color: calendarId === cal.id ? '#FFFFFF' : colors.text },
              ]}
            >
              {cal.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={[styles.label, { color: colors.text }]}>Color</Text>
      <View style={styles.colorSelector}>
        {COLORS.eventColors.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setColor(c)}
            style={[
              styles.colorOption,
              { backgroundColor: c },
              color === c && styles.colorSelected,
            ]}
          />
        ))}
      </View>
      
      <View style={styles.buttons}>
        <Button title="Cancel" onPress={onClose} variant="outline" style={styles.button} />
        <Button title="Save" onPress={handleSave} variant="primary" style={styles.button} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
  },
  header: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '600',
    marginBottom: SPACING.lg,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  calendarSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  calendarOption: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  calendarText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  colorSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  buttons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  button: {
    flex: 1,
  },
});
