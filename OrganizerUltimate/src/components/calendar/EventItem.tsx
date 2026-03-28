import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CalendarEvent } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { formatTimeRange } from '../../utils';
import { SPACING, FONT_SIZES } from '../../constants';

interface EventItemProps {
  event: CalendarEvent;
  onPress: (event: CalendarEvent) => void;
}

export const EventItem: React.FC<EventItemProps> = ({ event, onPress }) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      style={[styles.container, { borderLeftColor: event.color }]}
      onPress={() => onPress(event)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {event.title}
        </Text>
        {!event.allDay && (
          <Text style={[styles.time, { color: colors.textSecondary }]}>
            {formatTimeRange(event.startDate, event.endDate)}
          </Text>
        )}
        {event.location && (
          <Text style={[styles.location, { color: colors.textSecondary }]} numberOfLines={1}>
            📍 {event.location}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', padding: SPACING.md, borderLeftWidth: 4, borderRadius: 8, marginBottom: SPACING.sm },
  content: { flex: 1 },
  title: { fontSize: FONT_SIZES.md, fontWeight: '600', marginBottom: SPACING.xs },
  time: { fontSize: FONT_SIZES.sm, marginBottom: SPACING.xs },
  location: { fontSize: FONT_SIZES.sm },
});