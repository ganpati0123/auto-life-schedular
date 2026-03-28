import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../contexts/AppContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../utils/theme';

export function EmailAccountsScreen({ navigation }: any) {
  const { state } = useApp();
  const { emailAccounts } = state;

  const accountTypeIcons: { [key: string]: string } = {
    gmail: '📧',
    outlook: '📨',
    icloud: '☁️',
  };

  const accountTypeLabels: { [key: string]: string } = {
    gmail: 'Google',
    outlook: 'Microsoft',
    icloud: 'Apple',
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
          <Text style={styles.headerTitle}>Email Accounts</Text>
          <TouchableOpacity>
            <Text style={styles.addButton}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Connected Accounts</Text>
        
        {emailAccounts.map((account) => (
          <TouchableOpacity key={account.id} style={styles.accountCard}>
            <View style={styles.accountHeader}>
              <View style={styles.accountIcon}>
                <Text style={styles.accountIconText}>
                  {accountTypeIcons[account.type]}
                </Text>
              </View>
              <View style={styles.accountInfo}>
                <Text style={styles.accountName}>{account.name}</Text>
                <Text style={styles.accountEmail}>{account.email}</Text>
                <View style={styles.accountTypeBadge}>
                  <Text style={styles.accountTypeText}>
                    {accountTypeLabels[account.type]}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.accountStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{account.unreadCount}</Text>
                <Text style={styles.statLabel}>Unread</Text>
              </View>
              <View style={[styles.statItem, styles.statItemConnected]}>
                <Text style={styles.statValue}>
                  {account.isConnected ? '✓' : '✗'}
                </Text>
                <Text style={styles.statLabel}>
                  {account.isConnected ? 'Connected' : 'Disconnected'}
                </Text>
              </View>
            </View>

            <View style={styles.accountActions}>
              <TouchableOpacity style={styles.accountActionButton}>
                <Text style={styles.accountActionText}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.accountActionButton}>
                <Text style={styles.accountActionText}>Sync Now</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {/* Add New Account */}
        <TouchableOpacity style={styles.addAccountCard}>
          <Text style={styles.addAccountIcon}>+</Text>
          <Text style={styles.addAccountText}>Add Email Account</Text>
          <Text style={styles.addAccountDescription}>
            Connect Gmail, Outlook, or iCloud
          </Text>
        </TouchableOpacity>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>🔒 Secure Connection</Text>
          <Text style={styles.infoText}>
            Your email accounts are protected with industry-standard security. We never store your password.
          </Text>
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
  backButton: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  addButton: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gradientStart,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  accountCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  accountHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  accountIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  accountIconText: {
    fontSize: 24,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  accountEmail: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  accountTypeBadge: {
    backgroundColor: COLORS.gradientStart + '30',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  accountTypeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gradientStart,
  },
  accountStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceLight,
    paddingTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statItemConnected: {
    borderLeftWidth: 1,
    borderLeftColor: COLORS.surfaceLight,
  },
  statValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  accountActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  accountActionButton: {
    backgroundColor: COLORS.surfaceLight,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  accountActionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
  },
  addAccountCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.surfaceLight,
  },
  addAccountIcon: {
    fontSize: 32,
    color: COLORS.gradientStart,
    marginBottom: SPACING.sm,
  },
  addAccountText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  addAccountDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  infoSection: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  infoTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 100,
  },
});