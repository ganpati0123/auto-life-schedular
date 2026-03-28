import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import { useApp } from '../contexts/AppContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../utils/theme';
import { Avatar } from '../components/ui';

export function EventDetailScreen({ navigation, route }: any) {
  const { eventId } = route.params;
  const { state, deleteEvent } = useApp();
  const { events, calendars } = state;

  const event = events.find((e) => e.id === eventId);
  const calendar = event ? calendars.find((c) => c.id === event.calendarId) : null;

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Event not found</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteEvent(event.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const getCategoryIcon = () => {
    switch (event.category) {
      case 'meeting': return '👥';
      case 'personal': return '🏠';
      case 'work': return '💼';
      case 'health': return '🏥';
      default: return '📅';
    }
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
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.navigate('EditEvent', { eventId: event.id })}
            >
              <Text style={styles.headerButtonText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleDelete}>
              <Text style={styles.headerButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.eventHeader}>
          <View style={[styles.categoryIcon, { backgroundColor: event.color }]}>
            <Text style={styles.categoryIconText}>{getCategoryIcon()}</Text>
          </View>
          <Text style={styles.eventTitle}>{event.title}</Text>
          {calendar && (
            <View style={styles.calendarBadge}>
              <View style={[styles.calendarDot, { backgroundColor: calendar.color }]} />
              <Text style={styles.calendarName}>{calendar.name}</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Date & Time */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🕐</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Date & Time</Text>
              <Text style={styles.infoValue}>
                {format(new Date(event.startTime), 'EEEE, MMMM d, yyyy')}
              </Text>
              <Text style={styles.infoSubvalue}>
                {event.isAllDay
                  ? 'All Day'
                  : `${format(new Date(event.startTime), 'h:mm a')} - ${format(new Date(event.endTime), 'h:mm a')}`}
              </Text>
            </View>
          </View>
        </View>

        {/* Location */}
        {(event.location || event.isOnline) && (
          <View style={styles.section}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📍</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{event.location || 'Online Meeting'}</Text>
                {event.isOnline && event.meetingLink && (
                  <TouchableOpacity style={styles.joinLinkButton}>
                    <Text style={styles.joinLinkText}>Join Meeting →</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Description */}
        {event.description && (
          <View style={styles.section}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📝</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Description</Text>
                <Text style={styles.infoValue}>{event.description}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Recurrence */}
        {event.recurrence !== 'none' && (
          <View style={styles.section}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🔄</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Recurrence</Text>
                <Text style={styles.infoValue}>
                  {event.recurrence.charAt(0).toUpperCase() + event.recurrence.slice(1)}
                  {event.recurrenceEndDate && ` until ${format(new Date(event.recurrenceEndDate), 'MMM d, yyyy')}`}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Reminders */}
        {event.reminders.length > 0 && (
          <View style={styles.section}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🔔</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Reminders</Text>
                {event.reminders.map((reminder, index) => (
                  <Text key={index} style={styles.infoValue}>
                    {reminder >= 60 ? `${reminder / 60} hour${reminder > 60 ? 's' : ''} before` : `${reminder} minutes before`}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Attendees */}
        {event.attendees.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attendees ({event.attendees.length})</Text>
            {event.attendees.map((attendee) => (
              <View key={attendee.id} style={styles.attendeeItem}>
                <Avatar name={attendee.name} size={40} />
                <View style={styles.attendeeInfo}>
                  <Text style={styles.attendeeName}>{attendee.name}</Text>
                  <Text style={styles.attendeeEmail}>{attendee.email}</Text>
                </View>
                <View style={[
                  styles.rsvpBadge,
                  attendee.status === 'accepted' && styles.rsvpAccepted,
                  attendee.status === 'declined' && styles.rsvpDeclined,
                  attendee.status === 'tentative' && styles.rsvpTentative,
                  attendee.status === 'pending' && styles.rsvpPending,
                ]}>
                  <Text style={styles.rsvpText}>
                    {attendee.status.charAt(0).toUpperCase() + attendee.status.slice(1)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Notes */}
        {event.notes && (
          <View style={styles.section}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📋</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Notes</Text>
                <Text style={styles.infoValue}>{event.notes}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          {event.isOnline && event.meetingLink && (
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Join Meeting</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('EditEvent', { eventId: event.id })}
          >
            <Text style={styles.secondaryButtonText}>Edit Event</Text>
          </TouchableOpacity>
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
    marginBottom: SPACING.lg,
  },
  backButton: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  headerButtonText: {
    fontSize: 18,
  },
  eventHeader: {
    alignItems: 'center',
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  categoryIconText: {
    fontSize: 28,
  },
  eventTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  calendarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.lg,
  },
  calendarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  calendarName: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
  },
  infoIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  infoSubvalue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  joinLinkButton: {
    marginTop: SPACING.sm,
  },
  joinLinkText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gradientStart,
    fontWeight: '600',
  },
  attendeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  attendeeInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  attendeeName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  attendeeEmail: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  rsvpBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  rsvpAccepted: {
    backgroundColor: COLORS.success + '30',
  },
  rsvpDeclined: {
    backgroundColor: COLORS.error + '30',
  },
  rsvpTentative: {
    backgroundColor: COLORS.warning + '30',
  },
  rsvpPending: {
    backgroundColor: COLORS.textMuted + '30',
  },
  rsvpText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  actionsSection: {
    marginTop: SPACING.lg,
  },
  primaryButton: {
    backgroundColor: COLORS.success,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  primaryButtonText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    fontWeight: '500',
  },
  errorText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
  bottomPadding: {
    height: 100,
  },
});