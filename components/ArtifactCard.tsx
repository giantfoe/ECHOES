import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';
import { MapPin, Clock } from 'lucide-react-native';
import { Artifact } from '@/mocks/artifacts';

interface ArtifactCardProps {
  artifact: Artifact;
}

export const ArtifactCard: React.FC<ArtifactCardProps> = ({ artifact }) => {
  const handlePress = () => {
    router.push(`/artifact/${artifact.id}`);
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
});

export default ArtifactCard;