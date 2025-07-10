import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '@/constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  intensity?: 'light' | 'medium' | 'strong';
  style?: ViewStyle;
  blurType?: 'light' | 'dark';
}

export const GlassCard: React.FC<GlassCardProps> = (props) => {
  const { 
    children, 
    intensity = 'medium',
    style,
    blurType = 'dark'
  } = props || {};
  const glassStyle = theme.glassmorphism[intensity];
  
  return (
    <View style={[styles.container, style]}>
      <BlurView
        intensity={intensity === 'light' ? 20 : intensity === 'medium' ? 25 : 30}
        tint={blurType}
        style={[
          styles.blurContainer,
          {
            backgroundColor: glassStyle.backgroundColor,
            borderColor: glassStyle.borderColor,
          }
        ]}
      >
        <View style={styles.content}>
          {children}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  blurContainer: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
});