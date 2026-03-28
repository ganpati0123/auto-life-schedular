import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { CalendarScreen, EmailScreen, AIScreen, SettingsScreen } from '../screens';
import { useTheme } from '../hooks/useTheme';
import { SPACING, FONT_SIZES } from '../constants';

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused, color }: { name: string; focused: boolean; color: string }) => {
  const icons: { [key: string]: string } = {
    Calendar: '📅',
    Email: '📧',
    'AI Assistant': '🤖',
    Settings: '⚙️',
  };
  
  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.icon, { opacity: focused ? 1 : 0.6 }]}>
        {icons[name] || '•'}
      </Text>
    </View>
  );
};

export const AppNavigator: React.FC = () => {
  const { colors } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: ({ focused, color }) => (
          <TabIcon name={route.name} focused={focused} color={color} />
        ),
        tabBarLabelStyle: {
          fontSize: FONT_SIZES.xs,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen 
        name="Calendar" 
        component={CalendarScreen}
        options={{
          title: 'Calendar',
          headerTitle: 'Organizer Ultimate',
        }}
      />
      <Tab.Screen 
        name="Email" 
        component={EmailScreen}
        options={{
          title: 'Email',
          headerTitle: 'Inbox',
        }}
      />
      <Tab.Screen 
        name="AI Assistant" 
        component={AIScreen}
        options={{
          title: 'AI',
          headerTitle: 'AI Assistant',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerTitle: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
  },
});
