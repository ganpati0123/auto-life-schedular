import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format, addDays, subDays } from 'date-fns';
import { useApp } from '../contexts/AppContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../utils/theme';

export function TaskManagerScreen({ navigation }: any) {
  const { state } = useApp();
  const { events, aiMeetingInsights } = state;
  
  const [selectedTab, setSelectedTab] = useState<'today' | 'upcoming' | 'completed'>('today');
  
  const allActionItems = aiMeetingInsights.flatMap((insight) => 
    insight.actionItems.map((item) => ({
      ...item,
      sourceEvent: insight.eventId,
    }))
  );

  const todayTasks = allActionItems.filter((task) => {
    if (!task.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate.toDateString() === today.toDateString();
  });

  const upcomingTasks = allActionItems.filter((task) => {
    if (!task.dueDate || task.isCompleted) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate > today;
  });

  const completedTasks = allActionItems.filter((task) => task.isCompleted);

  const getTasksForTab = () => {
    switch (selectedTab) {
      case 'today':
        return todayTasks;
      case 'upcoming':
        return upcomingTasks;
      case 'completed':
        return completedTasks;
      default:
        return [];
    }
  };

  const tasks = getTasksForTab();

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
          <Text style={styles.headerTitle}>Task Manager</Text>
          <TouchableOpacity>
            <Text style={styles.addButton}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{todayTasks.length}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{upcomingTasks.length}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{completedTasks.length}</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {(['today', 'upcoming', 'completed'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.tabActive]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {tasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              {selectedTab === 'completed' ? '🎉' : '📝'}
            </Text>
            <Text style={styles.emptyTitle}>
              {selectedTab === 'completed' ? 'All Done!' : 'No Tasks'}
            </Text>
            <Text style={styles.emptyDescription}>
              {selectedTab === 'completed' 
                ? 'You have completed all your tasks'
                : 'Tasks from your meetings will appear here'}
            </Text>
          </View>
        ) : (
          tasks.map((task) => (
            <TouchableOpacity key={task.id} style={styles.taskCard}>
              <View style={styles.taskCheckbox}>
                <Text style={styles.checkboxIcon}>
                  {task.isCompleted ? '✅' : '⬜'}
                </Text>
              </View>
              <View style={styles.taskContent}>
                <Text style={[
                  styles.taskTitle,
                  task.isCompleted && styles.taskTitleCompleted,
                ]}>
                  {task.title}
                </Text>
                {task.assignee && (
                  <Text style={styles.taskAssignee}>👤 {task.assignee}</Text>
                )}
                {task.dueDate && (
                  <Text style={styles.taskDueDate}>
                    📅 {format(new Date(task.dueDate), 'MMM d, yyyy')}
                  </Text>
                )}
              </View>
              <TouchableOpacity style={styles.taskAction}>
                <Text style={styles.taskActionIcon}>⋮</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}

        {/* Quick Add */}
        <View style={styles.quickAddSection}>
          <Text style={styles.quickAddTitle}>Quick Add Task</Text>
          <View style={styles.quickAddContainer}>
            <TextInput
              style={styles.quickAddInput}
              placeholder="Add a new task..."
              placeholderTextColor={COLORS.textMuted}
            />
            <TouchableOpacity style={styles.quickAddButton}>
              <Text style={styles.quickAddButtonText}>+</Text>
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
  backButton: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  addButton: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  tabsContainer: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  tabActive: {
    backgroundColor: COLORS.gradientStart,
  },
  tabText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  taskCheckbox: {
    marginRight: SPACING.md,
  },
  checkboxIcon: {
    fontSize: 24,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  taskAssignee: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  taskDueDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  taskAction: {
    padding: SPACING.sm,
  },
  taskActionIcon: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  quickAddSection: {
    marginTop: SPACING.lg,
  },
  quickAddTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  quickAddContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
  },
  quickAddInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    paddingHorizontal: SPACING.sm,
  },
  quickAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gradientStart,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAddButtonText: {
    fontSize: 24,
    color: COLORS.text,
    fontWeight: '300',
  },
  bottomPadding: {
    height: 100,
  },
});