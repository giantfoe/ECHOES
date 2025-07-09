import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { artifacts, Artifact } from '@/mocks/artifacts';

interface ArtifactState {
  nearbyArtifacts: Artifact[];
  discoveredArtifacts: Artifact[];
  createdArtifacts: Artifact[];
  currentArtifact: Artifact | null;
  isScanning: boolean;
  
  // Actions
  startScanning: () => void;
  stopScanning: () => void;
  discoverArtifact: (artifactId: string) => void;
  setCurrentArtifact: (artifact: Artifact | null) => void;
  preserveArtifact: (artifactId: string, bonkAmount: number) => void;
  createArtifact: (artifact: Omit<Artifact, 'id' | 'createdAt' | 'brightness' | 'bonkPreservation'>) => void;
}

export const useArtifactStore = create<ArtifactState>()(
  persist(
    (set, get) => ({
      nearbyArtifacts: artifacts,
      discoveredArtifacts: [],
      createdArtifacts: [],
      currentArtifact: null,
      isScanning: false,
      
      startScanning: () => set({ isScanning: true }),
      stopScanning: () => set({ isScanning: false }),
      
      discoverArtifact: (artifactId: string) => {
        const artifact = get().nearbyArtifacts.find(a => a.id === artifactId);
        if (artifact && !get().discoveredArtifacts.some(a => a.id === artifactId)) {
          set(state => ({
            discoveredArtifacts: [...state.discoveredArtifacts, artifact],
            currentArtifact: artifact
          }));
        }
      },
      
      setCurrentArtifact: (artifact: Artifact | null) => set({ currentArtifact: artifact }),
      
      preserveArtifact: (artifactId: string, bonkAmount: number) => {
        set(state => ({
          nearbyArtifacts: state.nearbyArtifacts.map(a => 
            a.id === artifactId 
              ? { ...a, bonkPreservation: a.bonkPreservation + bonkAmount, brightness: Math.min(100, a.brightness + bonkAmount / 10) } 
              : a
          ),
          discoveredArtifacts: state.discoveredArtifacts.map(a => 
            a.id === artifactId 
              ? { ...a, bonkPreservation: a.bonkPreservation + bonkAmount, brightness: Math.min(100, a.brightness + bonkAmount / 10) } 
              : a
          )
        }));
      },
      
      createArtifact: (artifactData) => {
        const newArtifact: Artifact = {
          ...artifactData,
          id: `user-${Date.now()}`,
          createdAt: new Date().toISOString(),
          brightness: 100,
          bonkPreservation: 0
        };
        
        set(state => ({
          nearbyArtifacts: [...state.nearbyArtifacts, newArtifact],
          createdArtifacts: [...state.createdArtifacts, newArtifact]
        }));
      }
    }),
    {
      name: 'artifact-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        discoveredArtifacts: state.discoveredArtifacts,
        createdArtifacts: state.createdArtifacts
      })
    }
  )
);