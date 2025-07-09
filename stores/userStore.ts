import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  bonkBalance: number;
  tipsReceived: number;
  tipsSent: number;
  artifactsCreated: number;
  artifactsDiscovered: number;
  settings: {
    notifications: boolean;
    arMode: boolean;
    darkMode: boolean;
  };
  
  // Actions
  addBonk: (amount: number) => void;
  spendBonk: (amount: number) => void;
  receiveTip: (amount: number) => void;
  sendTip: (amount: number) => void;
  incrementArtifactsCreated: () => void;
  incrementArtifactsDiscovered: () => void;
  updateSettings: (settings: Partial<UserState['settings']>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      bonkBalance: 1250,
      tipsReceived: 850,
      tipsSent: 320,
      artifactsCreated: 12,
      artifactsDiscovered: 47,
      settings: {
        notifications: true,
        arMode: true,
        darkMode: true,
      },
      
      addBonk: (amount: number) => set(state => ({ bonkBalance: state.bonkBalance + amount })),
      spendBonk: (amount: number) => set(state => ({ bonkBalance: Math.max(0, state.bonkBalance - amount) })),
      receiveTip: (amount: number) => set(state => ({ 
        bonkBalance: state.bonkBalance + amount,
        tipsReceived: state.tipsReceived + amount
      })),
      sendTip: (amount: number) => set(state => ({ 
        bonkBalance: Math.max(0, state.bonkBalance - amount),
        tipsSent: state.tipsSent + amount
      })),
      incrementArtifactsCreated: () => set(state => ({ artifactsCreated: state.artifactsCreated + 1 })),
      incrementArtifactsDiscovered: () => set(state => ({ artifactsDiscovered: state.artifactsDiscovered + 1 })),
      updateSettings: (newSettings) => set(state => ({ 
        settings: { ...state.settings, ...newSettings } 
      })),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);