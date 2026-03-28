import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import { useApp } from '../contexts/AppContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../utils/theme';

interface QuickReply {
  id: string;
  text: string;
  isCustom: boolean;
}

// Pre-defined quick replies
const defaultQuickReplies: QuickReply[] = [
  { id: '1', text: 'Thank you! I\'ll look into this.', isCustom: false },
  { id: '2', text: 'Sounds good, let me check and get back to you.', isCustom: false },
  { id: '3', text: 'Can we schedule a call to discuss this further?', isCustom: false },
  { id: '4', text: 'I\'ll have this ready by end of day.', isCustom: false },
  { id: '5', text: 'Thanks for the update!', isCustom: false },
  { id: '6', text: 'Confirmed. Looking forward to it.', isCustom: false },
];

export function SmartReplyScreen({ navigation, route }: any) {
  const { emailId } = route.params;
  const { state } = useApp();
  const { emails } = state;

  const email = emails.find((e) => e.id === emailId);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>(defaultQuickReplies);
  const [showCustomReply, setShowCustomReply] = useState(false);
  const [customReplyText, setCustomReplyText] = useState('');

  // Simulated AI suggestions based on email content
  const aiSuggestions = [
    "Thanks for the update! I'll review and get back to you shortly.",
    "Perfect, let's proceed with the plan. I'll prepare the necessary documents.",
    "I agree with your points. Let's schedule a meeting to discuss the next steps.",
    "Great progress! Keep me updated on any blockers.",
  ];

  const addCustomReply = () => {
    if (customReplyText.trim()) {
      setQuickReplies([
        ...quickReplies,
        { id: Date.now().toString(), text: customReplyText.trim(), isCustom: true },
      ]);
      setCustomReplyText('');
      setShowCustomReply(false);
    }
  };

  const selectReply = (reply: QuickReply) => {
    navigation.navigate('ComposeEmail', { 
      replyTo: email,
      prefillText: reply.text 
    });
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
          <Text style={styles.headerTitle}>Smart Reply</Text>
          <TouchableOpacity onPress={() => setShowCustomReply(true)}>
            <Text style={styles.customButton}>Custom</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Email Context */}
        {email && (
          <View style={styles.contextSection}>
            <Text style={styles.sectionLabel}>Replying to:</Text>
            <View style={styles.emailContext}>
              <Text style={styles.emailSubject}>{email.subject}</Text>
              <Text style={styles.emailSender}>From: {email.from.name}</Text>
              <Text style={styles.emailPreview} numberOfLines={3}>
                {email.body}
              </Text>
            </View>
          </View>
        )}

        {/* AI Suggestions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🤖 AI Suggestions</Text>
            <Text style={styles.aiBadge}>Smart</Text>
          </View>
          {aiSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionCard}
              onPress={() => selectReply({ id: `ai-${index}`, text: suggestion, isCustom: false })}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
              <Text style={styles.suggestionUse}>Use →</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Replies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Replies</Text>
          {quickReplies.map((reply) => (
            <TouchableOpacity
              key={reply.id}
              style={styles.quickReplyCard}
              onPress={() => selectReply(reply)}
            >
              <Text style={styles.quickReplyText}>{reply.text}</Text>
              {reply.isCustom && <Text style={styles.customBadge}>Custom</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Tone Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reply Tone</Text>
          <View style={styles.toneGrid}>
            {[
              { id: 'professional', label: '💼 Professional', icon: '💼' },
              { id: 'casual', label: '😊 Casual', icon: '😊' },
              { id: 'friendly', label: '🤝 Friendly', icon: '🤝' },
              { id: 'formal', label: '🎩 Formal', icon: '🎩' },
            ].map((tone) => (
              <TouchableOpacity key={tone.id} style={styles.toneButton}>
                <Text style={styles.toneIcon}>{tone.icon}</Text>
                <Text style={styles.toneLabel}>{tone.label.split(' ')[1]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Tips</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Tap any reply to start composing</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Custom replies are saved for future use</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• AI suggestions are context-aware</Text>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Custom Reply Modal */}
      <Modal visible={showCustomReply} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Custom Reply</Text>
              <TouchableOpacity onPress={() => setShowCustomReply(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.customInput}
              placeholder="Type your quick reply..."
              placeholderTextColor={COLORS.textMuted}
              value={customReplyText}
              onChangeText={setCustomReplyText}
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity
              style={[styles.saveButton, !customReplyText.trim() && styles.saveButtonDisabled]}
              onPress={addCustomReply}
              disabled={!customReplyText.trim()}
            >
              <Text style={styles.saveButtonText}>Save Quick Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  customButton: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gradientStart,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  contextSection: {
    marginBottom: SPACING.lg,
  },
  sectionLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  emailContext: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  emailSubject: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  emailSender: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  emailPreview: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  section: {
    marginBottom: SPACING.lg,
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
  aiBadge: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gradientStart,
    backgroundColor: COLORS.gradientStart + '30',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  suggestionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gradientStart,
  },
  suggestionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SPACING.xs,
  },
  suggestionUse: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gradientStart,
    fontWeight: '600',
    textAlign: 'right',
  },
  quickReplyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickReplyText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  customBadge: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.warning,
    backgroundColor: COLORS.warning + '30',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  toneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toneButton: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  toneIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  toneLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
  },
  tipsSection: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  tipsTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  tipItem: {
    marginBottom: SPACING.xs,
  },
  tipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  bottomPadding: {
    height: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  closeButton: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
  },
  customInput: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: SPACING.lg,
  },
  saveButton: {
    backgroundColor: COLORS.gradientStart,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
  },
});