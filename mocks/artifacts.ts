export interface Artifact {
  id: string;
  type: 'photo' | 'link';
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
  createdAt: string;
  brightness: number; // 0-100, represents how "fresh" the memory is
  creator: {
    id: string;
    name: string;
  };
  mediaUrl?: string; // URL to photo if type is photo
  linkUrl?: string; // URL for link type artifacts
  bonkPreservation: number; // Amount of BONK used to preserve
}

export const artifacts: Artifact[] = [
  {
    id: '1',
    type: 'photo',
    title: 'Sunset Memories',
    description: "This view never gets old. I come here every evening to watch the sunset and reflect on the day.",
    location: {
      latitude: 34.0522,
      longitude: -118.2437,
      name: 'Downtown Viewpoint'
    },
    createdAt: '2023-07-15T18:30:00Z',
    brightness: 70,
    creator: {
      id: 'user1',
      name: 'Alex'
    },
    mediaUrl: 'https://images.unsplash.com/photo-1472120435266-53107fd0c44a?q=80&w=500',
    bonkPreservation: 250
  },
  {
    id: '2',
    type: 'photo',
    title: 'Street Art Discovery',
    description: "Found this amazing mural today. The artist must have spent days on this masterpiece.",
    location: {
      latitude: 34.0511,
      longitude: -118.2428,
      name: 'Arts District'
    },
    createdAt: '2023-08-22T14:15:00Z',
    brightness: 85,
    creator: {
      id: 'user2',
      name: 'Jordan'
    },
    mediaUrl: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?q=80&w=500',
    bonkPreservation: 180
  },
  {
    id: '3',
    type: 'link',
    title: 'City Soundscape',
    description: "Check out this amazing collection of urban sounds I found. Perfect for meditation and focus.",
    location: {
      latitude: 34.0535,
      longitude: -118.2450,
      name: 'Central Plaza'
    },
    createdAt: '2023-09-05T22:45:00Z',
    brightness: 60,
    creator: {
      id: 'user3',
      name: 'Taylor'
    },
    linkUrl: 'https://example.com/city-sounds',
    bonkPreservation: 120
  },
  {
    id: '4',
    type: 'photo',
    title: 'Historic Building',
    description: "This building is over 100 years old. If you look closely, you can see the original architectural details.",
    location: {
      latitude: 34.0540,
      longitude: -118.2460,
      name: 'Heritage District'
    },
    createdAt: '2023-10-12T10:20:00Z',
    brightness: 45,
    creator: {
      id: 'user4',
      name: 'Morgan'
    },
    mediaUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=500',
    bonkPreservation: 300
  },
  {
    id: '5',
    type: 'photo',
    title: 'Hidden Garden',
    description: "I stumbled upon this secret garden tucked away between two buildings. A true urban oasis.",
    location: {
      latitude: 34.0515,
      longitude: -118.2445,
      name: 'Secret Spot'
    },
    createdAt: '2023-11-03T15:10:00Z',
    brightness: 90,
    creator: {
      id: 'user5',
      name: 'Casey'
    },
    mediaUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=500',
    bonkPreservation: 210
  }
];