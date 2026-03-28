import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format, addDays, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { useApp } from '../contexts/AppContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../utils/theme';

interface AgendaEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  calendarColor: string;
  isAllDay: boolean;
  location?: string;
}

interface DayAgenda {
  date: Date;
  events: AgendaEvent[];
}

export function AgendaViewScreen({ navigation, route }: any) {
  const { state } = useApp();
  const { events, calendars } = state;
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));
  const [showAllDay, setShowAllDay] = useState(true);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const getEventsForDate = (date: Date): AgendaEvent[] => {
    return events
      .filter((event) => {
        const eventDate = new Date(event.startTime);
        return eventDate.toDateString() === date.toDateString();
      })
      .map((event) => ({
        id: event.id,
        title: event.title,
        startTime: new Date(event.startTime),
        endTime: new Date(event.endTime),
        calendarColor: calendars.find((c) => c.id === event.calendarId)?.color || COLORS.gradientStart,
        isAllDay: event.isAllDay,
        location: event.location,
      }))
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  };

  const renderTimeSlot = (hour: number) => {
    return (
      <View key={hour} style={styles.timeSlot}>
        <Text style={styles.timeLabel}>
          {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
        </Text>
        <View style={styles.timeSlotLine} />
      </View>
    );
  };

  const renderEvent = (event: AgendaEvent, day: Date) => {
    const startHour = event.startTime.getHours();
    const startMinute = event.startTime.getMinutes();
    const duration = (event.endTime.getTime() - event.startTime.getTime()) / (1000 * 60);
    const height = Math.max((duration / 60) * 50, 30);

    return (
      <TouchableOpacity
        key={event.id}
        style={[
          styles.eventBlock,
          {
            backgroundColor: event.calendarColor,
            height: event.isAllDay ? 30 : height,
          },
        ]}
        onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
      >
        <Text style={styles.eventTitle} numberOfLines={1}>
          {event.title}
        </Text>
        {!event.isAllDay && (
          <Text style={styles.eventTime}>
            {format(event.startTime, 'h:mm a')} - {format(event.endTime, 'h:mm a')}
          </Text>
        )}
        {event.location && (
          <Text style={styles.eventLocation} numberOfLines={1}>
            📍 {event.location}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeekStart(direction === 'prev' ? subDays(currentWeekStart, 7) : addDays(currentWeekStart, 7));
  };

  const isToday = (date: Date) => date.toDateString() === new Date().toDateString();

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
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agenda View</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Week Navigation */}
        <View style={styles.weekNavigation}>
          <TouchableOpacity style={styles.navButton} onPress={() => navigateWeek('prev')}>
            <Text style={styles.navButtonText}>◀</Text>
          </TouchableOpacity>
          <View style={styles.weekInfo}>
            <Text style={styles.weekRange}>
              {format(currentWeekStart, 'MMM d')} - {format(endOfWeek(currentWeekStart), 'MMM d, yyyy')}
            </Text>
          </View>
          <TouchableOpacity style={styles.navButton} onPress={() => navigateWeek('next')}>
            <Text style={styles.navButtonText}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Week Days */}
        <View style={styles.weekDays}>
          {weekDays.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.dayCell, isToday(day) && styles.dayCellToday]}
              onPress={() => {}}
            >
              <Text style={[styles.dayName, isToday(day) && styles.dayNameToday]}>
                {format(day, 'EEE')}
              </Text>
              <Text style={[styles.dayNumber, isToday(day) && styles.dayNumberToday]}>
                {format(day, 'd')}
              </Text>
              {getEventsForDate(day).length > 0 && (
                <View style={styles.eventIndicator}>
                  <Text style={styles.eventIndicatorText}>
                    {getEventsForDate(day).length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings Toggle */}
        <View style={styles.settingsRow}>
          <Text style={styles.settingsLabel}>Show all-day events</Text>
          <Switch
            value={showAllDay}
            onValueChange={setShowAllDay}
            trackColor={{ false: COLORS.surfaceLight, true: COLORS.gradientStart }}
            thumbColor={COLORS.text}
          />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Timeline View */}
        <View style={styles.timeline}>
          {weekDays.map((day, dayIndex) => {
            const dayEvents = getEventsForDate(day);
            
            return (
              <View key={dayIndex} style={styles.dayColumn}>
                {/* Day Header */}
                <View style={[styles.dayHeader, isToday(day) && styles.dayHeaderToday]}>
                  <Text style={[styles.dayHeaderText, isToday(day) && styles.dayHeaderTextToday]}>
                    {format(day, 'EEE d')}
                  </Text>
                </View>

                {/* Day Events */}
                <View style={styles.dayEvents}>
                  {/* All-day events */}
                  {showAllDay &&
                    dayEvents
                      .filter((e) => e.isAllDay)
                      .map((event) => (
                        <View
                          key={event.id}
                          style={[styles.allDayEvent, { backgroundColor: event.calendarColor }]}
                        >
                          <Text style={styles.allDayEventText} numberOfLines={1}>
                            {event.title}
                          </Text>
                        </View>
                      ))}

                  {/* Timed events */}
                  {dayEvents
                    .filter((e) => !e.isAllDay)
                      .map((event) => renderEvent(event, day))}
                    
                  {dayEvents.length === 0 && (
                    <View style={styles.noEvents}>
                      <Text style={styles.noEventsText}>No events</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Day-by-Day Breakdown */}
        <View style={styles.breakdownSection}>
          <Text style={styles.sectionTitle}>Day-by-Day Breakdown</Text>
          
          {weekDays.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const totalHours = dayEvents.reduce((acc, event) => {
              if (!event.isAllDay) {
                const duration = (event.endTime.getTime() - event.startTime.getTime()) / (1000 * 60 * 60);
                return acc + duration;
              }
              return acc;
            }, 0);

            return (
              <View key={index} style={styles.breakdownCard}>
                <View style={styles.breakdownHeader}>
                  <View style={[styles.breakdownDate, isToday(day) && styles.breakdownDateToday]}>
                    <Text style={[styles.breakdownDayName, isToday(day) && styles.breakdownDayNameToday]}>
                      {format(day, 'EEE')}
                    </Text>
                    <Text style={[styles.breakdownDayNumber, isToday(day) && styles.breakdownDayNumberToday]}>
                      {format(day, 'd')}
                    </Text>
                  </View>
                  <View style={styles.breakdownStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{dayEvents.length}</Text>
                      <Text style={styles.statLabel}>events</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{totalHours.toFixed(1)}h</Text>
                      <Text style={styles.statLabel}>total</Text>
                    </View>
                  </View>
                </View>

                {dayEvents.length > 0 && (
                  <View style={styles.breakdownEvents}>
                    {dayEvents.map((event) => (
                      <View key={event.id} style={styles.breakdownEventItem}>
                        <View style={[styles.eventColorDot, { backgroundColor: event.calendarColor }]} />
                        <View style={styles.breakdownEventInfo}>
                          <Text style={styles.breakdownEventTitle}>{event.title}</Text>
                          <Text style={styles.breakdownEventTime}>
                            {event.isAllDay
                              ? 'All day'
                              : `${format(event.startTime, 'h:mm a')} - ${format(event.endTime, 'h:mm a')}`}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
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
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: BORDER_RADIUS.xxl,
    borderBottomRightRadius: BORDER_RADIUS.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  backButton: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  navButton: {
    padding: SPACING.sm,
  },
  navButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  weekInfo: {
    alignItems: 'center',
  },
  weekRange: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  dayCell: {
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  dayCellToday: {
    backgroundColor: COLORS.gradientStart,
  },
  dayName: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  dayNameToday: {
    color: COLORS.text,
  },
  dayNumber: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  dayNumberToday: {
    color: COLORS.text,
  },
  eventIndicator: {
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
  },
  eventIndicatorText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  timeline: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  dayColumn: {
    flex: 1,
    marginHorizontal: 2,
  },
  dayHeader: {
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
    marginBottom: SPACING.xs,
  },
  dayHeaderToday: {
    backgroundColor: COLORS.gradientStart,
    borderRadius: BORDER_RADIUS.sm,
    borderBottomWidth: 0,
  },
  dayHeaderText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  dayHeaderTextToday: {
    color: COLORS.text,
    fontWeight: '600',
  },
  dayEvents: {
    minHeight: 300,
  },
  allDayEvent: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  allDayEventText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
  },
  eventBlock: {
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  eventTitle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
    fontWeight: '600',
  },
  eventTime: {
    fontSize: FONT_SIZES.xs - 2,
    color: COLORS.textSecondary,
  },
  eventLocation: {
    fontSize: FONT_SIZES.xs - 2,
    color: COLORS.textMuted,
  },
  noEvents: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  noEventsText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  timeSlot: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'flex-start',
  },
  timeLabel: {
    width: 50,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  timeSlotLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.surfaceLight,
  },
  breakdownSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  breakdownCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  breakdownDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownDateToday: {
    backgroundColor: COLORS.gradientStart,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  breakdownDayName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginRight: SPACING.sm,
  },
  breakdownDayNameToday: {
    color: COLORS.text,
    fontWeight: '600',
  },
  breakdownDayNumber: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  breakdownDayNumberToday: {
    color: COLORS.text,
  },
  breakdownStats: {
    flexDirection: 'row',
  },
  statItem: {
    alignItems: 'center',
    marginLeft: SPACING.lg,
  },
  statValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  breakdownEvents: {
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceLight,
    paddingTop: SPACING.sm,
  },
  breakdownEventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  eventColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  breakdownEventInfo: {
    flex: 1,
  },
  breakdownEventTitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
  },
  breakdownEventTime: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  bottomPadding: {
    height: 100,
  },
});