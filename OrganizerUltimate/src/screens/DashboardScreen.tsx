import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format, isToday, isTomorrow } from 'date-fns';
import { useApp } from '../../contexts/AppContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../utils/theme';

export function DashboardScreen({ navigation }: any) {
  const { state } = useApp();
  const { events, emails, aiMeetingInsights, aiScheduleSuggestions, settings } = state;

  const todayEvents = events.filter((e) => isToday(new Date(e.startTime)));
  const unreadEmails = emails.filter((e) => !e.isRead && e.folder === 'inbox');
  const upcomingInsights = aiMeetingInsights.slice(0, 2);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatNextEvent = () => {
    const now = new Date();
    const nextEvent = events
      .filter((e) => new Date(e.startTime) > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];
    
    if (nextEvent) {
      const eventDate = new Date(nextEvent.startTime);
      if (isToday(eventDate)) {
        return `Today at ${format(eventDate, 'h:mm a')}`;
      } else if (isTomorrow(eventDate)) {
        return `Tomorrow at ${format(eventDate, 'h:mm a')}`;
      }
      return format(eventDate, 'MMM d at h:mm a');
    }
    return 'No upcoming events';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>John Doe</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* AI Summary Card */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.aiCard}
          onPress={() => navigation.navigate('AIAssistant')}
        >
          <LinearGradient
            colors={[COLORS.gradientStart + '40', COLORS.gradientEnd + '40']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.aiCardGradient}
          >
            <View style={styles.aiHeader}>
              <Text style={styles.aiIcon}>🤖</Text>
              <View>
                <Text style={styles.aiTitle}>AI Executive Assistant</Text>
                <Text style={styles.aiSubtitle}>Your intelligent helper</Text>
              </View>
            </View>
            <Text style={styles.aiSummary}>
              {formatNextEvent()} • {unreadEmails.length} unread emails
            </Text>
            {settings.aiEnabled && (
              <View style={styles.aiStatus}>
                <Text style={styles.aiStatusText}>● AI Active</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.section}>
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('Calendar')}
          >
            <Text style={styles.statIcon}>📅</Text>
            <Text style={styles.statValue}>{todayEvents.length}</Text>
            <Text style={styles.statLabel}>Today's Events</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('Email')}
          >
            <Text style={styles.statIcon}>📧</Text>
            <Text style={styles.statValue}>{unreadEmails.length}</Text>
            <Text style={styles.statLabel}>Unread Emails</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('Meetings')}
          >
            <Text style={styles.statIcon}>🎥</Text>
            <Text style={styles.statValue}>
              {events.filter((e) => e.isOnline).length}
            </Text>
            <Text style={styles.statLabel}>Online Mtgs</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Upcoming Events */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {todayEvents.slice(0, 3).map((event) => (
          <TouchableOpacity
            key={event.id}
            style={[styles.eventCard, { borderLeftColor: event.color }]}
            onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
          >
            <View style={styles.eventTime}>
              <Text style={styles.eventTimeText}>
                {format(new Date(event.startTime), 'h:mm a')}
              </Text>
            </View>
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventLocation} numberOfLines={1}>
                {event.location || event.meetingLink || 'No location'}
              </Text>
            </View>
            {event.isOnline && (
              <View style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
        {todayEvents.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No events today</Text>
          </View>
        )}
      </View>

      {/* Priority Emails */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Priority Emails</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Email')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {unreadEmails.filter((e) => e.isPriority).slice(0, 3).map((email) => (
          <TouchableOpacity
            key={email.id}
            style={styles.emailCard}
            onPress={() => {
              navigation.navigate('EmailDetail', { emailId: email.id });
            }}
          >
            <View style={styles.emailAvatar}>
              <Text style={styles.emailAvatarText}>
                {email.from.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.emailContent}>
              <Text style={styles.emailSender}>{email.from.name}</Text>
              <Text style={styles.emailSubject} numberOfLines={1}>
                {email.subject}
              </Text>
            </View>
            <Text style={styles.priorityBadge}>⚡</Text>
          </TouchableOpacity>
        ))}
        {unreadEmails.filter((e) => e.isPriority).length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No priority emails</Text>
          </View>
        )}
      </View>

      {/* AI Insights */}
      {settings.aiEnabled && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AI Insights</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          {upcomingInsights.map((insight) => (
            <View key={insight.id} style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Text style={styles.insightIcon}>💡</Text>
                <Text style={styles.insightTitle}>Meeting Summary</Text>
              </View>
              <Text style={styles.insightSummary} numberOfLines={2}>
                {insight.summary}
              </Text>
              {insight.actionItems.length > 0 && (
                <View style={styles.actionItems}>
                  <Text style={styles.actionItemsTitle}>
                    {insight.actionItems.length} action items
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* AI Schedule Suggestions */}
      {settings.aiEnabled && aiScheduleSuggestions.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Smart Suggestions</Text>
          </View>
          {aiScheduleSuggestions.map((suggestion) => (
            <TouchableOpacity key={suggestion.id} style={styles.suggestionCard}>
              <View style={styles.suggestionHeader}>
                <Text style={styles.suggestionIcon}>✨</Text>
                <View>
                  <Text style={styles.suggestionTime}>
                    {format(new Date(suggestion.suggestedTime), 'EEE, MMM d • h:mm a')}
                  </Text>
                  <Text style={styles.suggestionDuration}>
                    {suggestion.duration} min • {Math.round(suggestion.confidence * 100)}% match
                  </Text>
                </View>
              </View>
              <Text style={styles.suggestionReason}>{suggestion.reason}</Text>
              <View style={styles.suggestionActions}>
                <TouchableOpacity style={styles.acceptButton}>
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dismissButton}>
                  <Text style={styles.dismissButtonText}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Bottom Padding */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: BORDER_RADIUS.xxl,
    borderBottomRightRadius: BORDER_RADIUS.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  userName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 4,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    fontSize: 24,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  aiCard: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  aiCardGradient: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  aiIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  aiTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  aiSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  aiSummary: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  aiStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiStatusText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.success,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
    ...SHADOWS.small,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  seeAll: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gradientStart,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
  },
  eventTime: {
    marginRight: SPACING.md,
  },
  eventTimeText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  eventLocation: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  joinButton: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  joinButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
  emailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emailAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gradientStart,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  emailAvatarText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  emailContent: {
    flex: 1,
  },
  emailSender: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  emailSubject: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  priorityBadge: {
    fontSize: 18,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  insightCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
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
  actionItems: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceLight,
  },
  actionItemsTitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gradientStart,
    fontWeight: '500',
  },
  suggestionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  suggestionIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  suggestionTime: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  suggestionDuration: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  suggestionReason: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  suggestionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  acceptButton: {
    backgroundColor: COLORS.gradientStart,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginLeft: SPACING.sm,
  },
  acceptButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
  dismissButton: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  dismissButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  bottomPadding: {
    height: 100,
  },
});