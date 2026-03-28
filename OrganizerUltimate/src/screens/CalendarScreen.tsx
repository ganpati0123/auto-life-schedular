import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  getHours,
  setHours,
  startOfDay,
} from 'date-fns';
import { useApp } from '../contexts/AppContext';
import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { EventList } from '../components/calendar/EventCard';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../utils/theme';

export function CalendarScreen({ navigation }: any) {
  const { state, setCurrentDate, setCalendarView, getEventsForDateRange } = useApp();
  const { calendarView, currentDate, events } = state;
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getEventsForSelectedDate = () => {
    const dayStart = startOfDay(selectedDate);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    return getEventsForDateRange(dayStart, dayEnd);
  };

  const getEventCountsForMonth = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    
    return days.map((day) => ({
      date: day,
      count: events.filter((e) => isSameDay(new Date(e.startTime), day)).length,
    }));
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    let newDate: Date;
    switch (calendarView) {
      case 'day':
        newDate = direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1);
        break;
      case 'week':
        newDate = direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1);
        break;
      case 'year':
        newDate = direction === 'prev' 
          ? new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1)
          : new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1);
        break;
      case 'month':
      default:
        newDate = direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);
  };

  const getWeekDays = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  };

  const getHoursArray = () => Array.from({ length: 24 }, (_, i) => i);

  const renderMonthView = () => (
    <View>
      <View style={styles.navigationRow}>
        <TouchableOpacity onPress={() => navigateDate('prev')} style={styles.navButton}>
          <Text style={styles.navButtonText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.monthYearText}>
          {format(currentDate, 'MMMM yyyy')}
        </Text>
        <TouchableOpacity onPress={() => navigateDate('next')} style={styles.navButton}>
          <Text style={styles.navButtonText}>▶</Text>
        </TouchableOpacity>
      </View>
      <CalendarGrid
        currentDate={currentDate}
        selectedDate={selectedDate}
        onSelectDate={handleDateSelect}
        events={getEventCountsForMonth()}
      />
    </View>
  );

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    
    return (
      <View>
        <View style={styles.navigationRow}>
          <TouchableOpacity onPress={() => navigateDate('prev')} style={styles.navButton}>
            <Text style={styles.navButtonText}>◀</Text>
          </TouchableOpacity>
          <Text style={styles.monthYearText}>
            {format(currentDate, 'MMMM yyyy')}
          </Text>
          <TouchableOpacity onPress={() => navigateDate('next')} style={styles.navButton}>
            <Text style={styles.navButtonText}>▶</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.weekHeader}>
          {weekDays.map((day) => (
            <TouchableOpacity
              key={day.toISOString()}
              style={[
                styles.weekDayCell,
                isSameDay(day, selectedDate) && styles.weekDayCellSelected,
                isToday(day) && styles.weekDayCellToday,
              ]}
              onPress={() => handleDateSelect(day)}
            >
              <Text style={styles.weekDayName}>{format(day, 'EEE')}</Text>
              <Text
                style={[
                  styles.weekDayNumber,
                  isToday(day) && styles.weekDayNumberToday,
                ]}
              >
                {format(day, 'd')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView style={styles.weekSchedule} showsVerticalScrollIndicator={false}>
          {getHoursArray().map((hour) => (
            <View key={hour} style={styles.hourRow}>
              <Text style={styles.hourText}>{format(setHours(new Date(), hour), 'h a')}</Text>
              <View style={styles.hourContent}>
                {weekDays
                  .filter((day) => {
                    const dayEvents = events.filter(
                      (e) =>
                        isSameDay(new Date(e.startTime), day) &&
                        getHours(new Date(e.startTime)) === hour
                    );
                    return dayEvents.length > 0;
                  })
                  .map((day) => {
                    const hourEvents = events.filter(
                      (e) =>
                        isSameDay(new Date(e.startTime), day) &&
                        getHours(new Date(e.startTime)) === hour
                    );
                    return (
                      <View key={day.toISOString()} style={styles.eventBlock}>
                        {hourEvents.map((event) => (
                          <TouchableOpacity
                            key={event.id}
                            style={[styles.eventPill, { backgroundColor: event.color }]}
                            onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
                          >
                            <Text style={styles.eventPillText} numberOfLines={1}>
                              {event.title}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    );
                  })}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForSelectedDate();
    const hours = getHoursArray();
    
    return (
      <View>
        <View style={styles.navigationRow}>
          <TouchableOpacity onPress={() => navigateDate('prev')} style={styles.navButton}>
            <Text style={styles.navButtonText}>◀</Text>
          </TouchableOpacity>
          <View style={styles.dayHeaderInfo}>
            <Text style={styles.dayHeaderDay}>{format(selectedDate, 'EEEE')}</Text>
            <Text style={styles.dayHeaderDate}>
              {format(selectedDate, 'MMMM d, yyyy')}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigateDate('next')} style={styles.navButton}>
            <Text style={styles.navButtonText}>▶</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.daySchedule} showsVerticalScrollIndicator={false}>
          {hours.map((hour) => {
            const hourEvents = dayEvents.filter(
              (e) => getHours(new Date(e.startTime)) === hour
            );
            
            return (
              <View key={hour} style={styles.dayHourRow}>
                <Text style={styles.dayHourText}>{format(setHours(new Date(), hour), 'h a')}</Text>
                <View style={styles.dayHourContent}>
                  {hourEvents.length > 0 ? (
                    hourEvents.map((event) => (
                      <TouchableOpacity
                        key={event.id}
                        style={[styles.dayEventBlock, { backgroundColor: event.color }]}
                        onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
                      >
                        <Text style={styles.dayEventTitle}>{event.title}</Text>
                        <Text style={styles.dayEventTime}>
                          {format(new Date(event.startTime), 'h:mm a')} - {format(new Date(event.endTime), 'h:mm a')}
                        </Text>
                        {event.location && (
                          <Text style={styles.dayEventLocation} numberOfLines={1}>
                            📍 {event.location}
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  ) : (
                    <TouchableOpacity
                      style={styles.addEventSlot}
                      onPress={() => navigation.navigate('CreateEvent', { date: selectedDate, hour })}
                    >
                      <Text style={styles.addEventSlotText}>+</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderAgendaView = () => (
    <View>
      <View style={styles.navigationRow}>
        <TouchableOpacity onPress={() => navigateDate('prev')} style={styles.navButton}>
          <Text style={styles.navButtonText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.monthYearText}>{format(currentDate, 'MMMM yyyy')}</Text>
        <TouchableOpacity onPress={() => navigateDate('next')} style={styles.navButton}>
          <Text style={styles.navButtonText}>▶</Text>
        </TouchableOpacity>
      </View>
      <EventList
        events={getEventsForSelectedDate()}
        onEventPress={(event) => navigation.navigate('EventDetail', { eventId: event.id })}
        emptyMessage="No events for this day"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Calendar</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('CreateEvent')}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.viewToggle}>
          {(['month', 'week', 'day', 'year', 'agenda'] as const).map((view) => (
            <TouchableOpacity
              key={view}
              style={[
                styles.viewToggleButton,
                calendarView === view && styles.viewToggleButtonActive,
              ]}
              onPress={() => view === 'year' ? navigation.navigate('YearView') : setCalendarView(view)}
            >
              <Text
                style={[
                  styles.viewToggleText,
                  calendarView === view && styles.viewToggleTextActive,
                ]}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {calendarView === 'month' && renderMonthView()}
        {calendarView === 'week' && renderWeekView()}
        {calendarView === 'day' && renderDayView()}
        {calendarView === 'agenda' && renderAgendaView()}
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
    paddingHorizontal: SPACING.md,
    borderBottomLeftRadius: BORDER_RADIUS.xxl,
    borderBottomRightRadius: BORDER_RADIUS.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: COLORS.text,
    fontWeight: '300',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: 4,
  },
  viewToggleButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
  },
  viewToggleButtonActive: {
    backgroundColor: COLORS.gradientStart,
  },
  viewToggleText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  viewToggleTextActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  navigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  navButton: {
    padding: SPACING.sm,
  },
  navButtonText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
  },
  monthYearText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  weekHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  weekDayCellSelected: {
    backgroundColor: COLORS.gradientStart,
  },
  weekDayCellToday: {
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  weekDayName: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  weekDayNumber: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  weekDayNumberToday: {
    color: COLORS.accent,
  },
  weekSchedule: {
    marginTop: SPACING.md,
    maxHeight: 400,
  },
  hourRow: {
    flexDirection: 'row',
    minHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  hourText: {
    width: 60,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    paddingTop: SPACING.xs,
  },
  hourContent: {
    flex: 1,
    flexDirection: 'row',
  },
  eventBlock: {
    flex: 1,
    padding: 2,
  },
  eventPill: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: 2,
  },
  eventPillText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
  },
  dayHeaderInfo: {
    alignItems: 'center',
  },
  dayHeaderDay: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  dayHeaderDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  daySchedule: {
    marginTop: SPACING.md,
  },
  dayHourRow: {
    flexDirection: 'row',
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  dayHourText: {
    width: 60,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    paddingTop: SPACING.sm,
  },
  dayHourContent: {
    flex: 1,
    padding: SPACING.xs,
  },
  dayEventBlock: {
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  dayEventTitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  dayEventTime: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  dayEventLocation: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  addEventSlot: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  addEventSlotText: {
    fontSize: 20,
    color: COLORS.textMuted,
  },
  bottomPadding: {
    height: 100,
  },
});