import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { ArtifactCard } from './ArtifactCard';
import { Artifact } from '@/mocks/artifacts';
import { theme } from '@/constants/theme';
import { useArtifactStore } from '@/stores/artifactStore';
import * as Haptics from 'expo-haptics';

interface DiscoverFeedProps {
  onArtifactPress?: (artifact: Artifact) => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
}

export const DiscoverFeed: React.FC<DiscoverFeedProps> = ({ onArtifactPress, ListHeaderComponent }) => {
  const { nearbyArtifacts, preservedArtifacts, preserveArtifact } = useArtifactStore();

  const handlePreserve = useCallback((artifactId: string, bonkAmount: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    preserveArtifact(artifactId, bonkAmount);
  }, [preserveArtifact]);

  const renderArtifact = useCallback(({ item }: { item: Artifact }) => (
    <ArtifactCard
      artifact={item}
      onPreserve={handlePreserve}
      isPreserved={preservedArtifacts.includes(item.id)}
      onPress={onArtifactPress ? () => onArtifactPress(item) : undefined}
    />
  ), [handlePreserve, preservedArtifacts, onArtifactPress]);



  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No artifacts found</Text>
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
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={ListHeaderComponent}
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

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.secondaryText,
    fontFamily: 'Qurova',
    fontWeight: '600',
  },

});

export default DiscoverFeed;