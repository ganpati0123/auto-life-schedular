import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import { useApp } from '../contexts/AppContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../utils/theme';
import { Avatar } from '../components/ui';

export function EmailDetailScreen({ navigation, route }: any) {
  const { emailId } = route.params;
  const { state, toggleEmailStar, archiveEmail, moveEmailToFolder, deleteEmail } = useApp();
  const { emails, emailLabels } = state;

  const email = emails.find((e) => e.id === emailId);
  const emailLabelsList = emailLabels.filter((l) => email?.labels.includes(l.id));

  if (!email) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Email not found</Text>
      </View>
    );
  }

  const handleReply = () => {
    navigation.navigate('ComposeEmail', { replyTo: email });
  };

  const handleForward = () => {
    navigation.navigate('ComposeEmail', { forward: email });
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
              onPress={() => toggleEmailStar(email.id)}
            >
              <Text style={styles.headerButtonText}>{email.isStarred ? '⭐' : '☆'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => archiveEmail(email.id)}
            >
              <Text style={styles.headerButtonText}>📁</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => {
                deleteEmail(email.id);
                navigation.goBack();
              }}
            >
              <Text style={styles.headerButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Subject */}
        <View style={styles.subjectContainer}>
          <Text style={styles.subject}>{email.subject}</Text>
        </View>

        {/* Sender Info */}
        <View style={styles.senderContainer}>
          <Avatar name={email.from.name} size={50} />
          <View style={styles.senderInfo}>
            <View style={styles.senderNameRow}>
              <Text style={styles.senderName}>{email.from.name}</Text>
              {email.isPriority && (
                <View style={styles.priorityBadge}>
                  <Text style={styles.priorityText}>⚡ Priority</Text>
                </View>
              )}
            </View>
            <Text style={styles.senderEmail}>{email.from.email}</Text>
            <Text style={styles.emailDate}>
              To: {email.to.join(', ')}
              {email.cc.length > 0 && `\nCC: ${email.cc.join(', ')}`}
            </Text>
          </View>
          <Text style={styles.receivedTime}>
            {format(new Date(email.date), 'h:mm a')}
          </Text>
        </View>

        {/* Labels */}
        {emailLabelsList.length > 0 && (
          <View style={styles.labelsContainer}>
            {emailLabelsList.map((label) => (
              <View
                key={label.id}
                style={[styles.label, { backgroundColor: label.color + '30' }]}
              >
                <Text style={[styles.labelText, { color: label.color }]}>{label.name}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Email Body */}
        <View style={styles.bodyContainer}>
          <Text style={styles.emailBody}>{email.body}</Text>
        </View>

        {/* Attachments */}
        {email.hasAttachments && email.attachments.length > 0 && (
          <View style={styles.attachmentsSection}>
            <Text style={styles.attachmentsTitle}>Attachments ({email.attachments.length})</Text>
            {email.attachments.map((attachment) => (
              <TouchableOpacity key={attachment.id} style={styles.attachmentItem}>
                <Text style={styles.attachmentIcon}>
                  {attachment.type === 'pdf' ? '📄' : attachment.type.includes('xlsx') ? '📊' : '📁'}
                </Text>
                <View style={styles.attachmentInfo}>
                  <Text style={styles.attachmentName}>{attachment.name}</Text>
                  <Text style={styles.attachmentSize}>{attachment.size}</Text>
                </View>
                <Text style={styles.downloadIcon}>⬇️</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.replyButton} onPress={handleReply}>
            <Text style={styles.replyButtonIcon}>↩️</Text>
            <Text style={styles.replyButtonText}>Reply</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.forwardButton} onPress={handleForward}>
            <Text style={styles.forwardButtonIcon}>↪️</Text>
            <Text style={styles.forwardButtonText}>Forward</Text>
          </TouchableOpacity>
        </View>

        {/* AI Summary (if enabled) */}
        {state.settings.aiEnabled && (
          <View style={styles.aiSummarySection}>
            <View style={styles.aiSummaryHeader}>
              <Text style={styles.aiSummaryIcon}>🤖</Text>
              <Text style={styles.aiSummaryTitle}>AI Summary</Text>
            </View>
            <Text style={styles.aiSummaryText}>
              This email from {email.from.name} is about {email.subject.toLowerCase()}. 
              {email.hasAttachments && ' Includes attachments.'}
              {email.isPriority && ' Marked as priority - requires attention.'}
            </Text>
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
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: BORDER_RADIUS.xxl,
    borderBottomRightRadius: BORDER_RADIUS.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  subjectContainer: {
    marginBottom: SPACING.md,
  },
  subject: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    lineHeight: 28,
  },
  senderContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  senderInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  senderNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  senderName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  priorityBadge: {
    backgroundColor: COLORS.warning + '30',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: SPACING.sm,
  },
  priorityText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.warning,
    fontWeight: '600',
  },
  senderEmail: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  emailDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  receivedTime: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  label: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  labelText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  bodyContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  emailBody: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 24,
  },
  attachmentsSection: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  attachmentsTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  attachmentIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  attachmentSize: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  downloadIcon: {
    fontSize: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gradientStart,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    marginRight: SPACING.md,
  },
  replyButtonIcon: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  replyButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  forwardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
  },
  forwardButtonIcon: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  forwardButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  aiSummarySection: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  aiSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  aiSummaryIcon: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  aiSummaryTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  aiSummaryText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
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