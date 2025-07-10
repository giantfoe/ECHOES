export interface Story {
  id: string;
  userId: string;
  artifactId: string;
  imageUri: string;
  title?: string;
  description?: string;
  createdAt: number;
  expiresAt: number;
  viewCount: number;
  isActive: boolean;
  viewers: string[];
  likes: string[];
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  textOverlay?: {
    text: string;
    position: { x: number; y: number };
    color: string;
    fontSize: number;
  };
}

export interface StoryView {
  storyId: string;
  userId: string;
  viewedAt: number;
}

export interface StoryCreationData {
  artifactId: string;
  imageUri: string;
  title?: string;
  description?: string;
  textOverlay?: {
    text: string;
    position: { x: number; y: number };
    color: string;
    fontSize: number;
  };
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface StoryAnalytics {
  storyId: string;
  totalViews: number;
  uniqueViewers: number;
  likes: number;
  shares: number;
  preservationRequests: number;
  engagementRate: number;
}