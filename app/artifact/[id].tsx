import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { globalStyles } from '@/constants/theme';
import { theme } from '@/constants/theme';
import { useArtifactStore } from '@/stores/artifactStore';
import { Image } from 'expo-image';

import { BonkSlider } from '@/components/BonkSlider';
import { MapPin, Calendar, User, ArrowLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function ArtifactDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { nearbyArtifacts, currentArtifact, setCurrentArtifact } = useArtifactStore();
  const [artifact, setArtifact] = useState(currentArtifact);
  
  useEffect(() => {
    if (id) {
      const foundArtifact = nearbyArtifacts.find(a => a.id === id);
      if (foundArtifact) {
        setArtifact(foundArtifact);
        setCurrentArtifact(foundArtifact);
        
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      }
    }
    
    return () => {
      setCurrentArtifact(null);
    };
  }, [id, nearbyArtifacts]);
  
  if (!artifact) {
    return (
      <View style={[globalStyles.container, styles.centerContent]}>
        <Text style={styles.notFoundText}>Artifact not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>GO BACK</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const handlePreserve = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: artifact.title,
          headerBackTitle: "Back",
        }}
      />
      <ScrollView style={globalStyles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* Artifact image */}
          {artifact.mediaUrl && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: artifact.mediaUrl }}
                style={styles.image}
                contentFit="cover"
                transition={300}
              />
              <View style={styles.brightnessOverlay} />
              <View style={styles.imageInfo}>
                <View style={styles.brightnessContainer}>
                  <Text style={styles.brightnessLabel}>BRIGHTNESS</Text>
                  <View style={styles.brightnessBar}>
                    <View 
                      style={[
                        styles.brightnessFill, 
                        { width: `${artifact.brightness}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.brightnessValue}>{artifact.brightness}%</Text>
                </View>
              </View>
            </View>
          )}
          
          {/* Artifact details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.title}>{artifact.title}</Text>
            
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Calendar size={16} color={theme.colors.accent} />
                <Text style={styles.metaText}>
                  {formatDate(artifact.createdAt)}
                </Text>
              </View>
              
              <View style={styles.metaItem}>
                <MapPin size={16} color={theme.colors.accent} />
                <Text style={styles.metaText}>
                  {artifact.location.name}
                </Text>
              </View>
              
              <View style={styles.metaItem}>
                <User size={16} color={theme.colors.accent} />
                <Text style={styles.metaText}>
                  {artifact.creator.name}
                </Text>
              </View>
            </View>
            
            <Text style={styles.description}>
              {artifact.description}
            </Text>
          </View>
          
          {/* Link display */}
          {artifact.type === 'link' && artifact.linkUrl && (
            <View style={styles.detailsContainer}>
              <Text style={styles.linkLabel}>LINK</Text>
              <TouchableOpacity 
                style={styles.linkButton}
                onPress={() => {
                  // In a real app, you would open the URL
                  console.log('Opening link:', artifact.linkUrl);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.linkText} numberOfLines={1}>
                  {artifact.linkUrl}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Preservation */}
          <BonkSlider 
            label="Preservation Level"
            value={artifact.bonkPreservation || 0}
            onValueChange={handlePreserve}
            minimumValue={0}
            maximumValue={1000}
            step={10}
          />
          
          {/* Preservation stats */}
          <View style={styles.preservationStats}>
            <Text style={styles.preservationTitle}>PRESERVATION STATS</Text>
            <View style={styles.preservationDetails}>
              <Text style={styles.preservationText}>
                This artifact has been preserved with {artifact.bonkPreservation} BONK tokens.
              </Text>
              <Text style={styles.preservationSubtext}>
                Higher preservation ensures this memory remains bright for future explorers.
              </Text>
            </View>
          </View>
          
          {/* Back button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={16} color={theme.colors.accent} />
            <Text style={styles.backButtonText}>BACK TO SCANNER</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    fontFamily: 'monospace',
  },
  imageContainer: {
    position: 'relative',
    height: 250,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  brightnessOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `${theme.colors.background}20`,
  },
  imageInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.md,
    backgroundColor: `${theme.colors.background}80`,
  },
  brightnessContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brightnessLabel: {
    fontSize: 12,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
    fontFamily: 'monospace',
  },
  brightnessBar: {
    flex: 1,
    height: 4,
    backgroundColor: `${theme.colors.border}80`,
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: theme.spacing.sm,
  },
  brightnessFill: {
    height: '100%',
    backgroundColor: theme.colors.accent,
  },
  brightnessValue: {
    fontSize: 12,
    color: theme.colors.text,
    fontFamily: 'monospace',
  },
  detailsContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    fontFamily: 'monospace',
  },
  metaContainer: {
    marginBottom: theme.spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  metaText: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    marginLeft: theme.spacing.sm,
    fontFamily: 'monospace',
  },
  description: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
    fontFamily: 'monospace',
  },
  preservationStats: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  preservationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontFamily: 'monospace',
  },
  preservationDetails: {
    marginLeft: theme.spacing.sm,
  },
  preservationText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontFamily: 'monospace',
  },
  preservationSubtext: {
    fontSize: 12,
    color: theme.colors.secondaryText,
    fontFamily: 'monospace',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.accent,
    marginBottom: theme.spacing.xl,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButtonText: {
    color: theme.colors.accent,
    fontWeight: 'bold',
    marginLeft: theme.spacing.sm,
    fontSize: 14,
    fontFamily: 'monospace',
  },
  linkLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontFamily: 'monospace',
  },
  linkButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  linkText: {
    color: theme.colors.background,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
});