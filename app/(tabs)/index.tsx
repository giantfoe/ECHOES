import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { DiscoverFeed } from '@/components/DiscoverFeed';
import { useArtifactStore } from '@/stores/artifactStore';
import { theme } from '@/constants/theme';
import { globalStyles } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function DiscoverScreen() {
  const router = useRouter();
  const { discoverArtifact } = useArtifactStore();
  
  const handleArtifactPress = (artifactId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    discoverArtifact(artifactId);
    router.push(`/artifact/${artifactId}`);
  };
  
  return (
    <View style={globalStyles.container}>
      <SafeAreaView style={styles.container}>
        <DiscoverFeed onArtifactPress={handleArtifactPress} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});