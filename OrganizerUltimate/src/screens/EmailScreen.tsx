import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../contexts/AppContext';
import { EmailList } from '../components/email/EmailItem';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../utils/theme';

const FOLDERS = [
  { id: 'inbox', name: 'Inbox', icon: '📥' },
  { id: 'sent', name: 'Sent', icon: '📤' },
  { id: 'drafts', name: 'Drafts', icon: '📝' },
  { id: 'trash', name: 'Trash', icon: '🗑️' },
  { id: 'spam', name: 'Spam', icon: '🚫' },
];

export function EmailScreen({ navigation }: any) {
  const { state, setSelectedEmailFolder, toggleEmailStar, markEmailAsRead } = useApp();
  const { emailAccounts, emails, emailLabels, selectedEmailAccountId, selectedEmailFolder } = state;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const currentAccount = emailAccounts.find((a) => a.id === selectedEmailAccountId);
  
  const filteredEmails = useMemo(() => {
    let filtered = emails.filter(
      (e) => e.accountId === selectedEmailAccountId && e.folder === selectedEmailFolder
    );
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.subject.toLowerCase().includes(query) ||
          e.from.name.toLowerCase().includes(query) ||
          e.from.email.toLowerCase().includes(query) ||
          e.body.toLowerCase().includes(query)
      );
    }
    
    if (selectedLabel) {
      filtered = filtered.filter((e) => e.labels.includes(selectedLabel));
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [emails, selectedEmailAccountId, selectedEmailFolder, searchQuery, selectedLabel]);

  const handleEmailPress = (email: any) => {
    markEmailAsRead(email.id);
    navigation.navigate('EmailDetail', { emailId: email.id });
  };

  const getUnreadCount = (folder: string) => {
    return emails.filter(
      (e) => e.accountId === selectedEmailAccountId && e.folder === folder && !e.isRead
    ).length;
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
          <Text style={styles.headerTitle}>Email</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.navigate('ComposeEmail')}
            >
              <Text style={styles.headerButtonText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.navigate('EmailAccounts')}
            >
              <Text style={styles.headerButtonText}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountSelector}>
          {emailAccounts.map((account) => (
            <TouchableOpacity
              key={account.id}
              style={[
                styles.accountTab,
                selectedEmailAccountId === account.id && styles.accountTabActive,
              ]}
              onPress={() => state.dispatch({ type: 'SET_SELECTED_EMAIL_ACCOUNT', payload: account.id })}
            >
              <Text style={styles.accountEmail} numberOfLines={1}>
                {account.email.split('@')[0]}
              </Text>
              {account.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{account.unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search emails..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <View style={styles.mainContent}>
        {/* Folder Sidebar */}
        <View style={styles.sidebar}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {FOLDERS.map((folder) => (
              <TouchableOpacity
                key={folder.id}
                style={[
                  styles.folderItem,
                  selectedEmailFolder === folder.id && styles.folderItemActive,
                ]}
                onPress={() => setSelectedEmailFolder(folder.id)}
              >
                <Text style={styles.folderIcon}>{folder.icon}</Text>
                <Text
                  style={[
                    styles.folderName,
                    selectedEmailFolder === folder.id && styles.folderNameActive,
                  ]}
                >
                  {folder.name}
                </Text>
                {getUnreadCount(folder.id) > 0 && (
                  <View style={styles.folderBadge}>
                    <Text style={styles.folderBadgeText}>{getUnreadCount(folder.id)}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}

            {/* Labels Section */}
            <View style={styles.labelsSection}>
              <Text style={styles.labelsSectionTitle}>Labels</Text>
              {emailLabels.map((label) => (
                <TouchableOpacity
                  key={label.id}
                  style={[
                    styles.labelItem,
                    selectedLabel === label.id && styles.labelItemActive,
                  ]}
                  onPress={() => setSelectedLabel(selectedLabel === label.id ? null : label.id)}
                >
                  <View style={[styles.labelDot, { backgroundColor: label.color }]} />
                  <Text style={styles.labelName}>{label.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Email List */}
        <View style={styles.emailListContainer}>
          <View style={styles.emailListHeader}>
            <Text style={styles.emailListTitle}>
              {FOLDERS.find((f) => f.id === selectedEmailFolder)?.name || 'Inbox'}
            </Text>
            <Text style={styles.emailCount}>{filteredEmails.length} emails</Text>
          </View>
          <EmailList
            emails={filteredEmails}
            labels={emailLabels}
            onEmailPress={handleEmailPress}
            onStarPress={(email) => toggleEmailStar(email.id)}
          />
        </View>
      </View>
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
    paddingHorizontal: SPACING.md,
    borderBottomLeftRadius: BORDER_RADIUS.xxl,
    borderBottomRightRadius: BORDER_RADIUS.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
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
  accountSelector: {
    marginBottom: SPACING.md,
  },
  accountTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    marginRight: SPACING.sm,
  },
  accountTabActive: {
    backgroundColor: COLORS.text,
  },
  accountEmail: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    maxWidth: 100,
  },
  unreadBadge: {
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: SPACING.xs,
  },
  unreadBadgeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  clearIcon: {
    fontSize: 16,
    color: COLORS.textMuted,
    padding: SPACING.xs,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 100,
    backgroundColor: COLORS.surfaceLight,
    paddingTop: SPACING.md,
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    marginBottom: 4,
    borderRadius: BORDER_RADIUS.md,
  },
  folderItemActive: {
    backgroundColor: COLORS.gradientStart,
  },
  folderIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  folderName: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  folderNameActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  folderBadge: {
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 'auto',
  },
  folderBadgeText: {
    fontSize: 10,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  labelsSection: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },
  labelsSectionTitle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  labelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    marginBottom: 2,
  },
  labelItemActive: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.xs,
  },
  labelDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.xs,
  },
  labelName: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  emailListContainer: {
    flex: 1,
  },
  emailListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  emailListTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  emailCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
});