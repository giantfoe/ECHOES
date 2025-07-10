import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { DiscoverFeed } from '@/components/DiscoverFeed';
import { StoriesCarousel, StoryViewer } from '@/components/Stories';
import { useArtifactStore } from '@/stores/artifactStore';
import { useStoryStore } from '@/stores/storyStore';
import { useStoryTimer } from '@/utils/storyTimer';
import { Story } from '@/types/Story';
import { Artifact } from '@/mocks/artifacts';
import { theme } from '@/constants/theme';
import { globalStyles } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function DiscoverScreen() {
  const router = useRouter();
  const { discoverArtifact } = useArtifactStore();
  const { activeStories, getStories } = useStoryStore();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [storyViewerVisible, setStoryViewerVisible] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  
  // Initialize story timer for cleanup
  useStoryTimer();
  
  useEffect(() => {
    getStories();
  }, []);
  
  const handleArtifactPress = (artifact: Artifact) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    discoverArtifact(artifact.id);
    router.push(`/artifact/${artifact.id}`);
  };
  
  const handleStoryPress = (story: Story, index: number) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setSelectedStory(story);
    setCurrentStoryIndex(index);
    setStoryViewerVisible(true);
  };
  
  const handleStoryViewerClose = () => {
    setStoryViewerVisible(false);
    setSelectedStory(null);
  };
  
  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <DiscoverFeed 
          onArtifactPress={handleArtifactPress}
          ListHeaderComponent={<StoriesCarousel onStoryPress={handleStoryPress} />}
        />
      </View>
      
      {storyViewerVisible && selectedStory && (
        <StoryViewer
          visible={storyViewerVisible}
          stories={activeStories}
          initialIndex={currentStoryIndex}
          onClose={handleStoryViewerClose}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});