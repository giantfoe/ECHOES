import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';
import { MapPin, Clock, Heart, Bookmark } from 'lucide-react-native';
import { Artifact } from '@/mocks/artifacts';
import * as Haptics from 'expo-haptics';

interface ArtifactCardProps {
  artifact: Artifact;
  onDonate?: (artifactId: string) => void;
  onPreserve?: (artifactId: string) => void;
  isDonated?: boolean;
}

export const ArtifactCard: React.FC<ArtifactCardProps> = ({ artifact, onDonate, onPreserve, isDonated = false }) => {

  const [isPreserved, setIsPreserved] = useState(false);

  const handlePress = () => {
    router.push(`/artifact/${artifact.id}`);
  };

  const handleDonate = () => {
    onDonate?.(artifact.id);
  };

  const handlePreserve = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsPreserved(!isPreserved);
    onPreserve?.(artifact.id);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      {artifact.mediaUrl && (
        <Image source={{ uri: artifact.mediaUrl }} style={styles.image} />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{artifact.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{artifact.description}</Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <MapPin size={12} color={theme.colors.secondaryText} />
            <Text style={styles.metaText}>{artifact.location.name}</Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={12} color={theme.colors.secondaryText} />
            <Text style={styles.metaText}>{new Date(artifact.createdAt).toLocaleDateString()}</Text>
          </View>
        </View>
        
        <View style={styles.creatorContainer}>
          <Text style={styles.creatorText}>by {artifact.creator.name}</Text>
        </View>
        
        <View style={styles.typeContainer}>
          <Text style={styles.typeText}>{artifact.type.toUpperCase()}</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.brightnessText}>{artifact.brightness}% BRIGHT</Text>
            <Text style={styles.preservationText}>{artifact.bonkPreservation} BONK</Text>
          </View>
        </View>
        
        {/* Action buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleDonate}
            activeOpacity={0.7}
          >
            <Heart 
              size={20} 
              color={isDonated ? '#FF3B30' : theme.colors.secondaryText}
              fill={isDonated ? '#FF3B30' : 'transparent'}
            />
            <Text style={[styles.actionText, isDonated && styles.actionTextActive]}>Donate</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handlePreserve}
            activeOpacity={0.7}
          >
            <Bookmark 
              size={20} 
              color={isPreserved ? theme.colors.accent : theme.colors.secondaryText}
              fill={isPreserved ? theme.colors.accent : 'transparent'}
            />
            <Text style={[styles.actionText, isPreserved && styles.actionTextActive]}>Preserve</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
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
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: theme.colors.border,
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontFamily: 'monospace',
  },
  description: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
    fontFamily: 'monospace',
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
    fontFamily: 'monospace',
  },
  creatorContainer: {
    marginBottom: theme.spacing.sm,
  },
  creatorText: {
    fontSize: 12,
    color: theme.colors.accent,
    fontStyle: 'italic',
    fontFamily: 'monospace',
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.accent,
    fontFamily: 'monospace',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  brightnessText: {
    fontSize: 12,
    color: theme.colors.secondaryText,
    fontFamily: 'monospace',
  },
  preservationText: {
    fontSize: 12,
    color: theme.colors.accent,
    fontFamily: 'monospace',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'transparent',
  },
  actionText: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    marginLeft: theme.spacing.xs,
    fontFamily: 'monospace',
    fontWeight: '500',
  },
  actionTextActive: {
    color: theme.colors.accent,
    fontWeight: '600',
  },
});

export default ArtifactCard;