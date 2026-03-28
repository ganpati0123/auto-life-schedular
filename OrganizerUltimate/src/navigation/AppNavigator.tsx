import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';

import { DashboardScreen } from '../screens/DashboardScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { EmailScreen } from '../screens/EmailScreen';
import { MeetingsScreen } from '../screens/MeetingsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AIAssistantScreen } from '../screens/AIAssistantScreen';
import { EventDetailScreen } from '../screens/EventDetailScreen';
import { EmailDetailScreen } from '../screens/EmailDetailScreen';
import { CreateEventScreen } from '../screens/CreateEventScreen';
import { ComposeEmailScreen } from '../screens/ComposeEmailScreen';
import { YearViewScreen } from '../screens/YearViewScreen';
import { AddCalendarScreen } from '../screens/AddCalendarScreen';
import { EmailAccountsScreen } from '../screens/EmailAccountsScreen';
import { COLORS, FONT_SIZES } from '../utils/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.tabEmoji, focused && styles.tabEmojiActive]}>{icon}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardMain" component={DashboardScreen} />
      <Stack.Screen name="AIAssistant" component={AIAssistantScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
      <Stack.Screen name="EmailDetail" component={EmailDetailScreen} />
      <Stack.Screen name="ComposeEmail" component={ComposeEmailScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

function CalendarStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CalendarMain" component={CalendarScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
      <Stack.Screen name="AIAssistant" component={AIAssistantScreen} />
      <Stack.Screen name="YearView" component={YearViewScreen} />
      <Stack.Screen name="AddCalendar" component={AddCalendarScreen} />
    </Stack.Navigator>
  );
}

function EmailStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EmailMain" component={EmailScreen} />
      <Stack.Screen name="EmailDetail" component={EmailDetailScreen} />
      <Stack.Screen name="ComposeEmail" component={ComposeEmailScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EmailAccounts" component={EmailAccountsScreen} />
    </Stack.Navigator>
  );
}

function MeetingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MeetingsMain" component={MeetingsScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      <Stack.Screen name="AIAssistant" component={AIAssistantScreen} />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="🏠" label="Home" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="📅" label="Calendar" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Email"
          component={EmailStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="📧" label="Email" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Meetings"
          component={MeetingsStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="🎥" label="Meetings" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="⚙️" label="Settings" focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 0,
    height: 80,
    paddingBottom: 10,
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  tabEmojiActive: {
    fontSize: 26,
  },
  tabLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  tabLabelActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
});