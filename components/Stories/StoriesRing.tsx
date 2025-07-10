import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Story } from '../../types/Story';
import { theme } from '../../constants/theme';

interface StoriesRingProps {
  story: Story;
  size?: number;
  onPress: () => void;
  hasViewed?: boolean;
}

export const StoriesRing: React.FC<StoriesRingProps> = ({
  story,
  size = 70,
  onPress,
  hasViewed = false,
}) => {
  const ringSize = size;
  const imageSize = size - 8;
  const innerImageSize = imageSize - 4;

  const gradientColors = hasViewed 
    ? [theme.colors.border, theme.colors.border]
    : [theme.gradients.twilight.colors[0], theme.gradients.twilight.colors[1], theme.gradients.aurora.colors[0]];

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, { width: ringSize, height: ringSize }]}>
      {/* Outer gradient ring */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradientRing,
          {
            width: ringSize,
            height: ringSize,
            borderRadius: ringSize / 2,
          },
        ]}
      >
        {/* Inner white border */}
        <View
          style={[
            styles.innerBorder,
            {
              width: imageSize,
              height: imageSize,
              borderRadius: imageSize / 2,
            },
          ]}
        >
          {/* Story image */}
          <Image
            source={{ uri: story.imageUri }}
            style={[
              styles.storyImage,
              {
                width: innerImageSize,
                height: innerImageSize,
                borderRadius: innerImageSize / 2,
              },
            ]}
            resizeMode="cover"
          />
        </View>
      </LinearGradient>
      
      {/* Active indicator */}
      {story.isActive && (
        <View style={[styles.activeIndicator, { top: size * 0.1, right: size * 0.1 }]} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  gradientRing: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  innerBorder: {
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  storyImage: {
    backgroundColor: theme.colors.card,
  },
  activeIndicator: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.gradients.aurora.colors[0],
    borderWidth: 2,
    borderColor: theme.colors.background,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});