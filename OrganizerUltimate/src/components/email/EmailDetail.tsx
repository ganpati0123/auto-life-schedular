import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { EmailMessage } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { Avatar, Button, IconButton } from '../common';
import { formatDate } from '../../utils';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants';

interface EmailDetailProps {
  email: EmailMessage;
  onReply: () => void;
  onForward: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export const EmailDetail: React.FC<EmailDetailProps> = ({
  email,
  onReply,
  onForward,
  onDelete,
  onClose,
}) => {
  const { colors } = useTheme();
  const [showDetails, setShowDetails] = useState(false);
  
  const handleAttachmentPress = (uri: string) => {
    Linking.openURL(uri);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <IconButton
          icon={<Text style={{ fontSize: 20 }}>←</Text>}
          onPress={onClose}
          size="small"
        />
        <View style={styles.headerActions}>
          <IconButton
            icon={<Text style={{ fontSize: 18 }}>⭐</Text>}
            onPress={() => {}}
            size="small"
            variant="ghost"
          />
          <IconButton
            icon={<Text style={{ fontSize: 18 }}>🗑️</Text>}
            onPress={onDelete}
            size="small"
            variant="ghost"
          />
          <IconButton
            icon={<Text style={{ fontSize: 18 }}>⋯</Text>}
            onPress={() => {}}
            size="small"
            variant="ghost"
          />
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={[styles.subject, { color: colors.text }]}>{email.subject}</Text>
        
        <View style={styles.senderSection}>
          <Avatar name={email.from.name || email.from.email} size={48} />
          <View style={styles.senderInfo}>
            <Text style={[styles.senderName, { color: colors.text }]}>
              {email.from.name || email.from.email}
            </Text>
            <Text style={[styles.senderEmail, { color: colors.textSecondary }]}>
              {email.from.email}
            </Text>
          </View>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {formatDate(email.receivedAt, 'PPp')}
          </Text>
        </View>
        
        <TouchableOpacity onPress={() => setShowDetails(!showDetails)}>
          <Text style={[styles.toggleDetails, { color: colors.primary }]}>
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Text>
        </TouchableOpacity>
        
        {showDetails && (
          <View style={[styles.details, { backgroundColor: colors.surface }]}>
            <Text style={{ color: colors.textSecondary }}>To: {email.to.map(t => t.email).join(', ')}</Text>
            {email.cc.length > 0 && (
              <Text style={{ color: colors.textSecondary }}>CC: {email.cc.map(c => c.email).join(', ')}</Text>
            )}
          </View>
        )}
        
        <Text style={[styles.body, { color: colors.text }]}>{email.body}</Text>
        
        {email.attachments.length > 0 && (
          <View style={styles.attachments}>
            <Text style={[styles.attachmentTitle, { color: colors.text }]}>
              Attachments ({email.attachments.length})
            </Text>
            {email.attachments.map((attachment) => (
              <TouchableOpacity
                key={attachment.id}
                style={[styles.attachment, { borderColor: colors.border }]}
                onPress={() => handleAttachmentPress(attachment.uri || '')}
              >
                <Text style={[styles.attachmentName, { color: colors.primary }]}>
                  📎 {attachment.filename}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
      
      <View style={[styles.actions, { borderTopColor: colors.border }]}>
        <Button title="Reply" onPress={onReply} variant="primary" style={styles.actionButton} />
        <Button title="Forward" onPress={onForward} variant="outline" style={styles.actionButton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
  },
  headerActions: {
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  subject: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '600',
    marginBottom: SPACING.lg,
  },
  senderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  senderInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  senderName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  senderEmail: {
    fontSize: FONT_SIZES.sm,
  },
  date: {
    fontSize: FONT_SIZES.sm,
  },
  toggleDetails: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    marginBottom: SPACING.md,
  },
  details: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  body: {
    fontSize: FONT_SIZES.md,
    lineHeight: 24,
  },
  attachments: {
    marginTop: SPACING.lg,
  },
  attachmentTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  attachment: {
    padding: SPACING.md,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  attachmentName: {
    fontSize: FONT_SIZES.sm,
  },
  actions: {
    flexDirection: 'row',
    padding: SPACING.md,
    gap: SPACING.md,
    borderTopWidth: 1,
  },
  actionButton: {
    flex: 1,
  },
});
