import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { useApp } from '../contexts/AppContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../utils/theme';

export function MeetingsScreen({ navigation }: any) {
  const { state } = useApp();
  const { events, aiMeetingInsights } = state;

  const onlineEvents = events.filter((e) => e.isOnline && e.meetingLink);
  const upcomingMeetings = onlineEvents
    .filter((e) => !isPast(new Date(e.endTime)))
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const todayMeetings = upcomingMeetings.filter((e) => isToday(new Date(e.startTime)));
  const tomorrowMeetings = upcomingMeetings.filter((e) => isTomorrow(new Date(e.startTime)));
  const laterMeetings = upcomingMeetings.filter(
    (e) => !isToday(new Date(e.startTime)) && !isTomorrow(new Date(e.startTime))
  );

  const renderMeetingCard = (event: any) => {
    const isLive = isToday(new Date(event.startTime)) && !isPast(new Date(event.startTime));
    const eventDate = new Date(event.startTime);
    
    return (
      <TouchableOpacity
        key={event.id}
        style={[styles.meetingCard, isLive && styles.meetingCardLive]}
        onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
      >
        <View style={styles.meetingHeader}>
          <View style={styles.meetingTime}>
            <Text style={styles.meetingTimeText}>
              {format(eventDate, 'h:mm a')}
            </Text>
            <Text style={styles.meetingDuration}>
              {Math.round((new Date(event.endTime).getTime() - new Date(event.startTime).getTime()) / 60000)} min
            </Text>
          </View>
          {isLive && (
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>● LIVE</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.meetingTitle}>{event.title}</Text>
        
        {event.description && (
          <Text style={styles.meetingDescription} numberOfLines={2}>
            {event.description}
          </Text>
        )}
        
        <View style={styles.meetingInfo}>
          <View style={styles.meetingInfoItem}>
            <Text style={styles.meetingInfoIcon}>📍</Text>
            <Text style={styles.meetingInfoText} numberOfLines={1}>
              {event.location || 'Online'}
            </Text>
          </View>
          {event.attendees.length > 0 && (
            <View style={styles.meetingInfoItem}>
              <Text style={styles.meetingInfoIcon}>👥</Text>
              <Text style={styles.meetingInfoText}>
                {event.attendees.length} attendees
              </Text>
            </View>
          )}
        </View>
        
        {event.meetingLink && (
          <View style={styles.meetingActions}>
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => {}}
            >
              <Text style={styles.joinButtonText}>Join Meeting</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderSection = (title: string, meetings: any[]) => {
    if (meetings.length === 0) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {meetings.map(renderMeetingCard)}
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
          <Text style={styles.headerTitle}>Meetings</Text>
          <TouchableOpacity
            style={styles.aiButton}
            onPress={() => navigation.navigate('AIAssistant')}
          >
            <Text style={styles.aiButtonText}>🤖 AI</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{todayMeetings.length}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{tomorrowMeetings.length}</Text>
            <Text style={styles.statLabel}>Tomorrow</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{aiMeetingInsights.length}</Text>
            <Text style={styles.statLabel}>AI Insights</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderSection('Today', todayMeetings)}
        {renderSection('Tomorrow', tomorrowMeetings)}
        {renderSection('Coming Up', laterMeetings)}
        
        {upcomingMeetings.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎥</Text>
            <Text style={styles.emptyTitle}>No upcoming meetings</Text>
            <Text style={styles.emptyDescription}>
              Your scheduled meetings with video links will appear here
            </Text>
          </View>
        )}

        {/* AI Meeting Intelligence Section */}
        {aiMeetingInsights.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meeting Intelligence</Text>
            {aiMeetingInsights.map((insight) => (
              <View key={insight.id} style={styles.insightCard}>
                <View style={styles.insightHeader}>
                  <Text style={styles.insightIcon}>💡</Text>
                  <Text style={styles.insightTitle}>AI Summary</Text>
                </View>
                <Text style={styles.insightSummary}>{insight.summary}</Text>
                
                {insight.actionItems.length > 0 && (
                  <View style={styles.actionItemsContainer}>
                    <Text style={styles.actionItemsTitle}>Action Items</Text>
                    {insight.actionItems.map((item) => (
                      <View key={item.id} style={styles.actionItem}>
                        <View style={[styles.actionItemDot, item.isCompleted && styles.actionItemDotCompleted]} />
                        <Text style={[styles.actionItemText, item.isCompleted && styles.actionItemTextCompleted]}>
                          {item.title}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

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
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
  },
  aiButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
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
  meetingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  meetingCardLive: {
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  meetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  meetingTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meetingTimeText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  meetingDuration: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  liveBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  liveBadgeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  meetingTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  meetingDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  meetingInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.sm,
  },
  meetingInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
    marginBottom: SPACING.xs,
  },
  meetingInfoIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  meetingInfoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  meetingActions: {
    marginTop: SPACING.sm,
  },
  joinButton: {
    backgroundColor: COLORS.success,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  insightCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  insightIcon: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  insightTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  insightSummary: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  actionItemsContainer: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceLight,
  },
  actionItemsTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  actionItemDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.warning,
    marginRight: SPACING.sm,
  },
  actionItemDotCompleted: {
    backgroundColor: COLORS.success,
  },
  actionItemText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },
  actionItemTextCompleted: {
    textDecorationLine: 'line-through',
  },
  bottomPadding: {
    height: 100,
  },
});