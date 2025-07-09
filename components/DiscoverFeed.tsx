import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Text } from 'react-native';
import { ArtifactCard } from './ArtifactCard';
import { Artifact } from '@/mocks/artifacts';
import { theme } from '@/constants/theme';
import { useArtifactStore } from '@/stores/artifactStore';
import * as Haptics from 'expo-haptics';

interface DiscoverFeedProps {
  onArtifactPress?: (artifact: Artifact) => void;
}

export const DiscoverFeed: React.FC<DiscoverFeedProps> = ({ onArtifactPress }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { nearbyArtifacts, donatedArtifacts, preserveArtifact, donateToArtifact } = useArtifactStore();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Simulate fetching new artifacts
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you would fetch new artifacts from an API
    setRefreshing(false);
  }, []);

  const handleDonate = useCallback((artifactId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    donateToArtifact(artifactId);
  }, [donateToArtifact]);

  const handlePreserve = useCallback((artifactId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Preserve with 10 BONK tokens
    preserveArtifact(artifactId, 10);
  }, [preserveArtifact]);

  const renderArtifact = useCallback(({ item }: { item: Artifact }) => (
    <ArtifactCard
      artifact={item}
      onDonate={handleDonate}
      onPreserve={handlePreserve}
      isDonated={donatedArtifacts.includes(item.id)}
    />
  ), [handleDonate, handlePreserve]);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>DISCOVER ARTIFACTS</Text>
      <Text style={styles.headerSubtitle}>Pull down to refresh</Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No artifacts found</Text>
      <Text style={styles.emptySubtext}>Pull down to refresh and discover new artifacts</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={nearbyArtifacts}
        renderItem={renderArtifact}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.accent}
            colors={[theme.colors.accent]}
          />
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContainer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    fontFamily: 'monospace',
    marginTop: theme.spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.secondaryText,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    fontFamily: 'monospace',
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
});

export default DiscoverFeed;