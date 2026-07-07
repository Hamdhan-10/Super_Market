import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';

// Import screens
import PredictScreen  from './src/screens/PredictScreen';
import ResultScreen   from './src/screens/ResultScreen';
import HistoryScreen  from './src/screens/HistoryScreen';
import DashboardScreen from './src/screens/DashboardScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor  : '#02C39A',
          tabBarInactiveTintColor: '#888888',
          tabBarStyle: {
            backgroundColor: '#1E2761',
            borderTopColor : '#2E3771',
            paddingBottom  : 5,
            height         : 60,
          },
          headerStyle: {
            backgroundColor: '#1E2761',
          },
          headerTintColor    : '#FFFFFF',
          headerTitleStyle   : { fontWeight: 'bold' },
        }}
      >
        <Tab.Screen
          name="Predict"
          component={PredictScreen}
          options={{
            title   : 'Predict',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🔮</Text>,
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            title   : 'History',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📊</Text>,
          }}
        />
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            title   : 'Dashboard',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📈</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}