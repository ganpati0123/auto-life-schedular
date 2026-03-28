import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useEmailStore } from '../../store';
import { Input, Button, Avatar } from '../common';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants';

interface ComposeEmailProps {
  onClose: () => void;
  replyTo?: any;
}

export const ComposeEmail: React.FC<ComposeEmailProps> = ({ onClose, replyTo }) => {
  const { colors } = useTheme();
  const { accounts } = useEmailStore();
  
  const [to, setTo] = useState(replyTo ? replyTo.from.email : '');
  const [cc, setCc] = useState('');
  const [subject, setSubject] = useState(replyTo ? `Re: ${replyTo.subject}` : '');
  const [body, setBody] = useState('');
  const [isHtml, setIsHtml] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const handleSend = async () => {
    if (!to.trim() || !subject.trim()) return;
    setIsSending(true);
    // In a real app, this would send via SMTP
    setTimeout(() => {
      setIsSending(false);
      onClose();
    }, 1000);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onClose}>
          <Text style={[styles.cancel, { color: colors.primary }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>New Message</Text>
        <TouchableOpacity onPress={handleSend} disabled={isSending}>
          <Text style={[styles.send, { color: isSending ? colors.textSecondary : colors.primary }]}>
            {isSending ? 'Sending...' : 'Send'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>From:</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {accounts[0]?.email || 'Not configured'}
          </Text>
        </View>
        
        <Input
          label="To"
          value={to}
          onChangeText={setTo}
          placeholder="recipient@example.com"
          keyboardType="email-address"
        />
        
        <Input
          label="CC/BCC"
          value={cc}
          onChangeText={setCc}
          placeholder="cc@example.com"
          keyboardType="email-address"
        />
        
        <Input
          label="Subject"
          value={subject}
          onChangeText={setSubject}
          placeholder="Subject"
        />
        
        <View style={styles.switchRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Rich Text</Text>
          <Switch
            value={isHtml}
            onValueChange={setIsHtml}
            trackColor={{ false: colors.divider, true: colors.primary }}
          />
        </View>
        
        <Input
          value={body}
          onChangeText={setBody}
          placeholder="Write your message..."
          multiline
          numberOfLines={10}
          style={styles.bodyInput}
        />
        
        <View style={styles.attachments}>
          <TouchableOpacity style={[styles.attachButton, { borderColor: colors.border }]}>
            <Text style={[styles.attachText, { color: colors.primary }]}>+ Attach File</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  cancel: {
    fontSize: FONT_SIZES.md,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  send: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  field: {
    flexDirection: 'row',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  label: {
    width: 60,
    fontSize: FONT_SIZES.md,
  },
  value: {
    flex: 1,
    fontSize: FONT_SIZES.md,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  bodyInput: {
    minHeight: 200,
    textAlignVertical: 'top',
  },
  attachments: {
    marginTop: SPACING.md,
  },
  attachButton: {
    padding: SPACING.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  attachText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },
});
