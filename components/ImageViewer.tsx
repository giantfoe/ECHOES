import React from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Text,
} from 'react-native';
import { X } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { Artifact } from '@/mocks/artifacts';

interface ImageViewerProps {
  visible: boolean;
  artifact: Artifact | null;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export const ImageViewer: React.FC<ImageViewerProps> = ({ visible, artifact, onClose }) => {
  if (!artifact) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <View style={styles.container}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: artifact.mediaUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{artifact.title}</Text>
          <Text style={styles.creator}>by {artifact.creator.name}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height * 0.8,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Qurova',
    marginBottom: theme.spacing.xs,
  },
  creator: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Qurova',
    opacity: 0.8,
  },
});

export default ImageViewer;