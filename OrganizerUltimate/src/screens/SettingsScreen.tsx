import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../contexts/AppContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, TIMEZONES } from '../utils/theme';

export function SettingsScreen({ navigation }: any) {
  const { state, updateSettings } = useApp();
  const { settings, calendars, emailAccounts } = state;

  const handleToggle = (key: keyof typeof settings, value: boolean) => {
    updateSettings({ [key]: value });
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
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* AI Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Assistant</Text>
          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Enable AI Assistant</Text>
                <Text style={styles.settingDescription}>
                  Enable AI-powered features like smart scheduling and email assistance
                </Text>
              </View>
              <Switch
                value={settings.aiEnabled}
                onValueChange={(value) => handleToggle('aiEnabled', value)}
                trackColor={{ false: COLORS.surfaceLight, true: COLORS.gradientStart }}
                thumbColor={COLORS.text}
              />
            </View>
          </View>
        </View>

        {/* Calendar Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calendar</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Default Calendar</Text>
                <Text style={styles.settingDescription}>
                  {calendars.find((c) => c.id === settings.defaultCalendarId)?.name || 'Select'}
                </Text>
              </View>
              <Text style={styles.settingArrow}>▶</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Time Zone</Text>
                <Text style={styles.settingDescription}>{settings.timeZone}</Text>
              </View>
              <Text style={styles.settingArrow}>▶</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Notifications</Text>
                <Text style={styles.settingDescription}>
                  Receive reminders for upcoming events
                </Text>
              </View>
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={(value) => handleToggle('notificationsEnabled', value)}
                trackColor={{ false: COLORS.surfaceLight, true: COLORS.gradientStart }}
                thumbColor={COLORS.text}
              />
            </View>
          </View>

          {/* Calendars List */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your Calendars</Text>
            {calendars.map((calendar) => (
              <TouchableOpacity key={calendar.id} style={styles.calendarItem}>
                <View style={[styles.calendarColor, { backgroundColor: calendar.color }]} />
                <Text style={styles.calendarName}>{calendar.name}</Text>
                {calendar.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Default</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Email Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Default Account</Text>
                <Text style={styles.settingDescription}>
                  {emailAccounts.find((a) => a.id === settings.defaultEmailAccountId)?.email || 'Select'}
                </Text>
              </View>
              <Text style={styles.settingArrow}>▶</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Auto-reply (Vacation)</Text>
                <Text style={styles.settingDescription}>
                  Automatically reply to emails when away
                </Text>
              </View>
              <Switch
                value={settings.autoReplyEnabled}
                onValueChange={(value) => handleToggle('autoReplyEnabled', value)}
                trackColor={{ false: COLORS.surfaceLight, true: COLORS.gradientStart }}
                thumbColor={COLORS.text}
              />
            </View>

            {settings.autoReplyEnabled && (
              <>
                <View style={styles.divider} />
                <View style={styles.textInputContainer}>
                  <Text style={styles.inputLabel}>Auto-reply Message</Text>
                  <TextInput
                    style={styles.textInput}
                    value={settings.autoReplyMessage}
                    onChangeText={(text) => updateSettings({ autoReplyMessage: text })}
                    placeholder="Enter your auto-reply message..."
                    placeholderTextColor={COLORS.textMuted}
                    multiline
                  />
                </View>
              </>
            )}
          </View>

          {/* Email Accounts */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Connected Accounts</Text>
            {emailAccounts.map((account) => (
              <TouchableOpacity key={account.id} style={styles.accountItem}>
                <View style={styles.accountInfo}>
                  <Text style={styles.accountIcon}>
                    {account.type === 'gmail' ? '📧' : account.type === 'outlook' ? '📨' : '☁️'}
                  </Text>
                  <View>
                    <Text style={styles.accountName}>{account.name}</Text>
                    <Text style={styles.accountEmail}>{account.email}</Text>
                  </View>
                </View>
                <View style={[styles.accountStatus, account.isConnected && styles.accountStatusConnected]}>
                  <Text style={styles.accountStatusText}>
                    {account.isConnected ? 'Connected' : 'Disconnected'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Signature */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email Signature</Text>
          <View style={styles.card}>
            <View style={styles.textInputContainer}>
              <Text style={styles.inputLabel}>Your Signature</Text>
              <TextInput
                style={[styles.textInput, styles.signatureInput]}
                value={settings.signature}
                onChangeText={(text) => updateSettings({ signature: text })}
                placeholder="Enter your email signature..."
                placeholderTextColor={COLORS.textMuted}
                multiline
              />
            </View>
          </View>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Theme</Text>
                <Text style={styles.settingDescription}>
                  {settings.theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </Text>
              </View>
              <Text style={styles.settingArrow}>▶</Text>
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <View style={styles.aboutItem}>
              <Text style={styles.aboutLabel}>Version</Text>
              <Text style={styles.aboutValue}>1.0.0</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.aboutItem}>
              <Text style={styles.aboutLabel}>App Name</Text>
              <Text style={styles.aboutValue}>Organizer Ultimate</Text>
            </View>
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
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: BORDER_RADIUS.xxl,
    borderBottomRightRadius: BORDER_RADIUS.xxl,
  },
  header: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  cardTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  settingInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  settingLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  settingArrow: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.surfaceLight,
    marginVertical: SPACING.xs,
  },
  textInputContainer: {
    marginTop: SPACING.sm,
  },
  inputLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  textInput: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    minHeight: 80,
  },
  signatureInput: {
    minHeight: 100,
  },
  calendarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  calendarColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: SPACING.md,
  },
  calendarName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    flex: 1,
  },
  defaultBadge: {
    backgroundColor: COLORS.gradientStart,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  defaultBadgeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  accountName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  accountEmail: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  accountStatus: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceLight,
  },
  accountStatusConnected: {
    backgroundColor: COLORS.success + '30',
  },
  accountStatusText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  aboutLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  aboutValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  bottomPadding: {
    height: 100,
  },
});