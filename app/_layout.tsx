import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { theme } from "@/constants/theme";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after a delay
    const hideSplash = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await SplashScreen.hideAsync();
    };
    
    hideSplash();
  }, []);

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="artifact/[id]" 
          options={{ 
            title: "Artifact Details",
            presentation: "card",
          }} 
        />
      </Stack>
    </>
  );
}