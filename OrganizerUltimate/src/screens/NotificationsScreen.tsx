import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format, subDays, subHours, isToday, isYesterday } from 'date-fns';
import { useApp } from '../contexts/AppContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../utils/theme';

export function NotificationsScreen({ navigation }: any) {
  const { state } = useApp();
  const { events, emails } = state;

  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'event_reminder',
      title: 'Team Standup in 15 minutes',
      description: 'Daily standup meeting with the development team',
      time: subHours(new Date(), 0.25),
      isRead: false,
      icon: '📅',
    },
    {
      id: '2',
      type: 'email',
      title: 'New email from Sarah Connor',
      description: 'Project Update - Phase 2 Complete',
      time: subHours(new Date(), 2),
      isRead: false,
      icon: '📧',
    },
    {
      id: '3',
      type: 'meeting_invite',
      title: 'Meeting Invitation: Project Review',
      description: 'Charlie Davis invited you to Project Review',
      time: subHours(new Date(), 3),
      isRead: true,
      icon: '👥',
    },
    {
      id: '4',
      type: 'event_update',
      title: 'Event Updated: Client Call',
      description: 'The time for Client Call has been changed',
      time: subDays(new Date(), 1),
      isRead: true,
      icon: '✏️',
    },
    {
      id: '5',
      type: 'ai_insight',
      title: 'AI Suggestion',
      description: 'Your calendar is free tomorrow afternoon. Good time for focus work.',
      time: subDays(new Date(), 1),
      isRead: true,
      icon: '🤖',
    },
  ]);

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'events' | 'emails'>('all');

  const filteredNotifications = notifications.filter((n) => {
    switch (selectedFilter) {
      case 'unread':
        return !n.isRead;
      case 'events':
        return n.type.includes('event') || n.type === 'meeting_invite';
      case 'emails':
        return n.type === 'email';
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return format(date, 'MMM d');
  };

  const renderNotification = ({ item }: { item: typeof notifications[0] }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.isRead && styles.notificationCardUnread]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationIcon}>
        <Text style={styles.iconText}>{item.icon}</Text>
      </View>
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, !item.isRead && styles.notificationTitleUnread]}>
          {item.title}
        </Text>
        <Text style={styles.notificationDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.notificationTime}>{getTimeAgo(item.time)}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteNotification(item.id)}
      >
        <Text style={styles.deleteIcon}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllButton}>Mark all read</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{unreadCount} unread</Text>
        </View>
      </LinearGradient>

      {/* Filters */}
      <View style={styles.filterContainer}>
        {(['all', 'unread', 'events', 'emails'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterButton, selectedFilter === filter && styles.filterButtonActive]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
              {filter === 'all' ? 'All' : filter === 'unread' ? 'Unread' : filter === 'events' ? 'Events' : 'Emails'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notification List */}
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyText}>You're all caught up!</Text>
          </View>
        }
      />
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
  markAllButton: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
  },
  unreadBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.lg,
  },
  unreadText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  filterButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    marginRight: SPACING.sm,
  },
  filterButtonActive: {
    backgroundColor: COLORS.gradientStart,
  },
  filterText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  listContent: {
    padding: SPACING.md,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  notificationCardUnread: {
    backgroundColor: COLORS.surfaceLight,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gradientStart,
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  iconText: {
    fontSize: 20,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: 2,
  },
  notificationTitleUnread: {
    fontWeight: '600',
  },
  notificationDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  deleteButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  deleteIcon: {
    fontSize: 16,
    color: COLORS.textMuted,
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
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
});