import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../utils/theme';

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  events: { date: Date; count: number }[];
}

export function CalendarGrid({
  currentDate,
  selectedDate,
  onSelectDate,
  events,
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getEventCountForDate = (date: Date): number => {
    const event = events.find((e) => isSameDay(e.date, date));
    return event?.count || 0;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={styles.container}>
      <View style={styles.weekDaysHeader}>
        {weekDays.map((dayName) => (
          <View key={dayName} style={styles.weekDayCell}>
            <Text style={styles.weekDayText}>{dayName}</Text>
          </View>
        ))}
      </View>
      <View style={styles.daysGrid}>
        {days.map((dayItem, index) => {
          const isCurrentMonth = isSameMonth(dayItem, monthStart);
          const isSelected = isSameDay(dayItem, selectedDate);
          const isTodayDate = isToday(dayItem);
          const eventCount = getEventCountForDate(dayItem);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                !isCurrentMonth && styles.dayCellOtherMonth,
                isSelected && styles.dayCellSelected,
                isTodayDate && !isSelected && styles.dayCellToday,
              ]}
              onPress={() => onSelectDate(dayItem)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dayText,
                  !isCurrentMonth && styles.dayTextOtherMonth,
                  isSelected && styles.dayTextSelected,
                  isTodayDate && !isSelected && styles.dayTextToday,
                ]}
              >
                {format(dayItem, 'd')}
              </Text>
              {eventCount > 0 && (
                <View style={styles.eventDots}>
                  {Array.from({ length: Math.min(eventCount, 3) }).map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.eventDot,
                        isSelected && styles.eventDotSelected,
                      ]}
                    />
                  ))}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  weekDaysHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  weekDayText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.round,
  },
  dayCellOtherMonth: {
    opacity: 0.4,
  },
  dayCellSelected: {
    backgroundColor: COLORS.gradientStart,
  },
  dayCellToday: {
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  dayText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  dayTextOtherMonth: {
    color: COLORS.textMuted,
  },
  dayTextSelected: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  dayTextToday: {
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  eventDots: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 4,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.gradientStart,
    marginHorizontal: 1,
  },
  eventDotSelected: {
    backgroundColor: COLORS.text,
  },
});