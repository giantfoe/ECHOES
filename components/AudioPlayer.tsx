import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { theme } from '@/constants/theme';

interface AudioPlayerProps {
  audioUrl?: string;
  title?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, title }) => {
  const [isLoading, setIsLoading] = useState(false);
  const player = useAudioPlayer(audioUrl || '');
  const [duration, setDuration] = useState<number>(0);
  const [position, setPosition] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (player) {
      setDuration(player.duration || 0);
      setPosition(player.currentTime || 0);
      setIsPlaying(player.playing || false);
    }
  }, [player, player.duration, player.currentTime, player.playing]);

  const loadAudio = async () => {
    if (!audioUrl) {
      Alert.alert('Error', 'No audio URL provided');
      return;
    }
    // Audio is automatically loaded by useAudioPlayer hook
  };

  const togglePlayback = async () => {
    try {
      if (!audioUrl) {
        Alert.alert('Error', 'No audio URL provided');
        return;
      }

      if (isPlaying) {
        player.pause();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        player.play();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
      Alert.alert('Error', 'Failed to control audio playback');
    }
  };

  const formatTime = (seconds: number) => {
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      <View style={styles.playerContainer}>
        <TouchableOpacity 
          style={[styles.playButton, isLoading && styles.playButtonDisabled]} 
          onPress={togglePlayback}
          disabled={isLoading}
        >
          <Text style={styles.playButtonText}>
            {isLoading ? '⏳' : isPlaying ? '⏸️' : '▶️'}
          </Text>
        </TouchableOpacity>
        
        {audioUrl && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: duration > 0 ? `${(position / duration) * 100}%` : '0%' }
                ]} 
              />
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(position)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: theme.colors.text,
    textAlign: 'center',
  },
  playerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  playButtonDisabled: {
    backgroundColor: theme.colors.inactive,
  },
  playButtonText: {
    fontSize: 20,
    color: theme.colors.background,
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.accent,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    fontSize: 12,
    color: theme.colors.secondaryText,
  },
});

export default AudioPlayer;