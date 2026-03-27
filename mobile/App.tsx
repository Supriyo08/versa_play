import React, { useState } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import LoginScreen from "./src/screens/LoginScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import TournamentsScreen from "./src/screens/TournamentsScreen";
import ScoringScreen from "./src/screens/ScoringScreen";
import BracketsScreen from "./src/screens/BracketsScreen";
import AnalyticsScreen from "./src/screens/AnalyticsScreen";
import ClubsScreen from "./src/screens/ClubsScreen";
import CommunityScreen from "./src/screens/CommunityScreen";
import SeriesScreen from "./src/screens/SeriesScreen";
import LiveScoringScreen from "./src/screens/LiveScoringScreen";
import LivestreamScreen from "./src/screens/LivestreamScreen";
import PlayerStatsScreen from "./src/screens/PlayerStatsScreen";
import SubscriptionScreen from "./src/screens/SubscriptionScreen";
import AdminScreen from "./src/screens/AdminScreen";
import AddPlayerScreen from "./src/screens/AddPlayerScreen";
import RosterScreen from "./src/screens/RosterScreen";
import MatchSetupScreen from "./src/screens/MatchSetupScreen";
import OfficialsScreen from "./src/screens/OfficialsScreen";
import SuperadminScreen from "./src/screens/SuperadminScreen";
import MoreScreen from "./src/screens/MoreScreen";
import { setAuthToken } from "./src/lib/api";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0f0f1a",
          borderTopColor: "#1e1e30",
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: "#c8ff00",
        tabBarInactiveTintColor: "#71717a",
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }} />
      <Tab.Screen name="Tournaments" component={TournamentsScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="trophy" size={size} color={color} /> }} />
      <Tab.Screen name="Clubs" component={ClubsScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }} />
      <Tab.Screen name="More" component={MoreScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} /> }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (token: string) => {
    setAuthToken(token);
    setIsLoggedIn(true);
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: "#c8ff00",
            background: "#0a0a0f",
            card: "#0f0f1a",
            text: "#e4e4e7",
            border: "#1e1e30",
            notification: "#ef4444",
          },
          fonts: {
            regular: { fontFamily: "System", fontWeight: "400" },
            medium: { fontFamily: "System", fontWeight: "500" },
            bold: { fontFamily: "System", fontWeight: "700" },
            heavy: { fontFamily: "System", fontWeight: "900" },
          },
        }}
      >
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            <>
              <Stack.Screen name="Main" component={MainTabs} />
              {/* Feature screens */}
              <Stack.Screen name="Scoring" component={ScoringScreen} />
              <Stack.Screen name="Brackets" component={BracketsScreen} />
              <Stack.Screen name="Analytics" component={AnalyticsScreen} />
              <Stack.Screen name="Community" component={CommunityScreen} />
              <Stack.Screen name="Series" component={SeriesScreen} />
              <Stack.Screen name="LiveScoring" component={LiveScoringScreen} />
              <Stack.Screen name="Livestream" component={LivestreamScreen} />
              <Stack.Screen name="PlayerStats" component={PlayerStatsScreen} />
              <Stack.Screen name="Subscription" component={SubscriptionScreen} />
              {/* Admin screens */}
              <Stack.Screen name="Admin" component={AdminScreen} />
              <Stack.Screen name="AddPlayer" component={AddPlayerScreen} />
              <Stack.Screen name="Roster" component={RosterScreen} />
              <Stack.Screen name="MatchSetup" component={MatchSetupScreen} />
              <Stack.Screen name="Officials" component={OfficialsScreen} />
              <Stack.Screen name="Superadmin" component={SuperadminScreen} />
            </>
          ) : (
            <Stack.Screen name="Login">
              {() => <LoginScreen onLogin={handleLogin} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
