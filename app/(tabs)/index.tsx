import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Scanner } from '@/components/Scanner';
import { useArtifactStore } from '@/stores/artifactStore';
import { theme } from '@/constants/theme';
import { globalStyles } from '@/constants/theme';
import { Radio } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function ScannerScreen() {
  const router = useRouter();
  const { isScanning, startScanning, stopScanning, nearbyArtifacts, discoverArtifact } = useArtifactStore();
  
  useEffect(() => {
    // Start scanning when the screen loads
    startScanning();
    
    // Clean up when the screen unloads
    return () => {
      stopScanning();
    };
  }, []);
  
  const handleDiscoverArtifact = (artifactId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    discoverArtifact(artifactId);
    router.push(`/artifact/${artifactId}`);
  };
  
  return (
    <View style={globalStyles.container}>
      <Scanner />
      
      {/* Artifact indicators */}
      {isScanning && nearbyArtifacts.length > 0 && (
        <View style={styles.artifactsContainer}>
          <Text style={styles.artifactsTitle}>
            NEARBY ARTIFACTS
          </Text>
          
          {nearbyArtifacts.slice(0, 3).map((artifact) => (
            <TouchableOpacity
              key={artifact.id}
              style={styles.artifactButton}
              onPress={() => handleDiscoverArtifact(artifact.id)}
              activeOpacity={0.7}
            >
              <Radio size={20} color={theme.colors.accent} />
              <View style={styles.artifactInfo}>
                <Text style={styles.artifactTitle} numberOfLines={1}>
                  {artifact.title}
                </Text>
                <Text style={styles.artifactDistance} numberOfLines={1}>
                  {Math.floor(Math.random() * 100) + 5}m away
                </Text>
              </View>
              <View 
                style={[
                  styles.brightnessIndicator,
                  { opacity: artifact.brightness / 100 }
                ]} 
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      {/* Scan control button */}
      <View style={styles.scanButtonContainer}>
        <TouchableOpacity
          style={[
            styles.scanButton,
            isScanning ? styles.scanningButton : {}
          ]}
          onPress={isScanning ? stopScanning : startScanning}
          activeOpacity={0.7}
        >
          <Text style={styles.scanButtonText}>
            {isScanning ? 'STOP SCANNING' : 'START SCANNING'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  artifactsContainer: {
    position: 'absolute',
    top: Dimensions.get('window').height * 0.07, // Adjusted for better fit on larger screens
    left: 20,
    right: 20,
    backgroundColor: `${theme.colors.background}CC`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    maxHeight: Dimensions.get('window').height * 0.25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  artifactsTitle: {
    fontSize: 14,
    color: theme.colors.accent,
    marginBottom: theme.spacing.sm,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  artifactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  artifactInfo: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  artifactTitle: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  artifactDistance: {
    fontSize: 12,
    color: theme.colors.secondaryText,
  },
  brightnessIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.accent,
  },
  scanButtonContainer: {
    position: 'absolute',
    bottom: Dimensions.get('window').height * 0.05, // Adjusted for better fit
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    width: '100%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  scanningButton: {
    backgroundColor: theme.colors.card,
    borderWidth: 2,
    borderColor: theme.colors.accent,
  },
  scanButtonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'monospace',
  },
});