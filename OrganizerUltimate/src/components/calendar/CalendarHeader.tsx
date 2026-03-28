import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useCalendarStore } from '../../store';
import { format } from 'date-fns';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants';

interface CalendarHeaderProps {
  onViewChange?: (view: any) => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ onViewChange }) => {
  const { colors } = useTheme();
  const { selectedDate, setSelectedDate, currentView, setCurrentView } = useCalendarStore();

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    switch (currentView) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
        break;
    }
    setSelectedDate(newDate);
  };

  const getTitle = () => {
    switch (currentView) {
      case 'day':
        return format(selectedDate, 'EEEE, MMMM d, yyyy');
      case 'week':
      case 'month':
        return format(selectedDate, 'MMMM yyyy');
      case 'year':
        return format(selectedDate, 'yyyy');
    }
  };

  const views = ['day', 'week', 'month', 'year'];
  
  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.navigation}>
        <TouchableOpacity onPress={() => navigateMonth('prev')} style={styles.navButton}>
          <Text style={[styles.navText, { color: colors.primary }]}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{getTitle()}</Text>
        <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.navButton}>
          <Text style={[styles.navText, { color: colors.primary }]}>›</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.viewSelector}>
        {views.map((view) => (
          <TouchableOpacity
            key={view}
            onPress={() => setCurrentView(view as any)}
            style={[
              styles.viewButton,
              currentView === view && { backgroundColor: colors.primary },
            ]}
          >
            <Text
              style={[
                styles.viewText,
                { color: currentView === view ? '#FFFFFF' : colors.text },
              ]}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: SPACING.md },
  navigation: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
  navButton: { padding: SPACING.sm },
  navText: { fontSize: 32, fontWeight: '300' },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: '600' },
  viewSelector: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.xs },
  viewButton: { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.md, borderRadius: BORDER_RADIUS.md },
  viewText: { fontSize: FONT_SIZES.sm, fontWeight: '500' },
});