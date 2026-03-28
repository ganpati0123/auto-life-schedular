import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { IconButton } from '../common';
import { formatDate } from '../../utils';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onPress: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onPress, onDelete }) => {
  const { colors } = useTheme();
  
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
    }
  };
  
  const isCompleted = task.status === 'completed';
  
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => onPress(task)}
      activeOpacity={0.7}
    >
      <TouchableOpacity
        style={[styles.checkbox, { borderColor: getPriorityColor() }]}
        onPress={() => onToggle(task.id)}
      >
        {isCompleted && <View style={[styles.checkmark, { backgroundColor: colors.success }]} />}
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: colors.text },
            isCompleted && styles.completed,
          ]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        
        {task.description && (
          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
            {task.description}
          </Text>
        )}
        
        <View style={styles.meta}>
          <View style={[styles.priority, { backgroundColor: getPriorityColor() }]}>
            <Text style={styles.priorityText}>{task.priority}</Text>
          </View>
          
          {task.dueDate && (
            <Text style={[styles.dueDate, { color: colors.textSecondary }]}>
              Due: {formatDate(task.dueDate, 'MMM d')}
            </Text>
          )}
        </View>
      </View>
      
      <IconButton
        icon={<Text style={{ fontSize: 16 }}>🗑️</Text>}
        onPress={() => onDelete(task.id)}
        size="small"
        variant="ghost"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  checkmark: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  description: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.xs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  priority: {
    paddingVertical: 2,
    paddingHorizontal: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  dueDate: {
    fontSize: FONT_SIZES.xs,
  },
});
