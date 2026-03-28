import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useSettingsStore } from '../store';
import { Card, Input } from '../components/common';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants';

export const SettingsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { settings, setTheme, updateNotificationSettings, updateAISettings, setAPIKey, resetSettings } = useSettingsStore();
  
  const handleReset = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetSettings },
      ]
    );
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
        <Card>
          <TouchableOpacity style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Theme</Text>
            <View style={styles.themeSelector}>
              {(['light', 'dark', 'system'] as const).map((theme) => (
                <TouchableOpacity
                  key={theme}
                  style={[
                    styles.themeOption,
                    { backgroundColor: settings.theme === theme ? colors.primary : colors.surface },
                  ]}
                  onPress={() => setTheme(theme)}
                >
                  <Text style={{ color: settings.theme === theme ? '#FFFFFF' : colors.text }}>
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
        <Card>
          <TouchableOpacity style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Enable Notifications</Text>
            <Switch
              value={settings.notifications.enabled}
              onValueChange={(value) => updateNotificationSettings({ enabled: value })}
              trackColor={{ false: colors.divider, true: colors.primary }}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Email Notifications</Text>
            <Switch
              value={settings.notifications.emailNotifications}
              onValueChange={(value) => updateNotificationSettings({ emailNotifications: value })}
              trackColor={{ false: colors.divider, true: colors.primary }}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Calendar Reminders</Text>
            <Switch
              value={settings.notifications.calendarNotifications}
              onValueChange={(value) => updateNotificationSettings({ calendarNotifications: value })}
              trackColor={{ false: colors.divider, true: colors.primary }}
            />
          </TouchableOpacity>
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>AI Assistant</Text>
        <Card>
          <TouchableOpacity style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Enable AI Features</Text>
            <Switch
              value={settings.ai.enabled}
              onValueChange={(value) => updateAISettings({ enabled: value })}
              trackColor={{ false: colors.divider, true: colors.primary }}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Auto Schedule</Text>
            <Switch
              value={settings.ai.autoSchedule}
              onValueChange={(value) => updateAISettings({ autoSchedule: value })}
              trackColor={{ false: colors.divider, true: colors.primary }}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Email Summarization</Text>
            <Switch
              value={settings.ai.emailSummarization}
              onValueChange={(value) => updateAISettings({ emailSummarization: value })}
              trackColor={{ false: colors.divider, true: colors.primary }}
            />
          </TouchableOpacity>
          
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>OpenAI API Key</Text>
          </View>
          <Input
            placeholder="Enter API key..."
            value={settings.ai.apiKey || ''}
            onChangeText={setAPIKey}
            secureTextEntry
          />
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
        <Card>
          <View style={styles.aboutRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Version</Text>
            <Text style={{ color: colors.textSecondary }}>1.0.0</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Developer</Text>
            <Text style={{ color: colors.textSecondary }}>Organizer Ultimate Team</Text>
          </View>
        </Card>
      </View>
      
      <TouchableOpacity
        style={[styles.resetButton, { borderColor: colors.error }]}
        onPress={handleReset}
      >
        <Text style={{ color: colors.error }}>Reset All Settings</Text>
      </TouchableOpacity>
      
      <View style={styles.footer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { marginTop: SPACING.lg, paddingHorizontal: SPACING.md },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: '600', marginBottom: SPACING.md },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: SPACING.sm },
  settingLabel: { fontSize: FONT_SIZES.md },
  themeSelector: { flexDirection: 'row', gap: SPACING.xs },
  themeOption: { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.sm, borderRadius: BORDER_RADIUS.sm },
  aboutRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.sm },
  resetButton: { margin: SPACING.md, padding: SPACING.md, borderWidth: 1, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
  footer: { height: SPACING.xxl },
});