import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { globalStyles } from '@/constants/theme';
import { theme } from '@/constants/theme';
import { useArtifactStore } from '@/stores/artifactStore';
import { Image } from 'expo-image';

import { MapPin, Calendar, User, ArrowLeft, Heart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function ArtifactDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { nearbyArtifacts, currentArtifact, setCurrentArtifact, preserveArtifact } = useArtifactStore();
  const [artifact, setArtifact] = useState(currentArtifact);
  const [isPreserved, setIsPreserved] = useState(false);
  
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newPreservedState = !isPreserved;
    setIsPreserved(newPreservedState);
    
    // When preserving, send 0.1 dollar's worth of BONK
    if (newPreservedState) {
      const bonkAmount = 0.1; // $0.1 worth of BONK
      preserveArtifact(artifact.id, bonkAmount);
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
          
          {/* Preserve Button */}
          <View style={styles.preserveContainer}>
            <TouchableOpacity 
              style={[styles.preserveButton, isPreserved && styles.preserveButtonActive]} 
              onPress={handlePreserve}
              activeOpacity={0.7}
            >
              <Heart 
                size={20} 
                color={isPreserved ? '#FFFFFF' : theme.colors.accent}
                fill={isPreserved ? '#FFFFFF' : 'transparent'}
              />
              <Text style={[styles.preserveText, isPreserved && styles.preserveTextActive]}>
                {isPreserved ? 'Preserved' : 'Preserve'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Back button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={16} color={theme.colors.accent} />
            <Text style={styles.backButtonText}>BACK TO DISCOVER</Text>
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
    fontFamily: 'Qurova',
  },
  imageContainer: {
    height: 300,
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
    fontFamily: 'Qurova',
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
    fontFamily: 'Qurova',
  },
  description: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
    fontFamily: 'Qurova',
  },
  preserveContainer: {
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
    alignItems: 'center',
  },
  preserveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.accent,
  },
  preserveButtonActive: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  preserveText: {
    fontSize: 16,
    color: theme.colors.accent,
    marginLeft: theme.spacing.sm,
    fontFamily: 'Qurova',
    fontWeight: '600',
  },
  preserveTextActive: {
    color: '#FFFFFF',
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
    fontFamily: 'Qurova',
  },
  linkLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontFamily: 'Qurova',
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
    fontFamily: 'Qurova',
  },
});