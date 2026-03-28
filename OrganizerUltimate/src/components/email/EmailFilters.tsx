import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format, subDays, subHours } from 'date-fns';
import { useApp } from '../contexts/AppContext';
import { Email } from '../types';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../utils/theme';

interface FilterOption {
  id: string;
  label: string;
  icon: string;
  filter: (email: Email) => boolean;
}

export function EmailFiltersModal({ 
  visible, 
  onClose, 
  onApplyFilters 
}: { 
  visible: boolean; 
  onClose: () => void;
  onApplyFilters: (filters: string[]) => void;
}) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filterOptions: FilterOption[] = [
    {
      id: 'unread',
      label: 'Unread',
      icon: '📩',
      filter: (e) => !e.isRead,
    },
    {
      id: 'starred',
      label: 'Starred',
      icon: '⭐',
      filter: (e) => e.isStarred,
    },
    {
      id: 'attachments',
      label: 'Has Attachments',
      icon: '📎',
      filter: (e) => e.hasAttachments,
    },
    {
      id: 'priority',
      label: 'Priority',
      icon: '⚡',
      filter: (e) => e.isPriority,
    },
    {
      id: 'today',
      label: 'Today',
      icon: '📅',
      filter: (e) => {
        const emailDate = new Date(e.date);
        const today = new Date();
        return emailDate.toDateString() === today.toDateString();
      },
    },
    {
      id: 'last24h',
      label: 'Last 24 Hours',
      icon: '🕐',
      filter: (e) => {
        const emailDate = new Date(e.date);
        const dayAgo = subHours(new Date(), 24);
        return emailDate > dayAgo;
      },
    },
    {
      id: 'thisWeek',
      label: 'This Week',
      icon: '📆',
      filter: (e) => {
        const emailDate = new Date(e.date);
        const weekAgo = subDays(new Date(), 7);
        return emailDate > weekAgo;
      },
    },
  ];

  const toggleFilter = (filterId: string) => {
    if (selectedFilters.includes(filterId)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filterId));
    } else {
      setSelectedFilters([...selectedFilters, filterId]);
    }
  };

  const handleApply = () => {
    onApplyFilters(selectedFilters);
    onClose();
  };

  const handleClear = () => {
    setSelectedFilters([]);
    setSearchQuery('');
    onApplyFilters([]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Emails</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Search within results */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search filtered emails..."
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView style={styles.filtersList}>
            <Text style={styles.filterSectionTitle}>Status</Text>
            {filterOptions.slice(0, 4).map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.filterOption,
                  selectedFilters.includes(option.id) && styles.filterOptionSelected,
                ]}
                onPress={() => toggleFilter(option.id)}
              >
                <Text style={styles.filterIcon}>{option.icon}</Text>
                <Text style={[
                  styles.filterLabel,
                  selectedFilters.includes(option.id) && styles.filterLabelSelected,
                ]}>{option.label}</Text>
                {selectedFilters.includes(option.id) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}

            <Text style={styles.filterSectionTitle}>Time</Text>
            {filterOptions.slice(4).map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.filterOption,
                  selectedFilters.includes(option.id) && styles.filterOptionSelected,
                ]}
                onPress={() => toggleFilter(option.id)}
              >
                <Text style={styles.filterIcon}>{option.icon}</Text>
                <Text style={[
                  styles.filterLabel,
                  selectedFilters.includes(option.id) && styles.filterLabelSelected,
                ]}>{option.label}</Text>
                {selectedFilters.includes(option.id) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
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
    maxHeight: '80%',
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
  searchContainer: {
    padding: SPACING.md,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  filtersList: {
    padding: SPACING.md,
  },
  filterSectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
    textTransform: 'uppercase',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  filterOptionSelected: {
    backgroundColor: COLORS.gradientStart + '30',
  },
  filterIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  filterLabel: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  filterLabelSelected: {
    fontWeight: '600',
    color: COLORS.gradientStart,
  },
  checkmark: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gradientStart,
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface,
  },
  clearButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  clearButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  applyButton: {
    flex: 1,
    backgroundColor: COLORS.gradientStart,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  applyButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
  },
});