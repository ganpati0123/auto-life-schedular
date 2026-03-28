import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useAIStore } from '../store';
import { AIChat, TaskItem } from '../components/ai';
import { Button, Input, Card } from '../components/common';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants';

export const AIScreen: React.FC = () => {
  const { colors } = useTheme();
  const { tasks, addTask, completeTask, deleteTask, suggestions, acceptSuggestion, dismissSuggestion } = useAIStore();
  const [activeTab, setActiveTab] = useState<'chat' | 'tasks'>('chat');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    
    addTask({
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim(),
      priority: newTaskPriority,
      status: 'pending',
    });
    
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskPriority('medium');
    setShowAddTask(false);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.tabs, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chat' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          onPress={() => setActiveTab('chat')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'chat' ? colors.primary : colors.text }]}>
            AI Chat
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tasks' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          onPress={() => setActiveTab('tasks')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'tasks' ? colors.primary : colors.text }]}>
            Tasks ({pendingTasks.length})
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'chat' ? (
        <AIChat />
      ) : (
        <ScrollView style={styles.tasksContent}>
          {suggestions.length > 0 && (
            <View style={styles.suggestions}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Suggestions</Text>
              {suggestions.map((suggestion) => (
                <Card key={suggestion.id} style={styles.suggestionCard}>
                  <Text style={[styles.suggestionTitle, { color: colors.text }]}>{suggestion.title}</Text>
                  <Text style={[styles.suggestionReason, { color: colors.textSecondary }]}>
                    {suggestion.reason}
                  </Text>
                  <View style={styles.suggestionActions}>
                    <Button title="Accept" onPress={() => acceptSuggestion(suggestion.id)} size="small" />
                    <Button title="Dismiss" onPress={() => dismissSuggestion(suggestion.id)} variant="outline" size="small" />
                  </View>
                </Card>
              ))}
            </View>
          )}
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Pending Tasks</Text>
            {pendingTasks.length > 0 ? (
              pendingTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={completeTask}
                  onPress={() => {}}
                  onDelete={deleteTask}
                />
              ))
            ) : (
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No pending tasks</Text>
            )}
          </View>
          
          {completedTasks.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Completed</Text>
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={completeTask}
                  onPress={() => {}}
                  onDelete={deleteTask}
                />
              ))}
            </View>
          )}
          
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowAddTask(true)}
          >
            <Text style={styles.addButtonText}>+ Add Task</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
      
      <Modal
        visible={showAddTask}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddTask(false)}
      >
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>New Task</Text>
          
          <Input
            label="Title"
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            placeholder="Task title"
          />
          
          <Input
            label="Description"
            value={newTaskDescription}
            onChangeText={setNewTaskDescription}
            placeholder="Task description"
            multiline
          />
          
          <Text style={[styles.label, { color: colors.text }]}>Priority</Text>
          <View style={styles.prioritySelector}>
            {(['low', 'medium', 'high'] as const).map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.priorityOption, { backgroundColor: newTaskPriority === p ? colors.primary : colors.surface }]}
                onPress={() => setNewTaskPriority(p)}
              >
                <Text style={{ color: newTaskPriority === p ? '#FFFFFF' : colors.text }}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={() => setShowAddTask(false)} variant="outline" style={styles.modalButton} />
            <Button title="Add Task" onPress={handleAddTask} variant="primary" style={styles.modalButton} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  tab: { flex: 1, paddingVertical: SPACING.md, alignItems: 'center' },
  tabText: { fontSize: FONT_SIZES.md, fontWeight: '500' },
  tasksContent: { flex: 1, padding: SPACING.md },
  section: { marginBottom: SPACING.lg },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: '600', marginBottom: SPACING.md },
  emptyText: { fontSize: FONT_SIZES.md, fontStyle: 'italic' },
  suggestions: { marginBottom: SPACING.lg },
  suggestionCard: { marginBottom: SPACING.sm },
  suggestionTitle: { fontSize: FONT_SIZES.md, fontWeight: '600', marginBottom: SPACING.xs },
  suggestionReason: { fontSize: FONT_SIZES.sm, marginBottom: SPACING.sm },
  suggestionActions: { flexDirection: 'row', gap: SPACING.sm },
  addButton: { padding: SPACING.md, borderRadius: BORDER_RADIUS.md, alignItems: 'center', marginTop: SPACING.md, marginBottom: SPACING.xxl },
  addButtonText: { color: '#FFFFFF', fontSize: FONT_SIZES.md, fontWeight: '600' },
  modalContent: { flex: 1, padding: SPACING.md },
  modalTitle: { fontSize: FONT_SIZES.xxl, fontWeight: '600', marginBottom: SPACING.lg },
  label: { fontSize: FONT_SIZES.sm, fontWeight: '500', marginBottom: SPACING.xs },
  prioritySelector: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  priorityOption: { flex: 1, padding: SPACING.md, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
  modalButtons: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.lg },
  modalButton: { flex: 1 },
});