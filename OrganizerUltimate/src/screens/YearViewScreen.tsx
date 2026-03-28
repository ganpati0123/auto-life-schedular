import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format, isToday, isTomorrow, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { useApp } from '../contexts/AppContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../utils/theme';

export function YearViewScreen({ navigation, route }: any) {
  const { state, setCurrentDate } = useApp();
  const { currentDate, events } = state;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getEventsForDay = (day: Date) => {
    return events.filter((e) => isSameDay(new Date(e.startTime), day));
  };

  const getMonthDays = (year: number, month: number) => {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    const calendarStart = startOfWeek(start);
    const calendarEnd = endOfWeek(end);
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  };

  const year = currentDate.getFullYear();

  const renderMonth = (monthIndex: number) => {
    const days = getMonthDays(year, monthIndex);
    
    return (
      <View key={monthIndex} style={styles.monthContainer}>
        <Text style={styles.monthTitle}>{months[monthIndex]}</Text>
        <View style={styles.weekDaysRow}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <Text key={i} style={styles.weekDayText}>{day}</Text>
          ))}
        </View>
        <View style={styles.daysGrid}>
          {days.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = day.getMonth() === monthIndex;
            
            return (
              <TouchableOpacity
                key={index}
                style={[styles.dayCell, !isCurrentMonth && styles.otherMonth]}
                onPress={() => {
                  setCurrentDate(day);
                  navigation.goBack();
                }}
              >
                <Text style={[styles.dayText, !isCurrentMonth && styles.otherMonthText]}>
                  {day.getDate()}
                </Text>
                {dayEvents.length > 0 && (
                  <View style={styles.eventDots}>
                    {dayEvents.slice(0, 3).map((event, i) => (
                      <View
                        key={i}
                        style={[styles.eventDot, { backgroundColor: event.color }]}
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
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{year}</Text>
          <View style={{ width: 60 }} />
        </View>
        <View style={styles.yearNavigation}>
          <TouchableOpacity 
            style={styles.yearNavButton}
            onPress={() => setCurrentDate(new Date(year - 1, currentDate.getMonth(), 1))}
          >
            <Text style={styles.yearNavText}>◀</Text>
          </TouchableOpacity>
          <Text style={styles.currentYear}>{year}</Text>
          <TouchableOpacity 
            style={styles.yearNavButton}
            onPress={() => setCurrentDate(new Date(year + 1, currentDate.getMonth(), 1))}
          >
            <Text style={styles.yearNavText}>▶</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {months.map((_, index) => renderMonth(index))}
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
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  yearNavigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  yearNavButton: {
    padding: SPACING.md,
  },
  yearNavText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
  },
  currentYear: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginHorizontal: SPACING.xl,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  monthContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  monthTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
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
  },
  otherMonth: {
    opacity: 0.4,
  },
  dayText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
  },
  otherMonthText: {
    color: COLORS.textMuted,
  },
  eventDots: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 2,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  bottomPadding: {
    height: 50,
  },
});