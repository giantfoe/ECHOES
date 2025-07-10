import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';

interface GradientBackgroundProps {
  children: React.ReactNode;
  gradientKey?: keyof typeof theme.gradients;
  style?: any;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({ 
  children, 
  gradientKey = 'twilight',
  style 
}) => {
  const gradientColors = theme.gradients[gradientKey];
  
  return (
    <LinearGradient
      colors={gradientColors}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});