import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { Event } from '../../types';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../utils/theme';

interface EventCardProps {
  event: Event;
  onPress?: () => void;
}

export function EventCard({ event, onPress }: EventCardProps) {
  const startTime = format(new Date(event.startTime), 'h:mm a');
  const endTime = format(new Date(event.endTime), 'h:mm a');

  const getCategoryIcon = () => {
    switch (event.category) {
      case 'meeting':
        return '👥';
      case 'personal':
        return '🏠';
      case 'work':
        return '💼';
      case 'health':
        return '🏥';
      default:
        return '📅';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { borderLeftColor: event.color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{startTime}</Text>
        <Text style={styles.timeEnd}>{endTime}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.icon}>{getCategoryIcon()}</Text>
          <Text style={styles.title} numberOfLines={1}>
            {event.title}
          </Text>
        </View>
        {event.location && (
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.location} numberOfLines={1}>
              {event.location}
            </Text>
          </View>
        )}
        {event.attendees.length > 0 && (
          <View style={styles.attendeesRow}>
            <Text style={styles.attendeesIcon}>👤</Text>
            <Text style={styles.attendees}>
              {event.attendees.length} attendee{event.attendees.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}
        {event.isOnline && event.meetingLink && (
          <View style={styles.meetingRow}>
            <Text style={styles.meetingIcon}>🔗</Text>
            <Text style={styles.meeting}>Join Meeting</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

interface EventListProps {
  events: Event[];
  onEventPress?: (event: Event) => void;
  emptyMessage?: string;
}

export function EventList({ events, onEventPress, emptyMessage = 'No events' }: EventListProps) {
  if (events.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onPress={() => onEventPress?.(event)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 4,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  timeContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  time: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
  timeEnd: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: FONT_SIZES.md,
    marginRight: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  locationIcon: {
    fontSize: FONT_SIZES.sm,
    marginRight: SPACING.xs,
  },
  location: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },
  attendeesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  attendeesIcon: {
    fontSize: FONT_SIZES.sm,
    marginRight: SPACING.xs,
  },
  attendees: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  meetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  meetingIcon: {
    fontSize: FONT_SIZES.sm,
    marginRight: SPACING.xs,
  },
  meeting: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gradientStart,
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
});