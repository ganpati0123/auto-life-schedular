import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Switch, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format, addHours, addDays } from 'date-fns';
import { useApp } from '../contexts/AppContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, REMINDER_OPTIONS } from '../utils/theme';
import { v4 as uuidv4 } from 'uuid';

export function CreateEventScreen({ navigation, route }: any) {
  const { state, addEvent, updateEvent, calendars } = useApp();
  const eventId = route.params?.eventId;
  const existingEvent = eventId ? state.events.find((e) => e.id === eventId) : null;
  const initialDate = route.params?.date ? new Date(route.params.date) : new Date();

  const [title, setTitle] = useState(existingEvent?.title || '');
  const [description, setDescription] = useState(existingEvent?.description || '');
  const [location, setLocation] = useState(existingEvent?.location || '');
  const [startDate, setStartDate] = useState(existingEvent ? new Date(existingEvent.startTime) : initialDate);
  const [endDate, setEndDate] = useState(existingEvent ? new Date(existingEvent.endTime) : addHours(initialDate, 1));
  const [isAllDay, setIsAllDay] = useState(existingEvent?.isAllDay || false);
  const [category, setCategory] = useState(existingEvent?.category || 'meeting');
  const [selectedCalendarId, setSelectedCalendarId] = useState(existingEvent?.calendarId || state.settings.defaultCalendarId);
  const [isOnline, setIsOnline] = useState(existingEvent?.isOnline || false);
  const [meetingLink, setMeetingLink] = useState(existingEvent?.meetingLink || '');
  const [recurrence, setRecurrence] = useState(existingEvent?.recurrence || 'none');
  const [selectedReminders, setSelectedReminders] = useState<number[]>(existingEvent?.reminders || [15]);

  const categories = [
    { id: 'meeting', name: 'Meeting', icon: '👥', color: COLORS.categoryMeeting },
    { id: 'personal', name: 'Personal', icon: '🏠', color: COLORS.categoryPersonal },
    { id: 'work', name: 'Work', icon: '💼', color: COLORS.categoryWork },
    { id: 'health', name: 'Health', icon: '🏥', color: COLORS.categoryHealth },
    { id: 'other', name: 'Other', icon: '📅', color: COLORS.categoryOther },
  ];

  const recurrenceOptions = [
    { id: 'none', name: 'Does not repeat' },
    { id: 'daily', name: 'Daily' },
    { id: 'weekly', name: 'Weekly' },
    { id: 'monthly', name: 'Monthly' },
    { id: 'yearly', name: 'Yearly' },
  ];

  const toggleReminder = (minutes: number) => {
    if (selectedReminders.includes(minutes)) {
      setSelectedReminders(selectedReminders.filter((r) => r !== minutes));
    } else {
      setSelectedReminders([...selectedReminders, minutes]);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an event title');
      return;
    }

    const selectedCalendar = calendars.find((c) => c.id === selectedCalendarId);
    
    const event = {
      id: existingEvent?.id || uuidv4(),
      calendarId: selectedCalendarId,
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      startTime: startDate,
      endTime: endDate,
      isAllDay,
      category: category as any,
      color: selectedCalendar?.color || COLORS.gradientStart,
      recurrence: recurrence as any,
      reminders: selectedReminders,
      attendees: existingEvent?.attendees || [],
      isOnline,
      meetingLink: isOnline ? meetingLink : undefined,
    };

    if (existingEvent) {
      updateEvent(event);
    } else {
      addEvent(event);
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{existingEvent ? 'Edit Event' : 'New Event'}</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.titleInput}
            placeholder="Event title"
            placeholderTextColor={COLORS.textMuted}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Calendar Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calendar</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {calendars.map((calendar) => (
              <TouchableOpacity
                key={calendar.id}
                style={[
                  styles.calendarOption,
                  selectedCalendarId === calendar.id && styles.calendarOptionSelected,
                ]}
                onPress={() => setSelectedCalendarId(calendar.id)}
              >
                <View style={[styles.calendarColorDot, { backgroundColor: calendar.color }]} />
                <Text style={[
                  styles.calendarOptionText,
                  selectedCalendarId === calendar.id && styles.calendarOptionTextSelected,
                ]}>
                  {calendar.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryOption,
                  category === cat.id && { backgroundColor: cat.color },
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={[
                  styles.categoryText,
                  category === cat.id && styles.categoryTextSelected,
                ]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date & Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date & Time</Text>
          <View style={styles.card}>
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>All day</Text>
              <Switch
                value={isAllDay}
                onValueChange={setIsAllDay}
                trackColor={{ false: COLORS.surfaceLight, true: COLORS.gradientStart }}
                thumbColor={COLORS.text}
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>Start</Text>
              <Text style={styles.timeValue}>{format(startDate, 'EEE, MMM d, yyyy h:mm a')}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>End</Text>
              <Text style={styles.timeValue}>{format(endDate, 'EEE, MMM d, yyyy h:mm a')}</Text>
            </View>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Add location"
              placeholderTextColor={COLORS.textMuted}
              value={location}
              onChangeText={setLocation}
            />
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.toggleRow}
              onPress={() => setIsOnline(!isOnline)}
            >
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleIcon}>🎥</Text>
                <Text style={styles.toggleLabel}>Video meeting</Text>
              </View>
              <Switch
                value={isOnline}
                onValueChange={setIsOnline}
                trackColor={{ false: COLORS.surfaceLight, true: COLORS.gradientStart }}
                thumbColor={COLORS.text}
              />
            </TouchableOpacity>
            
            {isOnline && (
              <>
                <View style={styles.divider} />
                <TextInput
                  style={styles.input}
                  placeholder="Meeting link (Zoom, Meet, etc.)"
                  placeholderTextColor={COLORS.textMuted}
                  value={meetingLink}
                  onChangeText={setMeetingLink}
                  autoCapitalize="none"
                />
              </>
            )}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <View style={styles.card}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add description"
              placeholderTextColor={COLORS.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Recurrence */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Repeat</Text>
          <View style={styles.card}>
            {recurrenceOptions.map((option, index) => (
              <React.Fragment key={option.id}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setRecurrence(option.id)}
                >
                  <View style={[
                    styles.radioCircle,
                    recurrence === option.id && styles.radioCircleSelected,
                  ]}>
                    {recurrence === option.id && <View style={styles.radioDot} />}
                  </View>
                  <Text style={[
                    styles.radioLabel,
                    recurrence === option.id && styles.radioLabelSelected,
                  ]}>{option.name}</Text>
                </TouchableOpacity>
                {index < recurrenceOptions.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Reminders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminders</Text>
          <View style={styles.card}>
            {REMINDER_OPTIONS.map((option, index) => (
              <React.Fragment key={option.value}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => toggleReminder(option.value)}
                >
                  <View style={[
                    styles.checkbox,
                    selectedReminders.includes(option.value) && styles.checkboxSelected,
                  ]}>
                    {selectedReminders.includes(option.value) && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.radioLabel}>{option.label}</Text>
                </TouchableOpacity>
                {index < REMINDER_OPTIONS.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: BORDER_RADIUS.xxl,
    borderBottomRightRadius: BORDER_RADIUS.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  saveButton: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gradientStart,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  titleInput: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    fontSize: FONT_SIZES.xl,
    color: COLORS.text,
    fontWeight: '600',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  calendarOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    marginRight: SPACING.sm,
  },
  calendarOptionSelected: {
    backgroundColor: COLORS.surfaceLight,
  },
  calendarColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.xs,
  },
  calendarOptionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  calendarOptionTextSelected: {
    color: COLORS.text,
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryOption: {
    width: '30%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  categoryText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  categoryTextSelected: {
    color: COLORS.text,
    fontWeight: '600',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  timeLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  timeValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  input: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    paddingVertical: SPACING.sm,
  },
  textArea: {
    minHeight: 100,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleIcon: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  toggleLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.surfaceLight,
    marginVertical: SPACING.xs,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  radioCircleSelected: {
    borderColor: COLORS.gradientStart,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.gradientStart,
  },
  radioLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  radioLabelSelected: {
    color: COLORS.text,
    fontWeight: '500',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  checkboxSelected: {
    backgroundColor: COLORS.gradientStart,
    borderColor: COLORS.gradientStart,
  },
  checkmark: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 100,
  },
});