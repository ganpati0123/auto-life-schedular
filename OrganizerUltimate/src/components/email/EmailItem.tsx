import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { Email, EmailLabel } from '../../types';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../utils/theme';
import { Avatar } from '../ui';

interface EmailItemProps {
  email: Email;
  labels: EmailLabel[];
  onPress: () => void;
  onStarPress?: () => void;
}

export function EmailItem({ email, labels, onPress, onStarPress }: EmailItemProps) {
  const emailDate = new Date(email.date);
  const formattedDate = format(emailDate, 'MMM d');
  
  const emailLabels = labels.filter((label) => email.labels.includes(label.id));

  return (
    <TouchableOpacity
      style={[styles.container, !email.isRead && styles.unreadContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Avatar name={email.from.name} size={44} />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.senderContainer}>
            <Text style={[styles.sender, !email.isRead && styles.unreadText]} numberOfLines={1}>
              {email.from.name}
            </Text>
            <Text style={styles.emailAddress} numberOfLines={1}>
              {email.from.email}
            </Text>
          </View>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        <Text style={[styles.subject, !email.isRead && styles.unreadText]} numberOfLines={1}>
          {email.subject}
        </Text>
        <Text style={styles.preview} numberOfLines={2}>
          {email.preview}
        </Text>
        {emailLabels.length > 0 && (
          <View style={styles.labelsContainer}>
            {emailLabels.map((label) => (
              <View
                key={label.id}
                style={[styles.label, { backgroundColor: label.color + '30' }]}
              >
                <Text style={[styles.labelText, { color: label.color }]}>{label.name}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={onStarPress} style={styles.starButton}>
          <Text style={styles.starIcon}>{email.isStarred ? '⭐' : '☆'}</Text>
        </TouchableOpacity>
        {email.hasAttachments && <Text style={styles.attachmentIcon}>📎</Text>}
        {email.isPriority && <Text style={styles.priorityIcon}>⚡</Text>}
      </View>
    </TouchableOpacity>
  );
}

interface EmailListProps {
  emails: Email[];
  labels: EmailLabel[];
  onEmailPress: (email: Email) => void;
  onStarPress?: (email: Email) => void;
  emptyMessage?: string;
}

export function EmailList({
  emails,
  labels,
  onEmailPress,
  onStarPress,
  emptyMessage = 'No emails',
}: EmailListProps) {
  if (emails.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📧</Text>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {emails.map((email) => (
        <EmailItem
          key={email.id}
          email={email}
          labels={labels}
          onPress={() => onEmailPress(email)}
          onStarPress={() => onStarPress?.(email)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  unreadContainer: {
    backgroundColor: COLORS.surfaceLight,
  },
  avatarContainer: {
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  senderContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  sender: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  unreadText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  emailAddress: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  date: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  subject: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  preview: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.xs,
  },
  label: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.xs,
    marginTop: 2,
  },
  labelText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  starButton: {
    padding: SPACING.xs,
  },
  starIcon: {
    fontSize: FONT_SIZES.lg,
  },
  attachmentIcon: {
    fontSize: FONT_SIZES.md,
    marginTop: SPACING.xs,
  },
  priorityIcon: {
    fontSize: FONT_SIZES.md,
    marginTop: SPACING.xs,
    color: COLORS.warning,
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
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
});