import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format, subDays, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { useApp } from '../contexts/AppContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../utils/theme';

const { width } = Dimensions.get('window');

interface ChartData {
  label: string;
  value: number;
  color: string;
}

export function AnalyticsDashboard({ navigation }: any) {
  const { state } = useApp();
  const { events, emails, calendars } = state;

  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  // Calculate stats
  const getEventStats = () => {
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case 'week':
        startDate = subDays(now, 7);
        break;
      case 'month':
        startDate = subMonths(now, 1);
        break;
      case 'year':
        startDate = subMonths(now, 12);
        break;
    }

    const filteredEvents = events.filter((e) => new Date(e.startTime) >= startDate);
    
    // Events by category
    const categoryCount: { [key: string]: number } = {};
    filteredEvents.forEach((e) => {
      categoryCount[e.category] = (categoryCount[e.category] || 0) + 1;
    });

    return {
      total: filteredEvents.length,
      categoryCount,
      byDay: getEventsByDay(filteredEvents, startDate, now),
    };
  };

  const getEventsByDay = (filteredEvents: typeof events, start: Date, end: Date) => {
    const days = eachDayOfInterval({ start, end });
    return days.map((day) => {
      const count = filteredEvents.filter(
        (e) => new Date(e.startTime).toDateString() === day.toDateString()
      ).length;
      return {
        date: day,
        count,
      };
    });
  };

  const getEmailStats = () => {
    const now = new Date();
    const lastWeek = subDays(now, 7);
    
    const filteredEmails = emails.filter((e) => new Date(e.date) >= lastWeek);
    
    return {
      total: filteredEmails.length,
      unread: filteredEmails.filter((e) => !e.isRead).length,
      starred: filteredEmails.filter((e) => e.isStarred).length,
      withAttachments: filteredEmails.filter((e) => e.hasAttachments).length,
    };
  };

  const stats = getEventStats();
  const emailStats = getEmailStats();

  const categoryColors: { [key: string]: string } = {
    meeting: COLORS.categoryMeeting,
    personal: COLORS.categoryPersonal,
    work: COLORS.categoryWork,
    health: COLORS.categoryHealth,
    other: COLORS.categoryOther,
  };

  const renderBarChart = (data: { date: Date; count: number }[]) => {
    const maxValue = Math.max(...data.map((d) => d.count), 1);
    
    return (
      <View style={styles.chartContainer}>
        <View style={styles.barChart}>
          {data.slice(-7).map((item, index) => (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${(item.count / maxValue) * 100}%`,
                      backgroundColor: COLORS.gradientStart,
                    },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>
                {format(item.date, 'EEE')}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderPieChart = (data: { [key: string]: number }) => {
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    const segments = Object.entries(data).map(([key, value]) => ({
      label: key,
      value,
      percentage: total > 0 ? (value / total) * 100 : 0,
      color: categoryColors[key] || COLORS.textMuted,
    }));

    return (
      <View style={styles.pieChartContainer}>
        <View style={styles.pieChartLegend}>
          {segments.map((segment, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: segment.color }]} />
              <Text style={styles.legendLabel}>
                {segment.label.charAt(0).toUpperCase() + segment.label.slice(1)}
              </Text>
              <Text style={styles.legendValue}>
                {segment.value} ({segment.percentage.toFixed(0)}%)
              </Text>
            </View>
          ))}
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
          <Text style={styles.headerTitle}>Analytics</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={styles.timeRangeSelector}>
          {(['week', 'month', 'year'] as const).map((range) => (
            <TouchableOpacity
              key={range}
              style={[styles.timeRangeButton, timeRange === range && styles.timeRangeButtonActive]}
              onPress={() => setTimeRange(range)}
            >
              <Text style={[styles.timeRangeText, timeRange === range && styles.timeRangeTextActive]}>
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{stats.total}</Text>
            <Text style={styles.summaryLabel}>Events</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{emailStats.total}</Text>
            <Text style={styles.summaryLabel}>Emails</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{emailStats.unread}</Text>
            <Text style={styles.summaryLabel}>Unread</Text>
          </View>
        </View>

        {/* Events Over Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Events Over Time</Text>
          {renderBarChart(stats.byDay)}
        </View>

        {/* Events by Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Events by Category</Text>
          <View style={styles.card}>
            {Object.keys(stats.categoryCount).length > 0 ? (
              renderPieChart(stats.categoryCount)
            ) : (
              <Text style={styles.emptyText}>No events in this period</Text>
            )}
          </View>
        </View>

        {/* Email Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email Performance</Text>
          <View style={styles.card}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{emailStats.total}</Text>
                <Text style={styles.statLabel}>Total Received</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{emailStats.unread}</Text>
                <Text style={styles.statLabel}>Unread</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{emailStats.starred}</Text>
                <Text style={styles.statLabel}>Starred</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{emailStats.withAttachments}</Text>
                <Text style={styles.statLabel}>With Attachments</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Calendar Usage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calendar Usage</Text>
          <View style={styles.card}>
            {calendars.map((calendar) => {
              const calendarEvents = events.filter((e) => e.calendarId === calendar.id);
              const percentage = stats.total > 0 ? (calendarEvents.length / stats.total) * 100 : 0;
              
              return (
                <View key={calendar.id} style={styles.calendarUsageItem}>
                  <View style={styles.calendarUsageHeader}>
                    <View style={[styles.calendarDot, { backgroundColor: calendar.color }]} />
                    <Text style={styles.calendarName}>{calendar.name}</Text>
                    <Text style={styles.calendarCount}>{calendarEvents.length} events</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${percentage}%`, backgroundColor: calendar.color },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Insights</Text>
          <View style={styles.insightsCard}>
            <View style={styles.insightItem}>
              <Text style={styles.insightIcon}>💡</Text>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Most Productive Day</Text>
                <Text style={styles.insightText}>
                  {stats.byDay.reduce((max, day) => day.count > max.count ? day : max, stats.byDay[0] || { date: new Date(), count: 0 })
                    ? format(stats.byDay.reduce((max, day) => day.count > max.count ? day : max, { date: new Date(), count: 0 }).date, 'EEEE')
                    : 'N/A'}
                </Text>
              </View>
            </View>
            <View style={styles.insightItem}>
              <Text style={styles.insightIcon}>📧</Text>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Email Response Rate</Text>
                <Text style={styles.insightText}>
                  {emailStats.total > 0 ? `${((emailStats.total - emailStats.unread) / emailStats.total * 100).toFixed(0)}% read` : 'N/A'}
                </Text>
              </View>
            </View>
            <View style={styles.insightItem}>
              <Text style={styles.insightIcon}>📅</Text>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Meeting Frequency</Text>
                <Text style={styles.insightText}>
                  {stats.total > 0 ? `${(stats.total / (timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365)).toFixed(1)} per day avg` : 'N/A'}
                </Text>
              </View>
            </View>
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
  timeRangeSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: 4,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
  },
  timeRangeButtonActive: {
    backgroundColor: COLORS.gradientStart,
  },
  timeRangeText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  timeRangeTextActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
    ...SHADOWS.small,
  },
  summaryValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  chartContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    height: 200,
    justifyContent: 'center',
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 150,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 120,
    width: 30,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  pieChartContainer: {
    padding: SPACING.sm,
  },
  pieChartLegend: {},
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: SPACING.sm,
  },
  legendLabel: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  legendValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.surfaceLight,
    marginVertical: SPACING.md,
  },
  calendarUsageItem: {
    marginBottom: SPACING.md,
  },
  calendarUsageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  calendarDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  calendarName: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  calendarCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  insightsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  insightIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  insightText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
    textAlign: 'center',
    padding: SPACING.lg,
  },
  bottomPadding: {
    height: 100,
  },
});