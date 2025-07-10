import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useStoryStore } from '../stores/storyStore';

/**
 * Hook to manage story expiration and cleanup
 */
export const useStoryTimer = () => {
  const { cleanupExpiredStories } = useStoryStore();
  const appState = useRef(AppState.currentState);
  const cleanupInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initial cleanup
    cleanupExpiredStories();

    // Set up periodic cleanup every 5 minutes
    cleanupInterval.current = setInterval(() => {
      cleanupExpiredStories();
    }, 5 * 60 * 1000); // 5 minutes

    // Handle app state changes
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App has come to the foreground, cleanup expired stories
        cleanupExpiredStories();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      if (cleanupInterval.current) {
        clearInterval(cleanupInterval.current);
      }
      subscription?.remove();
    };
  }, [cleanupExpiredStories]);
};

/**
 * Calculate time remaining for a story
 */
export const getTimeRemaining = (expiresAt: number): {
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} => {
  const now = Date.now();
  const timeLeft = expiresAt - now;

  if (timeLeft <= 0) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return {
    hours,
    minutes,
    seconds,
    isExpired: false,
  };
};

/**
 * Format time remaining as a human-readable string
 */
export const formatTimeRemaining = (expiresAt: number): string => {
  const { hours, minutes, isExpired } = getTimeRemaining(expiresAt);

  if (isExpired) {
    return 'Expired';
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m left`;
  }

  if (minutes > 0) {
    return `${minutes}m left`;
  }

  return 'Less than 1m left';
};

/**
 * Check if a story is about to expire (within 1 hour)
 */
export const isStoryAboutToExpire = (expiresAt: number): boolean => {
  const { hours, isExpired } = getTimeRemaining(expiresAt);
  return !isExpired && hours < 1;
};

/**
 * Get expiration timestamp for a new story (24 hours from now)
 */
export const getStoryExpirationTime = (): number => {
  return Date.now() + (24 * 60 * 60 * 1000); // 24 hours
};

/**
 * Schedule a notification for story expiration warning
 * This would integrate with a notification system
 */
export const scheduleExpirationNotification = async (
  storyId: string,
  expiresAt: number
): Promise<void> => {
  // Calculate when to show warning (1 hour before expiration)
  const warningTime = expiresAt - (60 * 60 * 1000); // 1 hour before
  const now = Date.now();

  if (warningTime > now) {
    // TODO: Integrate with Expo Notifications or similar
    console.log(`Scheduling expiration warning for story ${storyId} at ${new Date(warningTime)}`);
    
    // Example implementation:
    // await Notifications.scheduleNotificationAsync({
    //   content: {
    //     title: 'Story Expiring Soon',
    //     body: 'Your story will expire in 1 hour. Preserve it now!',
    //     data: { storyId },
    //   },
    //   trigger: { date: new Date(warningTime) },
    // });
  }
};

/**
 * Cancel scheduled notification for a story
 */
export const cancelExpirationNotification = async (storyId: string): Promise<void> => {
  // TODO: Integrate with notification system
  console.log(`Cancelling expiration notification for story ${storyId}`);
  
  // Example implementation:
  // await Notifications.cancelScheduledNotificationAsync(notificationId);
};