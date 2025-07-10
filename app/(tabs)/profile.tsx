import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Zap, Bell, Eye, Moon } from 'lucide-react-native';
import { useArtifactStore } from '../../stores/artifactStore';
import { theme, globalStyles } from '../../constants/theme';

type SettingKey = 'notifications' | 'arMode' | 'darkMode';

interface Settings {
  notifications: boolean;
  arMode: boolean;
  darkMode: boolean;
}

export default function ProfileScreen() {
  const { 
    bonkBalance, 
    addBonk, 
    artifactsCreated, 
    artifactsDiscovered, 
    tipsReceived, 
    tipsSent 
  } = useArtifactStore();
  
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    arMode: false,
    darkMode: false,
  });
  
  const handleToggleSetting = (key: SettingKey) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const handleAddFunds = () => {
    // In a real app, this would open a payment flow
    addBonk(100);
  };
  
  return (
    <SafeAreaView style={globalStyles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* User info */}
          <View style={styles.userContainer}>
            <View style={styles.avatarContainer}>
              <User size={48} color={theme.colors.text} />
            </View>
            <Text style={styles.username}>DIGITAL ARCHAEOLOGIST</Text>
            <Text style={styles.userBio}>Preserving digital memories since 2023</Text>
          </View>
          
          {/* BONK balance */}
          <View style={styles.balanceContainer}>
            <View style={styles.balanceHeader}>
              <Zap size={20} color={theme.colors.accent} />
              <Text style={styles.balanceTitle}>BONK BALANCE</Text>
            </View>
            <Text style={styles.balanceAmount}>{bonkBalance}</Text>
            <TouchableOpacity 
              style={styles.addFundsButton}
              onPress={handleAddFunds}
              activeOpacity={0.7}
            >
              <Text style={styles.addFundsText}>ADD FUNDS</Text>
            </TouchableOpacity>
          </View>
          
          {/* Stats */}
          <Text style={styles.sectionTitle}>STATISTICS</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{artifactsCreated}</Text>
              <Text style={styles.statLabel}>CREATED</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{artifactsDiscovered}</Text>
              <Text style={styles.statLabel}>DISCOVERED</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{tipsReceived}</Text>
              <Text style={styles.statLabel}>RECEIVED</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{tipsSent}</Text>
              <Text style={styles.statLabel}>SENT</Text>
            </View>
          </View>
          
          {/* Settings */}
          <Text style={styles.sectionTitle}>SETTINGS</Text>
          <View style={styles.settingsContainer}>
            <View style={styles.settingItem}>
              <View style={styles.settingLabelContainer}>
                <Bell size={16} color={theme.colors.text} />
                <Text style={styles.settingLabel}>NOTIFICATIONS</Text>
              </View>
              <Switch
                value={settings.notifications}
                onValueChange={() => handleToggleSetting('notifications')}
                trackColor={{ false: theme.colors.inactive, true: theme.colors.accent }}
                thumbColor={theme.colors.text}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLabelContainer}>
                <Eye size={16} color={theme.colors.text} />
                <Text style={styles.settingLabel}>AR MODE</Text>
              </View>
              <Switch
                value={settings.arMode}
                onValueChange={() => handleToggleSetting('arMode')}
                trackColor={{ false: theme.colors.inactive, true: theme.colors.accent }}
                thumbColor={theme.colors.text}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLabelContainer}>
                <Moon size={16} color={theme.colors.text} />
                <Text style={styles.settingLabel}>DARK MODE</Text>
              </View>
              <Switch
                value={settings.darkMode}
                onValueChange={() => handleToggleSetting('darkMode')}
                trackColor={{ false: theme.colors.inactive, true: theme.colors.accent }}
                thumbColor={theme.colors.text}
              />
            </View>
          </View>
          
          {/* App info */}
          <View style={styles.appInfoContainer}>
            <Text style={styles.appName}>SOLANA ECHOES</Text>
            <Text style={styles.appVersion}>VERSION 1.0.0</Text>
            <Text style={styles.appCopyright}>© 2025 DIGITAL ARCHAEOLOGY COLLECTIVE</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  userContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.accent,
    shadowColor: theme.colors.accent,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontFamily: 'Qurova',
  },
  userBio: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    textAlign: 'center',
    fontFamily: 'Qurova',
  },
  balanceContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    fontFamily: 'Qurova',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.colors.accent,
    marginBottom: theme.spacing.md,
    fontFamily: 'Qurova',
  },
  addFundsButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addFundsText: {
    color: theme.colors.background,
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'Qurova',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    fontFamily: 'Qurova',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.xl,
  },
  statItem: {
    width: '50%',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontFamily: 'Qurova',
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.secondaryText,
    fontFamily: 'Qurova',
  },
  settingsContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    fontFamily: 'Qurova',
  },
  appInfoContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontFamily: 'Qurova',
  },
  appVersion: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.sm,
    fontFamily: 'Qurova',
  },
  appCopyright: {
    fontSize: 12,
    color: theme.colors.secondaryText,
    fontFamily: 'Qurova',
  },
});