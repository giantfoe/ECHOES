import React, { useState, useRef } from 'react';
import {
  View,
  Modal,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
  PanGestureHandler,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StoryCreationData } from '../../types/Story';
import { useStoryStore } from '../../stores/storyStore';
import { theme } from '../../constants/theme';
import { GlassCard } from '../GlassCard';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface StoryCreatorProps {
  visible: boolean;
  artifactId: string;
  imageUri: string;
  onClose: () => void;
  onStoryCreated?: () => void;
}

export const StoryCreator: React.FC<StoryCreatorProps> = ({
  visible,
  artifactId,
  imageUri,
  onClose,
  onStoryCreated,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [textOverlay, setTextOverlay] = useState('');
  const [overlayPosition, setOverlayPosition] = useState({ x: SCREEN_WIDTH / 2 - 50, y: SCREEN_HEIGHT / 2 });
  const [overlayColor, setOverlayColor] = useState('#FFFFFF');
  const [isCreating, setIsCreating] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  
  const overlayPan = useRef(new Animated.ValueXY()).current;
  const { createStory } = useStoryStore();

  const overlayColors = [
    '#FFFFFF',
    '#000000',
    theme.gradients.aurora.colors[0],
    theme.gradients.twilight.colors[0],
    theme.gradients.sunset.colors[0],
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
  ];

  const handleCreateStory = async () => {
    if (!artifactId || !imageUri) {
      Alert.alert('Error', 'Missing required information to create story');
      return;
    }

    setIsCreating(true);

    try {
      const storyData: StoryCreationData = {
        artifactId,
        imageUri,
        title: title.trim() || undefined,
        description: description.trim() || undefined,
        textOverlay: textOverlay.trim() ? {
          text: textOverlay.trim(),
          position: overlayPosition,
          color: overlayColor,
          fontSize: 18,
        } : undefined,
      };

      await createStory(storyData);
      
      // Reset form
      setTitle('');
      setDescription('');
      setTextOverlay('');
      setOverlayPosition({ x: SCREEN_WIDTH / 2 - 50, y: SCREEN_HEIGHT / 2 });
      setOverlayColor('#FFFFFF');
      setShowTextInput(false);
      
      onStoryCreated?.();
      onClose();
      
      Alert.alert('Success', 'Your story has been created!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create story. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleOverlayPan = Animated.event(
    [{ nativeEvent: { translationX: overlayPan.x, translationY: overlayPan.y } }],
    { useNativeDriver: false }
  );

  const handleOverlayPanEnd = (event: any) => {
    const { translationX, translationY } = event.nativeEvent;
    const newX = Math.max(0, Math.min(SCREEN_WIDTH - 100, overlayPosition.x + translationX));
    const newY = Math.max(100, Math.min(SCREEN_HEIGHT - 200, overlayPosition.y + translationY));
    
    setOverlayPosition({ x: newX, y: newY });
    overlayPan.setValue({ x: 0, y: 0 });
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Background Image */}
        <Image
          source={{ uri: imageUri }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        
        {/* Gradient Overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.6)']}
          style={styles.gradientOverlay}
        />
        
        {/* Header */}
        <SafeAreaView style={styles.header}>
          <GlassCard style={styles.headerContent}>
            <TouchableOpacity onPress={onClose} style={styles.headerButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Story</Text>
            <TouchableOpacity 
              onPress={handleCreateStory} 
              style={[styles.headerButton, { opacity: isCreating ? 0.5 : 1 }]}
              disabled={isCreating}
            >
              <Text style={styles.shareText}>{isCreating ? 'Creating...' : 'Share'}</Text>
            </TouchableOpacity>
          </GlassCard>
        </SafeAreaView>
        
        {/* Text Overlay */}
        {textOverlay.trim() && (
          <PanGestureHandler
            onGestureEvent={handleOverlayPan}
            onHandlerStateChange={(event) => {
              if (event.nativeEvent.state === 5) { // END state
                handleOverlayPanEnd(event);
              }
            }}
          >
            <Animated.View
              style={[
                styles.textOverlay,
                {
                  left: overlayPosition.x,
                  top: overlayPosition.y,
                  transform: [
                    { translateX: overlayPan.x },
                    { translateY: overlayPan.y },
                  ],
                },
              ]}
            >
              <Text
                style={[
                  styles.overlayText,
                  {
                    color: overlayColor,
                  },
                ]}
              >
                {textOverlay}
              </Text>
            </Animated.View>
          </PanGestureHandler>
        )}
        
        {/* Bottom Controls */}
        <SafeAreaView style={styles.bottomControls}>
          {/* Text Input Modal */}
          {showTextInput && (
            <GlassCard style={styles.textInputCard}>
              <TextInput
                style={styles.textInput}
                placeholder="Add text to your story..."
                placeholderTextColor={theme.colors.secondaryText}
                value={textOverlay}
                onChangeText={setTextOverlay}
                multiline
                autoFocus
              />
              
              {/* Color Picker */}
              <View style={styles.colorPicker}>
                <Text style={styles.colorPickerLabel}>Text Color:</Text>
                <View style={styles.colorOptions}>
                  {overlayColors.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        overlayColor === color && styles.selectedColor,
                      ]}
                      onPress={() => setOverlayColor(color)}
                    />
                  ))}
                </View>
              </View>
              
              <View style={styles.textInputActions}>
                <TouchableOpacity
                  onPress={() => setShowTextInput(false)}
                  style={styles.textInputButton}
                >
                  <Text style={styles.textInputButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          )}
          
          {/* Story Details */}
          {!showTextInput && (
            <GlassCard style={styles.detailsCard}>
              <TextInput
                style={styles.titleInput}
                placeholder="Story title (optional)"
                placeholderTextColor={theme.colors.secondaryText}
                value={title}
                onChangeText={setTitle}
                maxLength={50}
              />
              
              <TextInput
                style={styles.descriptionInput}
                placeholder="Add a description (optional)"
                placeholderTextColor={theme.colors.secondaryText}
                value={description}
                onChangeText={setDescription}
                multiline
                maxLength={200}
              />
            </GlassCard>
          )}
          
          {/* Action Buttons */}
          {!showTextInput && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() => setShowTextInput(true)}
                style={styles.actionButton}
              >
                <Ionicons name="text" size={24} color={theme.colors.text} />
                <Text style={styles.actionButtonText}>Add Text</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="location" size={24} color={theme.colors.text} />
                <Text style={styles.actionButtonText}>Location</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="musical-notes" size={24} color={theme.colors.text} />
                <Text style={styles.actionButtonText}>Music</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backgroundImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'absolute',
  },
  gradientOverlay: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  shareText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.gradients.aurora.colors[0],
  },
  textOverlay: {
    position: 'absolute',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    minWidth: 100,
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  textInputCard: {
    padding: 16,
    marginBottom: 16,
  },
  textInput: {
    fontSize: 16,
    color: theme.colors.text,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  colorPicker: {
    marginTop: 16,
  },
  colorPickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 8,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: theme.colors.text,
  },
  textInputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  textInputButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.gradients.aurora.colors[0],
  },
  textInputButtonText: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  detailsCard: {
    padding: 16,
    marginBottom: 16,
  },
  titleInput: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
    paddingVertical: 8,
  },
  descriptionInput: {
    fontSize: 14,
    color: theme.colors.text,
    minHeight: 60,
    textAlignVertical: 'top',
    paddingVertical: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
  },
  actionButtonText: {
    fontSize: 12,
    color: theme.colors.secondaryText,
    marginTop: 4,
  },
});