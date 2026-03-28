import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format, addDays, startOfDay, endOfDay } from 'date-fns';
import { useApp } from '../contexts/AppContext';
import { Event } from '../types';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../utils/theme';

export function QuickAddEventModal({ 
  visible, 
  onClose,
  onSave 
}: { 
  visible: boolean; 
  onClose: () => void;
  onSave: (event: Partial<Event>) => void;
}) {
  const [title, setTitle] = useState('');
  const [dateOption, setDateOption] = useState<'today' | 'tomorrow' | 'nextWeek'>('today');
  const [timeOption, setTimeOption] = useState<'morning' | 'afternoon' | 'evening'>('afternoon');
  const [duration, setDuration] = useState(30);

  const getEventTime = () => {
    const now = new Date();
    let date: Date;
    
    switch (dateOption) {
      case 'tomorrow':
        date = addDays(now, 1);
        break;
      case 'nextWeek':
        date = addDays(now, 7);
        break;
      default:
        date = now;
    }

    switch (timeOption) {
      case 'morning':
        date.setHours(9, 0, 0, 0);
        break;
      case 'evening':
        date.setHours(18, 0, 0, 0);
        break;
      default:
        date.setHours(14, 0, 0, 0);
    }

    return date;
  };

  const handleSave = () => {
    if (!title.trim()) return;
    
    const startTime = getEventTime();
    const endTime = new Date(startTime.getTime() + duration * 60000);
    
    onSave({
      title: title.trim(),
      startTime,
      endTime,
    });
    
    setTitle('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Quick Add Event</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Title Input */}
          <View style={styles.inputSection}>
            <TextInput
              style={styles.titleInput}
              placeholder="Event title..."
              placeholderTextColor={COLORS.textMuted}
              value={title}
              onChangeText={setTitle}
              autoFocus
            />
          </View>

          {/* Date Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>When</Text>
            <View style={styles.optionRow}>
              {(['today', 'tomorrow', 'nextWeek'] as const).map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    dateOption === option && styles.optionButtonSelected,
                  ]}
                  onPress={() => setDateOption(option)}
                >
                  <Text style={[
                    styles.optionLabel,
                    dateOption === option && styles.optionLabelSelected,
                  ]}>
                    {option === 'today' ? 'Today' : option === 'tomorrow' ? 'Tomorrow' : 'Next Week'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Time</Text>
            <View style={styles.optionRow}>
              {(['morning', 'afternoon', 'evening'] as const).map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    timeOption === option && styles.optionButtonSelected,
                  ]}
                  onPress={() => setTimeOption(option)}
                >
                  <Text style={[
                    styles.optionLabel,
                    timeOption === option && styles.optionLabelSelected,
                  ]}>
                    {option === 'morning' ? '🌅 Morning' : option === 'afternoon' ? '☀️ Afternoon' : '🌆 Evening'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Duration */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Duration</Text>
            <View style={styles.durationRow}>
              {[15, 30, 60, 90].map((mins) => (
                <TouchableOpacity
                  key={mins}
                  style={[
                    styles.durationButton,
                    duration === mins && styles.durationButtonSelected,
                  ]}
                  onPress={() => setDuration(mins)}
                >
                  <Text style={[
                    styles.durationLabel,
                    duration === mins && styles.durationLabelSelected,
                  ]}>
                    {mins < 60 ? `${mins} min` : `${mins / 60}h`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preview */}
          <View style={styles.previewSection}>
            <Text style={styles.previewLabel}>Preview</Text>
            <View style={styles.previewCard}>
              <Text style={styles.previewTitle}>{title || 'Event Title'}</Text>
              <Text style={styles.previewTime}>
                {format(getEventTime(), 'EEE, MMM d • h:mm a')} • {duration} min
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.saveButton, !title.trim() && styles.saveButtonDisabled]} 
              onPress={handleSave}
              disabled={!title.trim()}
            >
              <Text style={styles.saveButtonText}>Create Event</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
  },
  inputSection: {
    padding: SPACING.lg,
  },
  titleInput: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    fontSize: FONT_SIZES.xl,
    color: COLORS.text,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: COLORS.gradientStart,
  },
  optionLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  optionLabelSelected: {
    color: COLORS.text,
    fontWeight: '600',
  },
  durationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
  },
  durationButtonSelected: {
    backgroundColor: COLORS.gradientStart,
  },
  durationLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  durationLabelSelected: {
    color: COLORS.text,
    fontWeight: '600',
  },
  previewSection: {
    padding: SPACING.lg,
  },
  previewLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  previewCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gradientStart,
  },
  previewTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  previewTime: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  modalActions: {
    flexDirection: 'row',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface,
  },
  cancelButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  cancelButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.gradientStart,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginLeft: SPACING.sm,
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