import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { globalStyles } from '@/constants/theme';
import { theme } from '@/constants/theme';
import { useArtifactStore } from '@/stores/artifactStore';
import { ArtifactCard } from '@/components/ArtifactCard';
import { Archive, Clock, Star } from 'lucide-react-native';

export default function ArchiveScreen() {
  const { discoveredArtifacts, createdArtifacts } = useArtifactStore();
  const [activeTab, setActiveTab] = useState<'discovered' | 'created'>('discovered');
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Archive size={48} color={theme.colors.inactive} />
      <Text style={styles.emptyTitle}>
        NO ARTIFACTS {activeTab === 'discovered' ? 'DISCOVERED' : 'CREATED'} YET
      </Text>
      <Text style={styles.emptyText}>
        {activeTab === 'discovered'
          ? "Explore the world to discover artifacts left by others."
          : "Create your first artifact to see it here."}
      </Text>
    </View>
  );
  
  return (
    <View style={globalStyles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'discovered' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('discovered')}
          activeOpacity={0.7}
        >
          <Clock 
            size={16} 
            color={activeTab === 'discovered' ? theme.colors.accent : theme.colors.secondaryText} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'discovered' && styles.activeTabText
          ]}>
            DISCOVERED ({discoveredArtifacts.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'created' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('created')}
          activeOpacity={0.7}
        >
          <Star 
            size={16} 
            color={activeTab === 'created' ? theme.colors.accent : theme.colors.secondaryText} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'created' && styles.activeTabText
          ]}>
            CREATED ({createdArtifacts.length})
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={activeTab === 'discovered' ? discoveredArtifacts : createdArtifacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ArtifactCard artifact={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activeTabButton: {
    backgroundColor: theme.colors.background,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.accent,
  },
  tabText: {
    color: theme.colors.secondaryText,
    marginLeft: theme.spacing.sm,
    fontSize: 12,
    fontFamily: 'monospace',
  },
  activeTabText: {
    color: theme.colors.accent,
    fontWeight: 'bold',
  },
  listContent: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    fontFamily: 'monospace',
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
});