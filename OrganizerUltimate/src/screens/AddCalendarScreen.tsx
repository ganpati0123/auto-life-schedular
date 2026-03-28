import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../contexts/AppContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../utils/theme';
import { v4 as uuidv4 } from 'uuid';

export function AddCalendarScreen({ navigation }: any) {
  const { addCalendar } = useApp();
  
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS.calendarColors[0]);

  const colors = COLORS.calendarColors;

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a calendar name');
      return;
    }

    const newCalendar = {
      id: uuidv4(),
      name: name.trim(),
      color: selectedColor,
      isVisible: true,
      isDefault: false,
    };

    addCalendar(newCalendar);
    Alert.alert('Success', 'Calendar created successfully!');
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
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Calendar</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Name Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calendar Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter calendar name"
              placeholderTextColor={COLORS.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

        {/* Color Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color</Text>
          <View style={styles.colorsGrid}>
            {colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorOptionSelected,
                ]}
                onPress={() => setSelectedColor(color)}
              >
                {selectedColor === color && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <View style={styles.previewCard}>
            <View style={[styles.previewDot, { backgroundColor: selectedColor }]} />
            <Text style={styles.previewName}>{name || 'Calendar Name'}</Text>
          </View>
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
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  saveButton: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gradientStart,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  inputContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  input: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: COLORS.text,
  },
  checkmark: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  previewDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: SPACING.md,
  },
  previewName: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
  },
  bottomPadding: {
    height: 100,
  },
});