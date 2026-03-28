import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { useApp } from '../contexts/AppContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../utils/theme';

const { width } = Dimensions.get('window');

interface FocusBlock {
  startHour: number;
  endHour: number;
  type: 'deep_work' | 'meeting' | 'break' | 'admin';
}

export function FocusTimeScreen({ navigation }: any) {
  const { state } = useApp();
  const { events, settings } = state;

  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Get current week's days
  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Analyze events to find focus time patterns
  const analyzeFocusTime = (day: Date) => {
    const dayEvents = events.filter((e) => {
      const eventDate = new Date(e.startTime);
      return eventDate.toDateString() === day.toDateString();
    });

    const blocks: FocusBlock[] = [];
    
    // Morning block (9-12)
    const morningEvents = dayEvents.filter((e) => {
      const hour = new Date(e.startTime).getHours();
      return hour >= 9 && hour < 12;
    });
    
    if (morningEvents.length >= 3) {
      blocks.push({ startHour: 9, endHour: 12, type: 'meeting' });
    } else if (morningEvents.length > 0) {
      blocks.push({ startHour: 9, endHour: 12, type: 'mixed' });
    } else {
      blocks.push({ startHour: 9, endHour: 12, type: 'deep_work' });
    }

    // Afternoon block (1-5)
    const afternoonEvents = dayEvents.filter((e) => {
      const hour = new Date(e.startTime).getHours();
      return hour >= 13 && hour < 17;
    });

    if (afternoonEvents.length >= 3) {
      blocks.push({ startHour: 13, endHour: 17, type: 'meeting' });
    } else if (afternoonEvents.length > 0) {
      blocks.push({ startHour: 13, endHour: 17, type: 'mixed' });
    } else {
      blocks.push({ startHour: 13, endHour: 17, type: 'deep_work' });
    }

    return {
      totalMeetings: dayEvents.length,
      deepWorkHours: blocks.filter((b) => b.type === 'deep_work').length * 3,
      meetingHours: blocks.filter((b) => b.type === 'meeting').length * 3,
      score: calculateFocusScore(dayEvents),
      blocks,
    };
  };

  const calculateFocusScore = (dayEvents: typeof events) => {
    // Focus score based on meeting density
    const totalHours = 8; // Work day
    const meetingHours = dayEvents.reduce((acc, e) => {
      const start = new Date(e.startTime);
      const end = new Date(e.endTime);
      return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);

    const freeHours = totalHours - meetingHours;
    return Math.min(100, Math.round((freeHours / totalHours) * 100));
  };

  const getDayAnalysis = (day: Date) => analyzeFocusTime(day);

  const getScoreColor = (score: number) => {
    if (score >= 70) return COLORS.success;
    if (score >= 40) return COLORS.warning;
    return COLORS.error;
  };

  const getBlockColor = (type: string) => {
    switch (type) {
      case 'deep_work':
        return COLORS.success;
      case 'meeting':
        return COLORS.error;
      case 'break':
        return COLORS.warning;
      case 'mixed':
        return COLORS.info;
      default:
        return COLORS.textMuted;
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setSelectedDate(direction === 'prev' ? subDays(selectedDate, 7) : addDays(selectedDate, 7));
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
          <Text style={styles.headerTitle}>Focus Time</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.helpButton}>?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.weekSelector}>
          <TouchableOpacity style={styles.navButton} onPress={() => navigateWeek('prev')}>
            <Text style={styles.navText}>◀</Text>
          </TouchableOpacity>
          <Text style={styles.weekRange}>
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </Text>
          <TouchableOpacity style={styles.navButton} onPress={() => navigateWeek('next')}>
            <Text style={styles.navText}>▶</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Focus Score Overview */}
        <View style={styles.overviewSection}>
          <Text style={styles.sectionTitle}>Weekly Focus Overview</Text>
          <View style={styles.overviewCard}>
            {weekDays.map((day, index) => {
              const analysis = getDayAnalysis(day);
              const isToday = day.toDateString() === new Date().toDateString();
              
              return (
                <View key={index} style={styles.dayOverview}>
                  <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>
                    {format(day, 'EEE')}
                  </Text>
                  <View style={[styles.scoreCircle, { borderColor: getScoreColor(analysis.score) }]}>
                    <Text style={[styles.scoreValue, { color: getScoreColor(analysis.score) }]}>
                      {analysis.score}
                    </Text>
                  </View>
                  <Text style={styles.meetingCount}>
                    {analysis.totalMeetings} mtgs
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Focus Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Focus Recommendations</Text>
          
          {/* Best Focus Times */}
          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationTitle}>Best Focus Times This Week</Text>
            {weekDays.map((day, index) => {
              const analysis = getDayAnalysis(day);
              if (analysis.deepWorkHours >= 3) {
                return (
                  <View key={index} style={styles.recommendationItem}>
                    <View style={styles.recommendationDate}>
                      <Text style={styles.recommendationDayName}>{format(day, 'EEEE')}</Text>
                      <Text style={styles.recommendationDateText}>{format(day, 'MMM d')}</Text>
                    </View>
                    <View style={styles.recommendationDetails}>
                      <Text style={styles.recommendationText}>
                        {analysis.deepWorkHours} hours of deep work available
                      </Text>
                      <Text style={styles.recommendationHint}>
                        Best: {format(day, 'EEEE') === format(new Date(), 'EEEE') ? 'This afternoon' : 'Morning'}
                      </Text>
                    </View>
                  </View>
                );
              }
              return null;
            })}
          </View>

          {/* Tips */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Tips for Better Focus</Text>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>🕐</Text>
              <Text style={styles.tipText}>Block 2-3 hours daily for deep work</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>🎯</Text>
              <Text style={styles.tipText}>Schedule meetings in batches to create focus blocks</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>🚫</Text>
              <Text style={styles.tipText}>Use "Do Not Disturb" during focus time</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>⏰</Text>
              <Text style={styles.tipText}>Take breaks every 90 minutes for optimal focus</Text>
            </View>
          </View>
        </View>

        {/* Day-by-Day Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Schedule Analysis</Text>
          
          {weekDays.map((day, index) => {
            const analysis = getDayAnalysis(day);
            
            return (
              <View key={index} style={styles.scheduleCard}>
                <View style={styles.scheduleHeader}>
                  <View>
                    <Text style={styles.scheduleDay}>
                      {format(day, 'EEEE')}
                      {day.toDateString() === new Date().toDateString() && ' (Today)'}
                    </Text>
                    <Text style={styles.scheduleDate}>{format(day, 'MMMM d, yyyy')}</Text>
                  </View>
                  <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(analysis.score) + '30' }]}>
                    <Text style={[styles.scoreBadgeText, { color: getScoreColor(analysis.score) }]}>
                      {analysis.score}%
                    </Text>
                  </View>
                </View>

                <View style={styles.scheduleStats}>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{analysis.totalMeetings}</Text>
                    <Text style={styles.statLabel}>Meetings</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{analysis.meetingHours}h</Text>
                    <Text style={styles.statLabel}>In Meetings</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{analysis.deepWorkHours}h</Text>
                    <Text style={styles.statLabel}>Focus Time</Text>
                  </View>
                </View>

                <View style={styles.timeline}>
                  {analysis.blocks.map((block, blockIndex) => (
                    <View key={blockIndex} style={styles.timelineBlock}>
                      <Text style={styles.blockTime}>
                        {block.startHour}:00 - {block.endHour}:00
                      </Text>
                      <View style={[styles.blockBar, { backgroundColor: getBlockColor(block.type) }]}>
                        <Text style={styles.blockType}>
                          {block.type === 'deep_work' ? '🎯 Deep Work' : 
                           block.type === 'meeting' ? '📅 Meetings' : 
                           block.type === 'break' ? '☕ Break' : '📊 Mixed'}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
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
  helpButton: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  weekSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    padding: SPACING.sm,
  },
  navText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
  },
  weekRange: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  overviewSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  overviewCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  dayOverview: {
    alignItems: 'center',
    flex: 1,
  },
  dayLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  dayLabelToday: {
    color: COLORS.gradientStart,
    fontWeight: '600',
  },
  scoreCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  scoreValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
  },
  meetingCount: {
    fontSize: FONT_SIZES.xs - 2,
    color: COLORS.textMuted,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  recommendationCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  recommendationTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  recommendationDate: {
    width: 80,
  },
  recommendationDayName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  recommendationDateText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  recommendationDetails: {
    flex: 1,
  },
  recommendationText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  recommendationHint: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gradientStart,
    marginTop: 2,
  },
  tipsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  tipsTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  tipIcon: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  tipText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  scheduleCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  scheduleDay: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  scheduleDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  scoreBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  scoreBadgeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
  },
  scheduleStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  timeline: {
    marginTop: SPACING.sm,
  },
  timelineBlock: {
    marginBottom: SPACING.sm,
  },
  blockTime: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  blockBar: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  blockType: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 100,
  },
});