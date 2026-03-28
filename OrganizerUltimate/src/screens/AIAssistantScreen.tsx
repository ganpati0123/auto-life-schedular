import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format, addHours } from 'date-fns';
import { useApp } from '../contexts/AppContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../utils/theme';
import { v4 as uuidv4 } from 'uuid';

export function AIAssistantScreen({ navigation }: any) {
  const { state, addEvent, addAIMeetingInsight } = useApp();
  const { events, emails, aiScheduleSuggestions, settings } = state;
  
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleAIQuery = async () => {
    if (!query.trim() || isProcessing) return;
    
    setIsProcessing(true);
    setResponse(null);

    // Simulate AI processing
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      let aiResponse = '';
      let action: string | null = null;

      if (lowerQuery.includes('schedule') || lowerQuery.includes('meeting') || lowerQuery.includes('book')) {
        aiResponse = "I'd be happy to help you schedule a meeting! Based on your calendar, here are some optimal times:\n\n• Today at 3:00 PM (60 min) - Best availability\n• Tomorrow at 10:00 AM (30 min) - Before standup\n• Tomorrow at 2:00 PM (60 min) - Post-lunch slot\n\nWould you like me to create an event for any of these times?";
        action = 'suggest_times';
      } else if (lowerQuery.includes('email') || lowerQuery.includes('inbox')) {
        const unreadCount = emails.filter((e) => !e.isRead && e.folder === 'inbox').length;
        const priorityCount = emails.filter((e) => e.isPriority && !e.isRead).length;
        aiResponse = `Here's your email summary:\n\n📧 ${unreadCount} unread emails\n⚡ ${priorityCount} priority emails\n\nYour top priority emails are from:\n${emails.filter((e) => e.isPriority && !e.isRead).slice(0, 3).map((e) => `• ${e.from.name}: ${e.subject}`).join('\n')}\n\nWould you like me to help draft a reply or prioritize your inbox?`;
      } else if (lowerQuery.includes('summarize') || lowerQuery.includes('summary')) {
        const todayEvents = events.filter((e) => {
          const eventDate = new Date(e.startTime);
          const today = new Date();
          return eventDate.toDateString() === today.toDateString();
        });
        aiResponse = `📋 Daily Briefing for ${format(new Date(), 'EEEE, MMMM d')}\n\n📅 ${todayEvents.length} events scheduled\n\n${todayEvents.map((e, i) => `${i + 1}. ${format(new Date(e.startTime), 'h:mm a')} - ${e.title}`).join('\n')}\n\n💡 Tip: You have back-to-back meetings at 2 PM. Consider blocking 30 min buffer time.`;
      } else if (lowerQuery.includes('task') || lowerQuery.includes('todo') || lowerQuery.includes('action')) {
        const allActionItems = state.aiMeetingInsights.flatMap((i) => i.actionItems);
        const pendingItems = allActionItems.filter((a) => !a.isCompleted);
        aiResponse = `📝 Your Action Items (${pendingItems.length} pending):\n\n${pendingItems.length > 0 ? pendingItems.map((item, i) => `${i + 1}. ${item.title}${item.assignee ? ` (${item.assignee})` : ''}${item.dueDate ? ` - Due ${format(new Date(item.dueDate), 'MMM d')}` : ''}`).join('\n') : 'No pending tasks'}\n\nWould you like me to help you complete any of these?`;
      } else {
        aiResponse = "I'm your AI Executive Assistant. I can help you with:\n\n📅 Scheduling - 'Schedule a meeting tomorrow'\n📧 Email - 'Summarize my inbox' or 'Draft a reply'\n📋 Tasks - 'Show my action items'\n💡 Insights - 'Give me my daily briefing'\n\nWhat would you like help with?";
      }

      setResponse(aiResponse);
      setIsProcessing(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'schedule':
        setQuery('Schedule a meeting');
        break;
      case 'email':
        setQuery('Summarize my inbox');
        break;
      case 'briefing':
        setQuery('Give me my daily briefing');
        break;
      case 'tasks':
        setQuery('Show my action items');
        break;
    }
  };

  if (!settings.aiEnabled) {
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
            <Text style={styles.headerTitle}>AI Assistant</Text>
            <View style={{ width: 60 }} />
          </View>
        </LinearGradient>
        <View style={styles.disabledContainer}>
          <Text style={styles.disabledIcon}>🤖</Text>
          <Text style={styles.disabledTitle}>AI Assistant Disabled</Text>
          <Text style={styles.disabledDescription}>
            Enable AI Assistant in Settings to unlock intelligent scheduling, email management, and more.
          </Text>
          <TouchableOpacity
            style={styles.enableButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.enableButtonText}>Go to Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
          <Text style={styles.headerTitle}>AI Assistant</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={styles.aiStatus}>
          <Text style={styles.aiStatusIcon}>🤖</Text>
          <View>
            <Text style={styles.aiStatusTitle}>Executive Assistant</Text>
            <Text style={styles.aiStatusSubtitle}>Ready to help</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('schedule')}
            >
              <Text style={styles.quickActionIcon}>📅</Text>
              <Text style={styles.quickActionText}>Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('email')}
            >
              <Text style={styles.quickActionIcon}>📧</Text>
              <Text style={styles.quickActionText}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('briefing')}
            >
              <Text style={styles.quickActionIcon}>📋</Text>
              <Text style={styles.quickActionText}>Briefing</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('tasks')}
            >
              <Text style={styles.quickActionIcon}>✅</Text>
              <Text style={styles.quickActionText}>Tasks</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ask AI</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask anything... (e.g., 'Schedule a meeting tomorrow')"
              placeholderTextColor={COLORS.textMuted}
              value={query}
              onChangeText={setQuery}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, (!query.trim() || isProcessing) && styles.sendButtonDisabled]}
              onPress={handleAIQuery}
              disabled={!query.trim() || isProcessing}
            >
              <Text style={styles.sendButtonText}>
                {isProcessing ? '⏳' : '➤'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Response */}
        {response && (
          <View style={styles.section}>
            <View style={styles.responseContainer}>
              <View style={styles.responseHeader}>
                <Text style={styles.responseIcon}>💡</Text>
                <Text style={styles.responseTitle}>AI Response</Text>
              </View>
              <Text style={styles.responseText}>{response}</Text>
            </View>
          </View>
        )}

        {/* Schedule Suggestions */}
        {aiScheduleSuggestions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Smart Suggestions</Text>
            {aiScheduleSuggestions.map((suggestion) => (
              <TouchableOpacity key={suggestion.id} style={styles.suggestionCard}>
                <View style={styles.suggestionHeader}>
                  <Text style={styles.suggestionIcon}>✨</Text>
                  <View style={styles.suggestionInfo}>
                    <Text style={styles.suggestionTime}>
                      {format(new Date(suggestion.suggestedTime), 'EEEE, MMM d • h:mm a')}
                    </Text>
                    <Text style={styles.suggestionDuration}>
                      {suggestion.duration} min • {Math.round(suggestion.confidence * 100)}% match
                    </Text>
                  </View>
                </View>
                <Text style={styles.suggestionReason}>{suggestion.reason}</Text>
                <View style={styles.suggestionActions}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => {
                      const newEvent = {
                        id: uuidv4(),
                        calendarId: state.calendars[0].id,
                        title: 'New Meeting',
                        description: 'Created from AI suggestion',
                        location: '',
                        startTime: new Date(suggestion.suggestedTime),
                        endTime: addHours(new Date(suggestion.suggestedTime), suggestion.duration / 60),
                        isAllDay: false,
                        category: 'meeting' as const,
                        color: COLORS.gradientStart,
                        recurrence: 'none' as const,
                        reminders: [15],
                        attendees: [],
                        isOnline: false,
                      };
                      addEvent(newEvent);
                      navigation.goBack();
                    }}
                  >
                    <Text style={styles.acceptButtonText}>Create Event</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Meeting Intelligence */}
        {state.aiMeetingInsights.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meeting Insights</Text>
            {state.aiMeetingInsights.map((insight) => (
              <View key={insight.id} style={styles.insightCard}>
                <View style={styles.insightHeader}>
                  <Text style={styles.insightIcon}>🎯</Text>
                  <Text style={styles.insightDate}>
                    {format(new Date(insight.createdAt), 'MMM d, h:mm a')}
                  </Text>
                </View>
                <Text style={styles.insightSummary}>{insight.summary}</Text>
                {insight.actionItems.length > 0 && (
                  <View style={styles.actionItemsList}>
                    <Text style={styles.actionItemsTitle}>
                      Action Items ({insight.actionItems.length})
                    </Text>
                    {insight.actionItems.map((item) => (
                      <View key={item.id} style={styles.actionItemRow}>
                        <View style={[styles.actionDot, item.isCompleted && styles.actionDotCompleted]} />
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
  aiStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface + '80',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  aiStatusIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  aiStatusTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  aiStatusSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.success,
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
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  quickActionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gradientStart,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.textMuted,
  },
  sendButtonText: {
    fontSize: 18,
    color: COLORS.text,
  },
  responseContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  responseIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  responseTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  responseText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  suggestionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
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
  suggestionInfo: {
    flex: 1,
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
  },
  acceptButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: '600',
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
  insightDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  insightSummary: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  actionItemsList: {
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceLight,
    paddingTop: SPACING.sm,
  },
  actionItemsTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  actionItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  actionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.warning,
    marginRight: SPACING.sm,
  },
  actionDotCompleted: {
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
  disabledContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  disabledIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  disabledTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  disabledDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  enableButton: {
    backgroundColor: COLORS.gradientStart,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  enableButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 100,
  },
});