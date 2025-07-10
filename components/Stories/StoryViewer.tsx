import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Modal,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Story } from '../../types/Story';
import { useStoryStore } from '../../stores/storyStore';
import { theme } from '../../constants/theme';
import { GlassCard } from '../GlassCard';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface StoryViewerProps {
  visible: boolean;
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
  currentUserId?: string;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  visible,
  stories,
  initialIndex,
  onClose,
  currentUserId = 'current_user',
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const progressRef = useRef<Animated.Value>(new Animated.Value(0));
  const translateY = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  
  const { viewStory, likeStory } = useStoryStore();
  
  const currentStory = stories[currentIndex];
  const STORY_DURATION = 5000; // 5 seconds per story

  useEffect(() => {
    if (visible && currentStory) {
      // Mark story as viewed
      viewStory(currentStory.id, currentUserId);
      
      // Check if already liked
      setIsLiked(currentStory.likes.includes(currentUserId));
      
      // Start progress animation
      startProgressAnimation();
    }
    
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [visible, currentIndex, currentStory]);

  const startProgressAnimation = () => {
    progressRef.current.setValue(0);
    setProgress(0);
    
    animationRef.current = Animated.timing(progressRef.current, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    });
    
    const listener = progressRef.current.addListener(({ value }) => {
      setProgress(value);
    });
    
    animationRef.current.start(({ finished }) => {
      progressRef.current.removeListener(listener);
      if (finished && !isPaused) {
        nextStory();
      }
    });
  };

  const pauseProgress = () => {
    setIsPaused(true);
    if (animationRef.current) {
      animationRef.current.stop();
    }
  };

  const resumeProgress = () => {
    setIsPaused(false);
    const remainingDuration = STORY_DURATION * (1 - progress);
    
    animationRef.current = Animated.timing(progressRef.current, {
      toValue: 1,
      duration: remainingDuration,
      useNativeDriver: false,
    });
    
    const listener = progressRef.current.addListener(({ value }) => {
      setProgress(value);
    });
    
    animationRef.current.start(({ finished }) => {
      progressRef.current.removeListener(listener);
      if (finished && !isPaused) {
        nextStory();
      }
    });
  };

  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const previousStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleLike = async () => {
    if (currentStory) {
      await likeStory(currentStory.id, currentUserId);
      setIsLiked(!isLiked);
    }
  };

  const handlePanGesture = (event: any) => {
    const { translationY } = event.nativeEvent;
    
    if (translationY > 100) {
      onClose();
    }
  };

  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    }
    
    return `${hours}h ago`;
  };

  if (!visible || !currentStory) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar hidden />
      <PanGestureHandler onGestureEvent={handlePanGesture}>
        <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
          {/* Background Image */}
          <Image
            source={{ uri: currentStory.imageUri }}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
          
          {/* Gradient Overlay */}
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.6)']}
            style={styles.gradientOverlay}
          />
          
          {/* Progress Bars */}
          <SafeAreaView style={styles.progressContainer}>
            <View style={styles.progressBars}>
              {stories.map((_, index) => (
                <View key={index} style={styles.progressBarBackground}>
                  <Animated.View
                    style={[
                      styles.progressBarFill,
                      {
                        width:
                          index < currentIndex
                            ? '100%'
                            : index === currentIndex
                            ? progressRef.current.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%'],
                              })
                            : '0%',
                      },
                    ]}
                  />
                </View>
              ))}
            </View>
          </SafeAreaView>
          
          {/* Header */}
          <SafeAreaView style={styles.header}>
            <GlassCard style={styles.headerContent}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>User {currentStory.userId}</Text>
                <Text style={styles.timeAgo}>{formatTimeAgo(currentStory.createdAt)}</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </GlassCard>
          </SafeAreaView>
          
          {/* Text Overlay */}
          {currentStory.textOverlay && (
            <View
              style={[
                styles.textOverlay,
                {
                  left: currentStory.textOverlay.position.x,
                  top: currentStory.textOverlay.position.y,
                },
              ]}
            >
              <Text
                style={[
                  styles.overlayText,
                  {
                    color: currentStory.textOverlay.color,
                    fontSize: currentStory.textOverlay.fontSize,
                  },
                ]}
              >
                {currentStory.textOverlay.text}
              </Text>
            </View>
          )}
          
          {/* Story Content */}
          {(currentStory.title || currentStory.description) && (
            <View style={styles.contentContainer}>
              <GlassCard style={styles.contentCard}>
                {currentStory.title && (
                  <Text style={styles.storyTitle}>{currentStory.title}</Text>
                )}
                {currentStory.description && (
                  <Text style={styles.storyDescription}>{currentStory.description}</Text>
                )}
              </GlassCard>
            </View>
          )}
          
          {/* Interaction Area */}
          <View style={styles.interactionArea}>
            {/* Left tap area - previous story */}
            <TouchableOpacity
              style={styles.tapArea}
              onPress={previousStory}
              onPressIn={pauseProgress}
              onPressOut={resumeProgress}
            />
            
            {/* Right tap area - next story */}
            <TouchableOpacity
              style={styles.tapArea}
              onPress={nextStory}
              onPressIn={pauseProgress}
              onPressOut={resumeProgress}
            />
          </View>
          
          {/* Bottom Actions */}
          <SafeAreaView style={styles.bottomActions}>
            <View style={styles.actionsContainer}>
              <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={28}
                  color={isLiked ? theme.gradients.aurora.colors[0] : theme.colors.text}
                />
                <Text style={styles.actionText}>{currentStory.likes.length}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="eye" size={28} color={theme.colors.text} />
                <Text style={styles.actionText}>{currentStory.viewCount}</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      </PanGestureHandler>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backgroundImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'absolute',
  },
  gradientOverlay: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  progressContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  progressBars: {
    flexDirection: 'row',
    gap: 4,
  },
  progressBarBackground: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.text,
    borderRadius: 1.5,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 70,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  timeAgo: {
    fontSize: 12,
    color: theme.colors.secondaryText,
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  textOverlay: {
    position: 'absolute',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  contentContainer: {
    position: 'absolute',
    bottom: 120,
    left: 16,
    right: 16,
  },
  contentCard: {
    padding: 16,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  storyDescription: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    lineHeight: 20,
  },
  interactionArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  tapArea: {
    flex: 1,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    fontSize: 12,
    color: theme.colors.secondaryText,
    marginTop: 4,
  },
});