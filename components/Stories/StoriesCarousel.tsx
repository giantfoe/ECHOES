import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { StoriesRing } from './StoriesRing';
import { useStoryStore } from '../../stores/storyStore';
import { Story } from '../../types/Story';
import { theme } from '../../constants/theme';
import { GlassCard } from '../GlassCard';

interface StoriesCarouselProps {
  onStoryPress: (story: Story, index: number) => void;
  currentUserId?: string;
}

export const StoriesCarousel: React.FC<StoriesCarouselProps> = ({
  onStoryPress,
  currentUserId = 'current_user',
}) => {
  const { 
    activeStories, 
    getActiveStories, 
    cleanupExpiredStories,
    isLoading 
  } = useStoryStore();

  useEffect(() => {
    const loadStories = async () => {
      await cleanupExpiredStories();
      await getActiveStories();
    };
    
    loadStories();
    
    // Set up periodic cleanup
    const interval = setInterval(cleanupExpiredStories, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const hasViewedStory = (story: Story): boolean => {
    return story.viewers.includes(currentUserId);
  };

  if (isLoading) {
    return (
      <GlassCard style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading stories...</Text>
      </GlassCard>
    );
  }

  if (activeStories.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Stories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {activeStories.map((story, index) => (
          <StoriesRing
            key={story.id}
            story={story}
            size={70}
            hasViewed={hasViewedStory(story)}
            onPress={() => onStoryPress(story, index)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.sm,
    alignItems: 'center',
  },
  loadingContainer: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.secondaryText,
    fontSize: 14,
  },
});