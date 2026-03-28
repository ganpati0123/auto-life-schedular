import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { EmailMessage } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { Avatar, IconButton } from '../common';
import { formatRelativeDate, truncateText } from '../../utils';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants';

interface EmailItemProps {
  email: EmailMessage;
  onPress: (email: EmailMessage) => void;
  onStar: (id: string) => void;
  onDelete: (id: string) => void;
}

export const EmailItem: React.FC<EmailItemProps> = ({ email, onPress, onStar, onDelete }) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
        !email.isRead && styles.unread,
      ]}
      onPress={() => onPress(email)}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <Avatar name={email.from.name || email.from.email} size={40} />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            style={[
              styles.sender,
              { color: colors.text },
              !email.isRead && styles.unreadText,
            ]}
            numberOfLines={1}
          >
            {email.from.name || email.from.email}
          </Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {formatRelativeDate(email.receivedAt)}
          </Text>
        </View>
        <Text
          style={[
            styles.subject,
            { color: colors.text },
            !email.isRead && styles.unreadText,
          ]}
          numberOfLines={1}
        >
          {email.subject}
        </Text>
        <Text style={[styles.preview, { color: colors.textSecondary }]} numberOfLines={2}>
          {truncateText(email.body, 100)}
        </Text>
        <View style={styles.actions}>
          {email.attachments.length > 0 && (
            <Text style={[styles.attachment, { color: colors.primary }]}>
              📎 {email.attachments.length}
            </Text>
          )}
          {email.isPriority && (
            <Text style={[styles.priority, { color: colors.error }]}>⭐ High Priority</Text>
          )}
        </View>
      </View>
      <View style={styles.right}>
        <IconButton
          icon={<Text style={{ fontSize: 18 }}>{email.isStarred ? '⭐' : '☆'}</Text>}
          onPress={() => onStar(email.id)}
          size="small"
          variant="ghost"
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderBottomWidth: 1,
  },
  unread: {
    backgroundColor: '#F0F7FF',
  },
  left: {
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  sender: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    flex: 1,
  },
  date: {
    fontSize: FONT_SIZES.xs,
    marginLeft: SPACING.sm,
  },
  subject: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.xs,
  },
  preview: {
    fontSize: FONT_SIZES.sm,
  },
  actions: {
    flexDirection: 'row',
    marginTop: SPACING.xs,
    gap: SPACING.md,
  },
  attachment: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
  },
  priority: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
  },
  unreadText: {
    fontWeight: '700',
  },
  right: {
    justifyContent: 'center',
  },
});
