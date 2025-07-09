import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { theme } from '@/constants/theme';

interface ScannerProps {
  onScanComplete?: (data: any) => void;
}

const { width, height } = Dimensions.get('window');

export const Scanner: React.FC<ScannerProps> = ({ onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status === 'granted');
  };

  const getCurrentLocation = async () => {
    if (!locationPermission) {
      return { lat: 37.7749, lng: -122.4194 }; // Default location
    }
    
    try {
      const location = await Location.getCurrentPositionAsync({});
      return {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting location:', error);
      return { lat: 37.7749, lng: -122.4194 };
    }
  };

  const startScan = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission Required', 'Camera permission is required to scan for artifacts.');
        return;
      }
    }

    setIsScanning(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Simulate scanning process with camera
    setTimeout(async () => {
      setIsScanning(false);
      const location = await getCurrentLocation();
      
      const mockData = {
        type: 'artifact',
        id: 'scanned-' + Date.now(),
        name: 'Discovered Artifact',
        location,
        discoveredAt: new Date().toISOString(),
        brightness: Math.floor(Math.random() * 100) + 1,
      };
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Artifact Discovered!', `Found: ${mockData.name}\nBrightness: ${mockData.brightness}`);
      onScanComplete?.(mockData);
    }, 3000);
  };

  const toggleCameraFacing = () => {
    setFacing((current: CameraType) => (current === 'back' ? 'front' : 'back'));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Camera permission is required to scan for artifacts.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const stopScan = () => {
    setIsScanning(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          animateShutter={false}
        >
          <View style={styles.overlay}>
            {/* Scanning overlay */}
            <View style={[styles.scanArea, isScanning && styles.scanAreaActive]}>
              <Text style={styles.scanText}>
                {isScanning ? 'Scanning for artifacts...' : 'Point camera at potential artifact'}
              </Text>
              {isScanning && (
                <View style={styles.scanLine} />
              )}
            </View>
            
            {/* Camera controls */}
            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.flipButton}
                onPress={toggleCameraFacing}
                disabled={isScanning}
              >
                <Text style={styles.flipButtonText}>Flip</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.scanButton, isScanning && styles.scanButtonActive]}
                onPress={isScanning ? stopScan : startScan}
                disabled={!permission?.granted}
              >
                <Text style={styles.scanButtonText}>
                  {isScanning ? 'Stop Scan' : 'Start Scan'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    padding: 20,
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    margin: 40,
    position: 'relative',
  },
  scanAreaActive: {
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  scanText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 8,
  },
  scanLine: {
    position: 'absolute',
    top: '50%',
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: '#007AFF',
    opacity: 0.8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 40,
  },
  flipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  flipButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scanButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  scanButtonActive: {
    backgroundColor: '#FF3B30',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Scanner;