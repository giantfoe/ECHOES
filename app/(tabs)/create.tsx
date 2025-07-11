import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '@/constants/theme';
import { theme } from '@/constants/theme';
import { useArtifactStore } from '@/stores/artifactStore';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'expo-router';
import { Camera, Link, Image as ImageIcon, MapPin, BookOpen } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
// Audio functionality removed for simplicity
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { Image } from 'expo-image';
import { StoryCreator } from '@/components/Stories';

export default function CreateScreen() {
  const router = useRouter();
  const { createArtifact } = useArtifactStore();
  const { incrementArtifactsCreated } = useUserStore();
  
  // Add error boundary for debugging
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return (
      <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.colors.text, textAlign: 'center' }}>
          Something went wrong with the Create screen.{"\n"}
          Please restart the app.
        </Text>
        <TouchableOpacity 
          style={{ marginTop: 20, padding: 10, backgroundColor: theme.colors.accent, borderRadius: 5 }}
          onPress={() => setHasError(false)}
        >
          <Text style={{ color: theme.colors.background }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'photo' | 'link' | 'story'>('photo');
  const [image, setImage] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [location, setLocation] = useState({
    latitude: 34.0522,
    longitude: -118.2437,
    name: 'Current Location'
  });
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [storyCreatorVisible, setStoryCreatorVisible] = useState(false);
  const [selectedArtifactForStory, setSelectedArtifactForStory] = useState<string | null>(null);

  useEffect(() => {
    const initializeScreen = async () => {
      try {
        await requestPermissions();
        await getCurrentLocation();
      } catch (error) {
        console.error('Error initializing create screen:', error);
        setHasError(true);
      }
    };
    
    initializeScreen();
  }, []);

  // No cleanup needed for simplified version

  const requestPermissions = async () => {
    try {
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      const locationPermission = await Location.requestForegroundPermissionsAsync();
      
      setPermissionsGranted(
        mediaLibraryPermission.status === 'granted' &&
        locationPermission.status === 'granted'
      );
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Permission Error', 'Failed to request permissions. Please check your device settings.');
    }
  };

  const getCurrentLocation = async () => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        name: 'Current Location'
      });
    } catch (error) {
      console.error('Error getting location:', error);
      // Keep default location if unable to get current location
    }
  };
  
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        
        // Save to media library if permission granted
        if (permissionsGranted) {
          try {
            await MediaLibrary.saveToLibraryAsync(result.assets[0].uri);
          } catch (error) {
            console.error('Error saving to media library:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        
        // Save to media library if permission granted
        if (permissionsGranted) {
          try {
            await MediaLibrary.saveToLibraryAsync(result.assets[0].uri);
          } catch (error) {
            console.error('Error saving to media library:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  // Audio recording functions removed for simplicity
  
  const handleCreateStory = () => {
    if (!image) {
      Alert.alert('Error', 'Please select an image for your story');
      return;
    }
    
    // Create a temporary artifact ID for the story
    const tempArtifactId = `temp_${Date.now()}`;
    setSelectedArtifactForStory(tempArtifactId);
    setStoryCreatorVisible(true);
  };
  
  const handleStoryCreated = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Reset form
    setTitle('');
    setDescription('');
    setType('photo');
    setImage(null);
    setStoryCreatorVisible(false);
    setSelectedArtifactForStory(null);
    
    // Navigate back to discover
    router.push('/');
  };

  const handleCreateArtifact = () => {
    if (type === 'story') {
      handleCreateStory();
      return;
    }
    
    if (!title || !description) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }
    
    createArtifact({
      type,
      title,
      description,
      location,
      creator: {
        id: 'user1',
        name: 'You'
      },
      mediaUrl: image || undefined,
      linkUrl: type === 'link' ? linkUrl : undefined
    });
    
    incrementArtifactsCreated();
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Reset form
    setTitle('');
    setDescription('');
    setType('photo');
    setImage(null);
    setLinkUrl('');
    
    // Navigate back to scanner
    router.push('/');
  };
  
  return (
    <SafeAreaView style={globalStyles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
        <Text style={styles.sectionTitle}>{type === 'story' ? 'CREATE NEW STORY' : 'CREATE NEW ARTIFACT'}</Text>
        <Text style={styles.sectionSubtitle}>
          {type === 'story' ? 'Share a moment with your followers' : 'Leave a digital memory at your current location'}
        </Text>
        
        {/* Type selection */}
        <View style={styles.typeContainer}>
          <TouchableOpacity 
            style={[styles.typeButton, type === 'photo' && styles.selectedType]}
            onPress={() => setType('photo')}
            activeOpacity={0.7}
          >
            <Camera 
              size={20} 
              color={type === 'photo' ? theme.colors.background : theme.colors.text} 
            />
            <Text style={[
              styles.typeText,
              type === 'photo' && styles.selectedTypeText
            ]}>
              PHOTO
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.typeButton, type === 'link' && styles.selectedType]}
            onPress={() => setType('link')}
            activeOpacity={0.7}
          >
            <Link 
              size={20} 
              color={type === 'link' ? theme.colors.background : theme.colors.text} 
            />
            <Text style={[
              styles.typeText,
              type === 'link' && styles.selectedTypeText
            ]}>
              LINK
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.typeButton, type === 'story' && styles.selectedType]}
            onPress={() => setType('story')}
            activeOpacity={0.7}
          >
            <BookOpen 
              size={20} 
              color={type === 'story' ? theme.colors.background : theme.colors.text} 
            />
            <Text style={[
              styles.typeText,
              type === 'story' && styles.selectedTypeText
            ]}>
              STORY
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Title and description - only for artifacts */}
        {type !== 'story' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Artifact Title"
              placeholderTextColor={theme.colors.secondaryText}
              value={title}
              onChangeText={setTitle}
              maxLength={50}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe this moment..."
              placeholderTextColor={theme.colors.secondaryText}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={200}
            />
          </>
        )}
        
        {/* Link input */}
        {type === 'link' && (
          <TextInput
            style={styles.input}
            placeholder="Enter URL (https://...)"
            placeholderTextColor={theme.colors.secondaryText}
            value={linkUrl}
            onChangeText={setLinkUrl}
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
        
        {/* Media upload */}
        {(type === 'photo' || type === 'story') && (
          <View style={styles.mediaContainer}>
            <Text style={styles.mediaLabel}>{type === 'story' ? 'STORY IMAGE' : 'PHOTO'}</Text>
            
            {image ? (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: image }}
                  style={styles.imagePreview}
                  contentFit="cover"
                />
                <View style={styles.imageButtonsContainer}>
                  <TouchableOpacity 
                    style={styles.imageActionButton}
                    onPress={pickImage}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.imageActionText}>GALLERY</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.imageActionButton}
                    onPress={takePhoto}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.imageActionText}>CAMERA</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.photoButtonsContainer}>
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={pickImage}
                  activeOpacity={0.7}
                >
                  <ImageIcon size={24} color={theme.colors.text} />
                  <Text style={styles.uploadText}>GALLERY</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={takePhoto}
                  activeOpacity={0.7}
                >
                  <Camera size={24} color={theme.colors.text} />
                  <Text style={styles.uploadText}>CAMERA</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        

        
        {/* Location - only for artifacts */}
        {type !== 'story' && (
          <View style={styles.locationContainer}>
            <View style={styles.locationHeader}>
              <MapPin size={16} color={theme.colors.accent} />
              <Text style={styles.locationTitle}>CURRENT LOCATION</Text>
            </View>
            <View style={styles.locationDetails}>
              <Text style={styles.locationText}>
                LAT: {location.latitude.toFixed(4)}° • LONG: {location.longitude.toFixed(4)}°
              </Text>
              <Text style={styles.locationName}>{location.name}</Text>
            </View>
          </View>
        )}
        
        {/* Create button */}
        <TouchableOpacity 
          style={[
            styles.createButton,
            (type === 'story' ? !image : (!title || !description)) && styles.disabledButton
          ]}
          onPress={handleCreateArtifact}
          disabled={type === 'story' ? !image : (!title || !description)}
          activeOpacity={0.7}
        >
          <Text style={styles.createButtonText}>
            {type === 'story' ? 'CREATE STORY' : 'CREATE ARTIFACT'}
          </Text>
        </TouchableOpacity>
        
        {type !== 'story' && (
          <Text style={styles.disclaimer}>
            Artifacts are permanently tied to this location and cannot be moved or deleted.
          </Text>
        )}
        </View>
      </ScrollView>
      
      {/* Story Creator Modal */}
      {storyCreatorVisible && selectedArtifactForStory && image && (
        <StoryCreator
          visible={storyCreatorVisible}
          artifactId={selectedArtifactForStory}
          imageUri={image}
          onClose={() => {
            setStoryCreatorVisible(false);
            setSelectedArtifactForStory(null);
          }}
          onStoryCreated={handleStoryCreated}
        />
      )}
    </SafeAreaView>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontFamily: 'Qurova',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.lg,
    fontFamily: 'Qurova',
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  typeButton: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginHorizontal: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  selectedType: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
    shadowColor: theme.colors.accent,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  typeText: {
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
    fontSize: 12,
    fontFamily: 'Qurova',
  },
  selectedTypeText: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    fontFamily: 'Qurova',
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  mediaContainer: {
    marginBottom: theme.spacing.md,
  },
  mediaLabel: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.sm,
    fontFamily: 'Qurova',
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  uploadText: {
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    fontSize: 14,
    fontFamily: 'Qurova',
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: theme.borderRadius.md,
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
  imagePreview: {
    width: '100%',
    height: 200,
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: `${theme.colors.background}CC`,
    padding: theme.spacing.sm,
    borderTopLeftRadius: theme.borderRadius.sm,
    borderBottomRightRadius: theme.borderRadius.md,
  },
  imageButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    flexDirection: 'row',
  },
  imageActionButton: {
    backgroundColor: `${theme.colors.background}CC`,
    padding: theme.spacing.sm,
    marginLeft: 1,
  },
  imageActionText: {
    color: theme.colors.accent,
    fontSize: 12,
    fontFamily: 'Qurova',
    fontWeight: 'bold',
  },
  photoButtonsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  locationContainer: {
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
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  locationTitle: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    fontWeight: 'bold',
    fontFamily: 'Qurova',
  },
  locationDetails: {
    marginLeft: theme.spacing.md,
  },
  locationText: {
    fontSize: 12,
    color: theme.colors.secondaryText,
    marginBottom: 4,
    fontFamily: 'Qurova',
  },
  locationName: {
    fontSize: 14,
    color: theme.colors.text,
    fontFamily: 'Qurova',
  },
  createButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: theme.colors.inactive,
    shadowOpacity: 0,
    elevation: 0,
  },
  createButtonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Qurova',
  },
  disclaimer: {
    fontSize: 12,
    color: theme.colors.secondaryText,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    fontFamily: 'Qurova',
  },
});