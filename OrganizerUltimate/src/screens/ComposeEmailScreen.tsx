import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../contexts/AppContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../utils/theme';
import { v4 as uuidv4 } from 'uuid';

export function ComposeEmailScreen({ navigation, route }: any) {
  const { state, addEmail } = useApp();
  const { emailAccounts, selectedEmailAccountId, settings } = state;
  
  const replyTo = route.params?.replyTo;
  const forward = route.params?.forward;

  const [to, setTo] = useState(replyTo ? replyTo.from.email : forward ? '' : '');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState(
    replyTo ? `Re: ${replyTo.subject}` : forward ? `Fwd: ${forward.subject}` : ''
  );
  const [body, setBody] = useState(
    replyTo ? `\n\n--- Original Message ---\nFrom: ${replyTo.from.name}\nDate: ${new Date(replyTo.date).toLocaleDateString()}\n\n${replyTo.body}` : ''
  );
  const [showCcBcc, setShowCcBcc] = useState(false);

  const account = emailAccounts.find((a) => a.id === selectedEmailAccountId);

  const handleSend = () => {
    if (!to.trim()) {
      Alert.alert('Error', 'Please enter a recipient');
      return;
    }
    if (!subject.trim()) {
      Alert.alert('Error', 'Please enter a subject');
      return;
    }

    const newEmail = {
      id: uuidv4(),
      accountId: selectedEmailAccountId,
      folder: 'sent' as const,
      from: {
        name: account?.name || 'John Doe',
        email: account?.email || 'john@example.com',
      },
      to: to.split(',').map((e) => e.trim()),
      cc: cc ? cc.split(',').map((e) => e.trim()) : [],
      bcc: bcc ? bcc.split(',').map((e) => e.trim()) : [],
      subject: subject.trim(),
      body: body.trim(),
      preview: body.trim().substring(0, 100),
      date: new Date(),
      isRead: true,
      isStarred: false,
      isArchived: false,
      labels: [],
      hasAttachments: false,
      attachments: [],
      isPriority: false,
    };

    addEmail(newEmail);
    Alert.alert('Success', 'Email sent successfully!');
    navigation.goBack();
  };

  const handleSaveDraft = () => {
    const draftEmail = {
      id: uuidv4(),
      accountId: selectedEmailAccountId,
      folder: 'drafts' as const,
      from: {
        name: account?.name || 'John Doe',
        email: account?.email || 'john@example.com',
      },
      to: to.split(',').map((e) => e.trim()),
      cc: cc ? cc.split(',').map((e) => e.trim()) : [],
      bcc: bcc ? bcc.split(',').map((e) => e.trim()) : [],
      subject: subject.trim(),
      body: body.trim(),
      preview: '',
      date: new Date(),
      isRead: true,
      isStarred: false,
      isArchived: false,
      labels: [],
      hasAttachments: false,
      attachments: [],
      isPriority: false,
    };

    addEmail(draftEmail);
    Alert.alert('Success', 'Draft saved');
    navigation.goBack();
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
            <Text style={styles.cancelButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Email</Text>
          <TouchableOpacity onPress={handleSend}>
            <Text style={styles.sendButton}>Send</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        {/* To */}
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>To:</Text>
          <TextInput
            style={styles.input}
            placeholder="Recipients"
            placeholderTextColor={COLORS.textMuted}
            value={to}
            onChangeText={setTo}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* CC/BCC Toggle */}
        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setShowCcBcc(!showCcBcc)}
        >
          <Text style={styles.toggleText}>
            {showCcBcc ? 'Hide' : 'Show'} Cc/Bcc
          </Text>
        </TouchableOpacity>

        {/* CC */}
        {showCcBcc && (
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Cc:</Text>
            <TextInput
              style={styles.input}
              placeholder="Carbon copy"
              placeholderTextColor={COLORS.textMuted}
              value={cc}
              onChangeText={setCc}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        )}

        {/* BCC */}
        {showCcBcc && (
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Bcc:</Text>
            <TextInput
              style={styles.input}
              placeholder="Blind carbon copy"
              placeholderTextColor={COLORS.textMuted}
              value={bcc}
              onChangeText={setBcc}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        )}

        <View style={styles.divider} />

        {/* Subject */}
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Sub:</Text>
          <TextInput
            style={[styles.input, styles.subjectInput]}
            placeholder="Subject"
            placeholderTextColor={COLORS.textMuted}
            value={subject}
            onChangeText={setSubject}
          />
        </View>

        <View style={styles.divider} />

        {/* Body */}
        <View style={styles.bodyContainer}>
          <TextInput
            style={styles.bodyInput}
            placeholder="Write your message..."
            placeholderTextColor={COLORS.textMuted}
            value={body}
            onChangeText={setBody}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Signature */}
        {settings.signature && (
          <View style={styles.signatureContainer}>
            <Text style={styles.signatureText}>{settings.signature}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSend}>
            <Text style={styles.actionButtonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryActionButton} onPress={handleSaveDraft}>
            <Text style={styles.secondaryActionText}>Save Draft</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconActionButton}>
            <Text style={styles.iconActionIcon}>📎</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconActionButton}>
            <Text style={styles.iconActionIcon}>📷</Text>
          </TouchableOpacity>
        </View>
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
  cancelButton: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  sendButton: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gradientStart,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  inputLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    width: 40,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    paddingVertical: SPACING.xs,
  },
  subjectInput: {
    fontWeight: '600',
  },
  toggleRow: {
    paddingVertical: SPACING.sm,
  },
  toggleText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gradientStart,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.surface,
    marginVertical: SPACING.sm,
  },
  bodyContainer: {
    minHeight: 300,
  },
  bodyInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 24,
    minHeight: 280,
  },
  signatureContainer: {
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface,
    marginTop: SPACING.md,
  },
  signatureText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  actionButton: {
    backgroundColor: COLORS.gradientStart,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    marginRight: SPACING.md,
  },
  actionButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  secondaryActionButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginRight: SPACING.md,
  },
  secondaryActionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  iconActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  iconActionIcon: {
    fontSize: 20,
  },
});