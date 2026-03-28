import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import { useApp } from '../contexts/AppContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../utils/theme';
import { Avatar } from '../components/ui';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  avatar?: string;
  lastInteraction?: Date;
  tags: string[];
}

// Sample contacts data
const sampleContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Connor',
    email: 'sarah.connor@techcorp.com',
    phone: '+1 555-123-4567',
    company: 'TechCorp',
    role: 'Project Manager',
    tags: ['work', 'important'],
    lastInteraction: new Date(),
  },
  {
    id: '2',
    name: 'Charlie Davis',
    email: 'charlie.davis@techcorp.com',
    phone: '+1 555-234-5678',
    company: 'TechCorp',
    role: 'Developer',
    tags: ['work'],
    lastInteraction: new Date(),
  },
  {
    id: '3',
    name: 'Emily Chen',
    email: 'emily.chen@startup.io',
    phone: '+1 555-345-6789',
    company: 'Startup.io',
    role: 'CEO',
    tags: ['personal', 'important'],
    lastInteraction: new Date(),
  },
  {
    id: '4',
    name: 'David Lee',
    email: 'david@client.com',
    phone: '+1 555-456-7890',
    company: 'Client Corp',
    role: 'Client Manager',
    tags: ['work', 'client'],
    lastInteraction: new Date(),
  },
  {
    id: '5',
    name: 'Mike Wilson',
    email: 'mike.wilson@vendor.com',
    phone: '+1 555-567-8901',
    company: 'Vendor Inc',
    role: 'Account Manager',
    tags: ['work', 'vendor'],
    lastInteraction: new Date(),
  },
  {
    id: '6',
    name: 'Mom',
    email: 'mom@family.com',
    phone: '+1 555-678-9012',
    company: '',
    role: '',
    tags: ['personal', 'family'],
    lastInteraction: new Date(),
  },
  {
    id: '7',
    name: 'Alice Johnson',
    email: 'alice@company.com',
    phone: '+1 555-789-0123',
    company: 'Company',
    role: 'Team Lead',
    tags: ['work'],
    lastInteraction: new Date(),
  },
  {
    id: '8',
    name: 'Bob Smith',
    email: 'bob@company.com',
    phone: '+1 555-890-1234',
    company: 'Company',
    role: 'Developer',
    tags: ['work'],
    lastInteraction: new Date(),
  },
];

export function ContactsScreen({ navigation }: any) {
  const [contacts, setContacts] = useState<Contact[]>(sampleContacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = [...new Set(contacts.flatMap((c) => c.tags))];

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = searchQuery
      ? contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesTag = selectedTag
      ? contact.tags.includes(selectedTag)
      : true;

    return matchesSearch && matchesTag;
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.contactCard}
      onPress={() => {}}
    >
      <Avatar name={item.name} size={50} />
      <View style={styles.contactInfo}>
        <View style={styles.contactHeader}>
          <Text style={styles.contactName}>{item.name}</Text>
          {item.tags.includes('important') && <Text style={styles.importantIcon}>⭐</Text>}
        </View>
        <Text style={styles.contactEmail}>{item.email}</Text>
        {item.company && (
          <Text style={styles.contactCompany}>
            {item.role && `${item.role} at `}{item.company}
          </Text>
        )}
        <View style={styles.contactTags}>
          {item.tags.map((tag) => (
            <View key={tag} style={styles.tagBadge}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.contactActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
          <Text style={styles.actionIcon}>📧</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
          <Text style={styles.actionIcon}>📞</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Contacts</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearButton}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tags Filter */}
        <View style={styles.tagsSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.tagFilter, !selectedTag && styles.tagFilterActive]}
              onPress={() => setSelectedTag(null)}
            >
              <Text style={[styles.tagFilterText, !selectedTag && styles.tagFilterTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            {allTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[styles.tagFilter, selectedTag === tag && styles.tagFilterActive]}
                onPress={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                <Text style={[styles.tagFilterText, selectedTag === tag && styles.tagFilterTextActive]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Contacts Count */}
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsCount}>
            {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Contacts List */}
        <FlatList
          data={filteredContacts}
          renderItem={renderContact}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />

        {/* Groups Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Groups</Text>
          <View style={styles.groupsGrid}>
            {allTags.map((tag) => {
              const count = contacts.filter((c) => c.tags.includes(tag)).length;
              return (
                <TouchableOpacity key={tag} style={styles.groupCard}>
                  <Text style={styles.groupIcon}>
                    {tag === 'work' ? '💼' : tag === 'personal' ? '🏠' : tag === 'family' ? '👨‍👩‍👧' : tag === 'important' ? '⭐' : '📁'}
                  </Text>
                  <Text style={styles.groupName}>{tag}</Text>
                  <Text style={styles.groupCount}>{count}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>📇</Text>
              <Text style={styles.quickActionText}>Import Contacts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>📤</Text>
              <Text style={styles.quickActionText}>Export</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>🔄</Text>
              <Text style={styles.quickActionText}>Sync</Text>
            </TouchableOpacity>
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
  addButton: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
  },
  addButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  clearButton: {
    fontSize: 16,
    color: COLORS.textMuted,
    padding: SPACING.xs,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  tagsSection: {
    marginBottom: SPACING.md,
  },
  tagFilter: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    marginRight: SPACING.sm,
  },
  tagFilterActive: {
    backgroundColor: COLORS.gradientStart,
  },
  tagFilterText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  tagFilterTextActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  resultsInfo: {
    marginBottom: SPACING.md,
  },
  resultsCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  contactInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  importantIcon: {
    fontSize: 14,
    marginLeft: SPACING.xs,
  },
  contactEmail: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  contactCompany: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  contactTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.xs,
  },
  tagBadge: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.xs,
  },
  tagText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  contactActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.xs,
  },
  actionIcon: {
    fontSize: 16,
  },
  section: {
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  groupsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  groupCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  groupIcon: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  groupName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  groupCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  quickActionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
  },
  bottomPadding: {
    height: 100,
  },
});