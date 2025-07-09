import React from "react";
import { Tabs } from "expo-router";
import { theme } from "@/constants/theme";
import { StatusBar } from "@/components/StatusBar";
import { Compass, Plus, Archive, User } from "lucide-react-native";

export default function TabLayout() {
  return (
    <>
      <StatusBar />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.accent,
          tabBarInactiveTintColor: theme.colors.inactive,
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.border,
            height: 70,
            paddingBottom: 10,
          },
          tabBarLabelStyle: {
            fontFamily: 'monospace',
            fontSize: 12,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "DISCOVER ARTIFACTS",
            tabBarLabel: "DISCOVER",
            tabBarIcon: ({ color }) => <Compass size={26} color={color} />,
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            title: "CREATE ARTIFACT",
            tabBarLabel: "CREATE",
            tabBarIcon: ({ color }) => <Plus size={26} color={color} />,
          }}
        />
        <Tabs.Screen
          name="archive"
          options={{
            title: "ARTIFACT ARCHIVE",
            tabBarLabel: "ARCHIVE",
            tabBarIcon: ({ color }) => <Archive size={26} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "USER PROFILE",
            tabBarLabel: "PROFILE",
            tabBarIcon: ({ color }) => <User size={26} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}