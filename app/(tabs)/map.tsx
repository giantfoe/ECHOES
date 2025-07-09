import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { globalStyles } from '@/constants/theme';
import { theme } from '@/constants/theme';
import { useArtifactStore } from '@/stores/artifactStore';
import { ArtifactCard } from '@/components/ArtifactCard';
import { MapPin } from 'lucide-react-native';

export default function MapScreen() {
  const { nearbyArtifacts } = useArtifactStore();
  
  return (
    <View style={globalStyles.container}>
      {/* Map placeholder */}
      <View style={styles.mapContainer}>
        <Text style={styles.mapPlaceholder}>
          ARTIFACT MAP
        </Text>
        <Text style={styles.mapSubtext}>
          {nearbyArtifacts.length} ARTIFACTS NEARBY
        </Text>
        
        {/* Map grid */}
        <View style={styles.mapGrid}>
          {Array(Math.ceil(Dimensions.get('window').height / 60)).fill(0).map((_, i) => (
            <View key={`h-${i}`} style={[styles.gridLine, styles.horizontalLine, { top: i * 30 }]} />
          ))}
          {Array(Math.ceil(Dimensions.get('window').width / 60)).fill(0).map((_, i) => (
            <View key={`v-${i}`} style={[styles.gridLine, styles.verticalLine, { left: i * 30 }]} />
          ))}
        </View>
        
        {/* Map pins */}
        {nearbyArtifacts.map((artifact, index) => (
          <View 
            key={artifact.id}
            style={[
              styles.mapPin,
              { 
                top: Dimensions.get('window').height * 0.15 + Math.sin(index * 1.5) * Dimensions.get('window').height * 0.1,
                left: Dimensions.get('window').width * 0.4 + Math.cos(index * 1.5) * Dimensions.get('window').width * 0.2,
              }
            ]}
          >
            <MapPin 
              size={24} 
              color={theme.colors.accent} 
              style={{ opacity: artifact.brightness / 100 }}
            />
          </View>
        ))}
        
        {/* Current location */}
        <View style={styles.currentLocation}>
          <View style={styles.currentLocationDot} />
          <View style={styles.currentLocationRing} />
        </View>
      </View>
      
      {/* Artifact list */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>NEARBY ARTIFACTS</Text>
        <ScrollView style={styles.artifactsList}>
          {nearbyArtifacts.map((artifact) => (
            <ArtifactCard 
              key={artifact.id} 
              artifact={artifact}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 2,
    backgroundColor: theme.colors.card,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
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
  mapPlaceholder: {
    fontSize: 18,
    color: theme.colors.accent,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  mapSubtext: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    marginTop: theme.spacing.sm,
    fontFamily: 'monospace',
  },
  mapGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: `${theme.colors.border}50`,
  },
  horizontalLine: {
    left: 0,
    right: 0,
    height: 1,
  },
  verticalLine: {
    top: 0,
    bottom: 0,
    width: 1,
  },
  mapPin: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.accent,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
  },
  currentLocation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 40,
    height: 40,
    marginLeft: -20,
    marginTop: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.accent2,
    shadowColor: theme.colors.accent2,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 3,
  },
  currentLocationRing: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: theme.colors.accent2,
    opacity: 0.5,
  },
  listContainer: {
    flex: 1,
    margin: theme.spacing.md,
    marginTop: 0,
  },
  listTitle: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  artifactsList: {
    flex: 1,
  },
});