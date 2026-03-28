import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet, Modal, TextInput, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useEmailStore } from '../store';
import { EmailItem, EmailDetail, ComposeEmail } from '../components/email';
import { EmptyState, IconButton, Button } from '../components/common';
import { EmailMessage } from '../types';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants';

export const EmailScreen: React.FC = () => {
  const { colors } = useTheme();
  const {
    messages,
    folders,
    currentFolder,
    setCurrentFolder,
    searchQuery,
    setSearchQuery,
    toggleStar,
    deleteMessage,
    setMessageRead,
  } = useEmailStore();
  
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  
  const filteredMessages = useMemo(() => {
    let filtered = messages.filter(m => m.folder === currentFolder);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.subject.toLowerCase().includes(query) ||
        m.body.toLowerCase().includes(query) ||
        m.from.email.toLowerCase().includes(query)
      );
    }
    
    return filtered.sort((a, b) => 
      new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
    );
  }, [messages, currentFolder, searchQuery]);
  
  const handleEmailPress = (email: EmailMessage) => {
    setSelectedEmail(email);
    setMessageRead(email.id, true);
  };
  
  const handleDelete = (id: string) => {
    deleteMessage(id);
    setSelectedEmail(null);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.background, color: colors.text }]}
          placeholder="Search emails..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <IconButton
          icon={<Text style={{ fontSize: 18 }}>✏️</Text>}
          onPress={() => setShowCompose(true)}
          size="small"
        />
      </View>
      
      <View style={styles.folderTabs}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={folders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.folderTab,
                { backgroundColor: currentFolder === item.id ? colors.primary : colors.surface },
              ]}
              onPress={() => setCurrentFolder(item.id)}
            >
              <Text
                style={[
                  styles.folderText,
                  { color: currentFolder === item.id ? '#FFFFFF' : colors.text },
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.folderTabsContent}
        />
      </View>
      
      {filteredMessages.length > 0 ? (
        <FlatList
          data={filteredMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EmailItem
              email={item}
              onPress={handleEmailPress}
              onStar={toggleStar}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={styles.emailList}
        />
      ) : (
        <EmptyState
          title="No Emails"
          description={`Your ${currentFolder} is empty`}
          action={
            <Button title="Compose" onPress={() => setShowCompose(true)} variant="primary" />
          }
        />
      )}
      
      <Modal
        visible={!!selectedEmail}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedEmail(null)}
      >
        {selectedEmail && (
          <EmailDetail
            email={selectedEmail}
            onReply={() => setShowCompose(true)}
            onForward={() => setShowCompose(true)}
            onDelete={() => handleDelete(selectedEmail.id)}
            onClose={() => setSelectedEmail(null)}
          />
        )}
      </Modal>
      
      <Modal
        visible={showCompose}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCompose(false)}
      >
        <ComposeEmail
          onClose={() => setShowCompose(false)}
          replyTo={selectedEmail}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    fontSize: FONT_SIZES.md,
  },
  folderTabs: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  folderTabsContent: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  folderTab: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.xs,
  },
  folderText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  emailList: {
    paddingBottom: SPACING.xxl,
  },
});