import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import { useApp } from '../contexts/AppContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../utils/theme';

type SearchResultType = 'event' | 'email' | 'contact';

interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  date?: Date;
  icon: string;
}

export function SearchScreen({ navigation }: any) {
  const { state } = useApp();
  const { events, emails } = state;

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search events
    events.forEach((event) => {
      if (
        event.title.toLowerCase().includes(lowerQuery) ||
        event.description?.toLowerCase().includes(lowerQuery) ||
        event.location?.toLowerCase().includes(lowerQuery)
      ) {
        searchResults.push({
          id: event.id,
          type: 'event',
          title: event.title,
          subtitle: event.location || format(new Date(event.startTime), 'MMM d, yyyy'),
          date: new Date(event.startTime),
          icon: '📅',
        });
      }
    });

    // Search emails
    emails.forEach((email) => {
      if (
        email.subject.toLowerCase().includes(lowerQuery) ||
        email.from.name.toLowerCase().includes(lowerQuery) ||
        email.from.email.toLowerCase().includes(lowerQuery) ||
        email.body.toLowerCase().includes(lowerQuery)
      ) {
        searchResults.push({
          id: email.id,
          type: 'email',
          title: email.subject,
          subtitle: `${email.from.name} • ${format(new Date(email.date), 'MMM d')}`,
          date: new Date(email.date),
          icon: '📧',
        });
      }
    });

    setResults(searchResults);
    setHasSearched(true);
  };

  const handleResultPress = (result: SearchResult) => {
    if (result.type === 'event') {
      navigation.navigate('CalendarStack', { 
        screen: 'EventDetail', 
        params: { eventId: result.id } 
      });
    } else if (result.type === 'email') {
      navigation.navigate('EmailStack', { 
        screen: 'EmailDetail', 
        params: { emailId: result.id } 
      });
    }
  };

  const renderResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() => handleResultPress(item)}
    >
      <View style={styles.resultIcon}>
        <Text style={styles.iconText}>{item.icon}</Text>
      </View>
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.resultSubtitle} numberOfLines={1}>{item.subtitle}</Text>
      </View>
      <Text style={styles.resultType}>
        {item.type === 'event' ? '📅' : item.type === 'email' ? '📧' : '👤'}
      </Text>
    </TouchableOpacity>
  );

  // Quick filters
  const quickSearches = [
    { label: 'Meetings today', query: 'meeting', icon: '📅' },
    { label: 'Unread emails', query: 'unread', icon: '📧' },
    { label: 'Starred items', query: 'starred', icon: '⭐' },
  ];

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
          <Text style={styles.headerTitle}>Search</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search events, emails..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Text style={styles.clearButton}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!hasSearched ? (
          <>
            {/* Quick Searches */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Search</Text>
              {quickSearches.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickSearchItem}
                  onPress={() => handleSearch(item.query)}
                >
                  <Text style={styles.quickSearchIcon}>{item.icon}</Text>
                  <Text style={styles.quickSearchLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Recent Searches (placeholder) */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent</Text>
              <View style={styles.emptyRecent}>
                <Text style={styles.emptyRecentText}>Your recent searches will appear here</Text>
              </View>
            </View>

            {/* Search Tips */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Search Tips</Text>
              <View style={styles.tipsCard}>
                <View style={styles.tipItem}>
                  <Text style={styles.tipIcon}>💡</Text>
                  <Text style={styles.tipText}>Search for event titles, locations, or descriptions</Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipIcon}>📧</Text>
                  <Text style={styles.tipText}>Find emails by sender, subject, or content</Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipIcon}>🔍</Text>
                  <Text style={styles.tipText}>Use keywords like "meeting", "project", or "invoice"</Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsCount}>
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </Text>
            
            {results.length > 0 ? (
              <FlatList
                data={results}
                renderItem={renderResult}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.noResults}>
                <Text style={styles.noResultsIcon}>🔍</Text>
                <Text style={styles.noResultsTitle}>No Results</Text>
                <Text style={styles.noResultsText}>
                  Try different keywords or check your spelling
                </Text>
              </View>
            )}
          </View>
        )}

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
  backButton: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
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
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
  },
  quickSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  quickSearchIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  quickSearchLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  emptyRecent: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  emptyRecentText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  tipsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  tipIcon: {
    fontSize: 18,
    marginRight: SPACING.md,
  },
  tipText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  resultsSection: {
    flex: 1,
  },
  resultsCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  resultIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  iconText: {
    fontSize: 20,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: 2,
  },
  resultSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  resultType: {
    fontSize: 18,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  noResultsIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  noResultsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  noResultsText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 100,
  },
});