import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Story, StoryCreationData, StoryView, StoryAnalytics } from '../types/Story';

interface StoryStore {
  stories: Story[];
  activeStories: Story[];
  userStories: Story[];
  currentStoryIndex: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createStory: (data: StoryCreationData) => Promise<Story>;
  getStories: () => Promise<void>;
  getActiveStories: () => Promise<void>;
  getUserStories: (userId: string) => Promise<void>;
  viewStory: (storyId: string, userId: string) => Promise<void>;
  likeStory: (storyId: string, userId: string) => Promise<void>;
  deleteStory: (storyId: string) => Promise<void>;
  preserveStory: (storyId: string) => Promise<void>;
  cleanupExpiredStories: () => Promise<void>;
  setCurrentStoryIndex: (index: number) => void;
  getStoryAnalytics: (storyId: string) => Promise<StoryAnalytics>;
  createMockStories: () => Promise<Story[]>;
}

const STORIES_STORAGE_KEY = 'echoes_stories';
const STORY_VIEWS_STORAGE_KEY = 'echoes_story_views';

export const useStoryStore = create<StoryStore>((set, get) => ({
  stories: [],
  activeStories: [],
  userStories: [],
  currentStoryIndex: 0,
  isLoading: false,
  error: null,

  createStory: async (data: StoryCreationData) => {
    try {
      set({ isLoading: true, error: null });
      
      const now = Date.now();
      const story: Story = {
        id: `story_${now}_${Math.random().toString(36).substr(2, 9)}`,
        userId: 'current_user', // TODO: Get from auth store
        artifactId: data.artifactId,
        imageUri: data.imageUri,
        title: data.title,
        description: data.description,
        createdAt: now,
        expiresAt: now + (24 * 60 * 60 * 1000), // 24 hours
        viewCount: 0,
        isActive: true,
        viewers: [],
        likes: [],
        location: data.location,
        textOverlay: data.textOverlay,
      };

      const currentStories = get().stories;
      const updatedStories = [story, ...currentStories];
      
      await AsyncStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(updatedStories));
      
      set({ 
        stories: updatedStories,
        isLoading: false 
      });
      
      // Refresh active stories
      await get().getActiveStories();
      
      return story;
    } catch (error) {
      set({ error: 'Failed to create story', isLoading: false });
      throw error;
    }
  },

  getStories: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const storiesData = await AsyncStorage.getItem(STORIES_STORAGE_KEY);
      let stories = storiesData ? JSON.parse(storiesData) : [];
      
      // If no stories exist, create some mock stories for demo
      if (stories.length === 0) {
        stories = await get().createMockStories();
      }
      
      set({ stories, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load stories', isLoading: false });
    }
  },

  getActiveStories: async () => {
    try {
      // First load all stories from storage if not already loaded
      if (get().stories.length === 0) {
        await get().getStories();
      }
      
      const now = Date.now();
      const allStories = get().stories;
      
      const activeStories = allStories.filter(story => 
        story.isActive && story.expiresAt > now
      );
      
      set({ activeStories });
    } catch (error) {
      set({ error: 'Failed to load active stories' });
    }
  },

  getUserStories: async (userId: string) => {
    try {
      const allStories = get().stories;
      const userStories = allStories.filter(story => story.userId === userId);
      
      set({ userStories });
    } catch (error) {
      set({ error: 'Failed to load user stories' });
    }
  },

  viewStory: async (storyId: string, userId: string) => {
    try {
      const stories = get().stories;
      const storyIndex = stories.findIndex(s => s.id === storyId);
      
      if (storyIndex === -1) return;
      
      const story = stories[storyIndex];
      
      // Add viewer if not already viewed
      if (!story.viewers.includes(userId)) {
        const updatedStory = {
          ...story,
          viewers: [...story.viewers, userId],
          viewCount: story.viewCount + 1,
        };
        
        const updatedStories = [...stories];
        updatedStories[storyIndex] = updatedStory;
        
        await AsyncStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(updatedStories));
        set({ stories: updatedStories });
        
        // Store view record
        const viewsData = await AsyncStorage.getItem(STORY_VIEWS_STORAGE_KEY);
        const views: StoryView[] = viewsData ? JSON.parse(viewsData) : [];
        
        const newView: StoryView = {
          storyId,
          userId,
          viewedAt: Date.now(),
        };
        
        views.push(newView);
        await AsyncStorage.setItem(STORY_VIEWS_STORAGE_KEY, JSON.stringify(views));
      }
    } catch (error) {
      set({ error: 'Failed to record story view' });
    }
  },

  likeStory: async (storyId: string, userId: string) => {
    try {
      const stories = get().stories;
      const storyIndex = stories.findIndex(s => s.id === storyId);
      
      if (storyIndex === -1) return;
      
      const story = stories[storyIndex];
      const isLiked = story.likes.includes(userId);
      
      const updatedStory = {
        ...story,
        likes: isLiked 
          ? story.likes.filter(id => id !== userId)
          : [...story.likes, userId],
      };
      
      const updatedStories = [...stories];
      updatedStories[storyIndex] = updatedStory;
      
      await AsyncStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(updatedStories));
      set({ stories: updatedStories });
    } catch (error) {
      set({ error: 'Failed to like story' });
    }
  },

  deleteStory: async (storyId: string) => {
    try {
      const stories = get().stories;
      const updatedStories = stories.filter(s => s.id !== storyId);
      
      await AsyncStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(updatedStories));
      set({ stories: updatedStories });
      
      // Refresh active stories
      await get().getActiveStories();
    } catch (error) {
      set({ error: 'Failed to delete story' });
    }
  },

  preserveStory: async (storyId: string) => {
    try {
      // TODO: Integrate with BONK token system
      // This would convert the story to a permanent artifact
      console.log('Preserving story:', storyId);
    } catch (error) {
      set({ error: 'Failed to preserve story' });
    }
  },

  cleanupExpiredStories: async () => {
    try {
      const now = Date.now();
      const stories = get().stories;
      
      const activeStories = stories.map(story => ({
        ...story,
        isActive: story.expiresAt > now,
      }));
      
      await AsyncStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(activeStories));
      set({ stories: activeStories });
      
      // Refresh active stories
      await get().getActiveStories();
    } catch (error) {
      set({ error: 'Failed to cleanup expired stories' });
    }
  },

  setCurrentStoryIndex: (index: number) => {
    set({ currentStoryIndex: index });
  },

  getStoryAnalytics: async (storyId: string): Promise<StoryAnalytics> => {
    try {
      const story = get().stories.find(s => s.id === storyId);
      
      if (!story) {
        throw new Error('Story not found');
      }
      
      const viewsData = await AsyncStorage.getItem(STORY_VIEWS_STORAGE_KEY);
      const views: StoryView[] = viewsData ? JSON.parse(viewsData) : [];
      
      const storyViews = views.filter(v => v.storyId === storyId);
      
      return {
        storyId,
        totalViews: story.viewCount,
        uniqueViewers: story.viewers.length,
        likes: story.likes.length,
        shares: 0, // TODO: Implement sharing
        preservationRequests: 0, // TODO: Track preservation requests
        engagementRate: story.viewers.length > 0 ? (story.likes.length / story.viewers.length) * 100 : 0,
      };
    } catch (error) {
      throw new Error('Failed to get story analytics');
    }
  },

  createMockStories: async (): Promise<Story[]> => {
    const now = Date.now();
    const mockStories: Story[] = [
      {
        id: 'story_mock_1',
        userId: 'user_alice',
        artifactId: 'artifact_1',
        imageUri: 'https://picsum.photos/400/600?random=1',
        title: 'Digital Art Discovery',
        description: 'Found this amazing piece in the city center!',
        createdAt: now - (2 * 60 * 60 * 1000), // 2 hours ago
        expiresAt: now + (22 * 60 * 60 * 1000), // 22 hours from now
        viewCount: 15,
        isActive: true,
        viewers: ['user_bob', 'user_charlie'],
        likes: ['user_bob'],
        location: { latitude: 37.7749, longitude: -122.4194 },
      },
      {
        id: 'story_mock_2',
        userId: 'user_bob',
        artifactId: 'artifact_2',
        imageUri: 'https://picsum.photos/400/600?random=2',
        title: 'Street Art Gem',
        description: 'Hidden mural behind the coffee shop',
        createdAt: now - (4 * 60 * 60 * 1000), // 4 hours ago
        expiresAt: now + (20 * 60 * 60 * 1000), // 20 hours from now
        viewCount: 8,
        isActive: true,
        viewers: ['user_alice'],
        likes: ['user_alice', 'user_charlie'],
        location: { latitude: 37.7849, longitude: -122.4094 },
      },
      {
        id: 'story_mock_3',
        userId: 'user_charlie',
        artifactId: 'artifact_3',
        imageUri: 'https://picsum.photos/400/600?random=3',
        title: 'Museum Artifact',
        description: 'Ancient pottery at the local museum',
        createdAt: now - (1 * 60 * 60 * 1000), // 1 hour ago
        expiresAt: now + (23 * 60 * 60 * 1000), // 23 hours from now
        viewCount: 25,
        isActive: true,
        viewers: ['user_alice', 'user_bob', 'user_diana'],
        likes: ['user_alice', 'user_diana'],
        location: { latitude: 37.7649, longitude: -122.4294 },
      }
    ];

    // Save mock stories to storage
    await AsyncStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(mockStories));
    
    return mockStories;
  },
}));