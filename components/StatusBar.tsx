import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

interface StatusBarProps {
  style?: 'auto' | 'inverted' | 'light' | 'dark';
  backgroundColor?: string;
  title?: string;
  showConnectionStatus?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  style = 'auto',
  backgroundColor,
  title,
  showConnectionStatus = false,
}) => {
  const connectionStatus = 'Connected'; // This would come from app state

  return (
    <>
      <ExpoStatusBar style={style} backgroundColor={backgroundColor} />
      {(title || showConnectionStatus) && (
        <View style={[styles.container, backgroundColor && { backgroundColor }]}>
          {title && <Text style={styles.title}>{title}</Text>}
          {showConnectionStatus && (
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, styles.connectedDot]} />
              <Text style={styles.statusText}>{connectionStatus}</Text>
            </View>
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  connectedDot: {
    backgroundColor: '#34C759',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
});

export default StatusBar;