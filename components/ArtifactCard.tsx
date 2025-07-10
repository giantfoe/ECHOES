import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '@/constants/theme';
import { MapPin, Clock, Heart, Bookmark } from 'lucide-react-native';
import { Artifact } from '@/mocks/artifacts';
import { ImageViewer } from './ImageViewer';
import * as Haptics from 'expo-haptics';

interface ArtifactCardProps {
  artifact: Artifact;
  onPreserve?: (artifactId: string, bonkAmount: number) => void;
  isPreserved?: boolean;
}

export const ArtifactCard: React.FC<ArtifactCardProps> = ({ artifact, onPreserve, isPreserved: initialPreserved = false }) => {

  const [isPreserved, setIsPreserved] = useState(initialPreserved);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  
  const maxDescriptionLength = 80;
  const shouldTruncate = artifact.description.length > maxDescriptionLength;
  const displayDescription = isDescriptionExpanded || !shouldTruncate 
    ? artifact.description 
    : artifact.description.substring(0, maxDescriptionLength) + '...';

  const handlePress = () => {
    setIsImageViewerVisible(true);
  };

  const handleCloseImageViewer = () => {
    setIsImageViewerVisible(false);
  };

  const handlePreserve = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newPreservedState = !isPreserved;
    setIsPreserved(newPreservedState);
    
    // When preserving, send 0.1 dollar's worth of BONK
    if (newPreservedState) {
      const bonkAmount = 0.1; // $0.1 worth of BONK
      onPreserve?.(artifact.id, bonkAmount);
    }
  };

  const handleSeeMore = (e: any) => {
    e.stopPropagation();
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
        {artifact.mediaUrl && (
          <Image source={{ uri: artifact.mediaUrl }} style={styles.image} />
        )}
        
        <View style={styles.overlay}>
          <View style={styles.contentInfo}>
            <Text style={styles.titleText}>{artifact.title}</Text>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>{displayDescription}</Text>
              {shouldTruncate && (
                <TouchableOpacity onPress={handleSeeMore} style={styles.seeMoreButton}>
                  <Text style={styles.seeMoreText}>
                    {isDescriptionExpanded ? 'See less' : 'See more'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.posterText}>by {artifact.creator.name}</Text>
          </View>
          
          <View style={styles.bottomRow}>
            <TouchableOpacity 
              style={[styles.preserveButton, isPreserved && styles.preserveButtonActive]} 
              onPress={handlePreserve}
              activeOpacity={0.7}
            >
              <Heart 
                size={16} 
                color={isPreserved ? '#FFFFFF' : theme.colors.accent}
                fill={isPreserved ? '#FFFFFF' : 'transparent'}
              />
              <Text style={[styles.preserveText, isPreserved && styles.preserveTextActive]}>
                {isPreserved ? 'Preserved' : 'Preserve'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
      
      <ImageViewer
        visible={isImageViewerVisible}
        artifact={artifact}
        onClose={handleCloseImageViewer}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 400,
    backgroundColor: theme.colors.border,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: theme.spacing.md,
  },
  contentInfo: {
    marginBottom: theme.spacing.sm,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs,
    fontFamily: 'Qurova',
  },
  descriptionContainer: {
    marginBottom: theme.spacing.xs,
  },
  descriptionText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
    fontFamily: 'Qurova',
    opacity: 0.9,
  },
  seeMoreButton: {
    marginTop: theme.spacing.xs,
  },
  seeMoreText: {
    fontSize: 12,
    color: theme.colors.accent,
    fontWeight: '600',
    fontFamily: 'Qurova',
  },
  posterText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontStyle: 'italic',
    fontFamily: 'Qurova',
    opacity: 0.8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontFamily: 'Qurova',
  },
  description: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
    fontFamily: 'Qurova',
  },
  metaContainer: {
    marginBottom: theme.spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  metaText: {
    fontSize: 12,
    color: theme.colors.secondaryText,
    marginLeft: theme.spacing.xs,
    fontFamily: 'Qurova',
  },
  creatorContainer: {
    marginBottom: theme.spacing.sm,
  },
  creatorText: {
    fontSize: 12,
    color: theme.colors.accent,
    fontStyle: 'italic',
    fontFamily: 'Qurova',
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  leftInfo: {
    flex: 1,
  },
  typeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.accent,
    fontFamily: 'Qurova',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  brightnessText: {
    fontSize: 12,
    color: theme.colors.secondaryText,
    fontFamily: 'Qurova',
  },
  preservationText: {
    fontSize: 12,
    color: theme.colors.accent,
    fontFamily: 'Qurova',
  },
  preserveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  preserveButtonActive: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  preserveText: {
    fontSize: 12,
    color: theme.colors.accent,
    marginLeft: theme.spacing.xs,
    fontFamily: 'Qurova',
    fontWeight: '600',
  },
  preserveTextActive: {
    color: '#FFFFFF',
  },
  bonkIndicator: {
    backgroundColor: theme.colors.accent + '20',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: theme.spacing.xs,
  },
  bonkIndicatorText: {
    fontSize: 11,
    color: theme.colors.accent,
    fontFamily: 'Qurova',
    fontWeight: '500',
  },
});

export default ArtifactCard;