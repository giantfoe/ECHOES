# Changelog

All notable changes to the ECHOES project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Fixed app layout positioning issues where content appeared too high on phone screens
- Implemented proper SafeAreaView usage across all tab screens to respect device safe areas
- Added SafeAreaProvider to root layout for consistent safe area handling
- Updated StatusBar configuration to prevent content overlap with system UI
- Replaced custom StatusBar component with proper expo-status-bar implementation
- Fixed content visibility issues by properly handling top, left, and right safe area edges
- Fixed TypeError in GlassCard component by adding missing glassmorphism theme configuration
- Resolved VirtualizedList nesting warning by removing ScrollView wrapper and using FlatList ListHeaderComponent
- Fixed theme object structure by adding gradients and glassmorphism properties
- Updated StoriesCarousel to use theme spacing values instead of hardcoded numbers
- Fixed GlassCard component to handle undefined props gracefully
- Fixed stories not loading by implementing proper storage initialization and mock data

### Changed
- Simplified ArtifactCard design to focus on visual content with overlay-style information display
- Increased card height from 200px to 400px to show maximum 1.5 posts on screen for better visual impact
- Redesigned card layout with image overlay containing essential information: title, description, creator name, decay stage (brightness), and preserve button
- Added title and description back to cards with smart truncation functionality
- Implemented "See more"/"See less" toggle for descriptions longer than 80 characters
- Updated card spacing with larger bottom margins for better visual separation
- Implemented semi-transparent dark overlay on images for better text readability
- Enhanced overlay text hierarchy with larger title font and improved opacity for better readability
- Removed preservation level (brightness percentage) display from artifact cards for cleaner visual design
- Changed artifact card tap behavior from navigation to details page to Instagram-style full-screen image viewer
- Added ImageViewer component for displaying artifact images in full-screen modal with overlay information
- Implemented modal-based image viewing with backdrop tap to close and dedicated close button
- Removed header titles from tab navigation for cleaner UI experience
- Updated tab layout to hide page titles in the top navigation bar
- Removed map screen from navigation as it's no longer needed with the new discover feed approach
- Restructured navigation from 5 tabs to 4 tabs (Discover, Create, Archive, Profile)
- Made create tab icon uniform with other icons by removing special styling (background, padding, margin)
- Enhanced ArtifactCard component by removing separate donate button and combining like/donate functionality into a single "Preserve" button
- Updated preserve button to automatically send 0.1 dollar's worth of BONK when activated
- Redesigned preserve button with improved styling, border, and active states
- Changed preserve button icon from bookmark to heart to better represent the combined like/donate action
- Refactored card layout to integrate preserve button into the header area alongside stats for better visual balance
- Moved preserve button from bottom action area to top-right corner with compact styling
- Added conditional BONK donation indicator that appears below the card when preserved
- Updated artifactStore to include preservedArtifacts tracking and proper state management
- Modified DiscoverFeed component to work with new preserve-only interface
- Removed "DISCOVER ARTIFACTS" header text and "Pull down to refresh" subtitle from DiscoverFeed
- Removed pull-to-refresh functionality for cleaner interface

## [1.0.0] - 2024-12-19

### Fixed
- Critical memory leak in audio recording functionality that caused EXC_BREAKPOINT (SIGTRAP) crashes
- Proper timer cleanup in create screen to prevent VM allocation failures
- Added useEffect cleanup hooks to ensure timers are cleared on component unmount

### Added
- Initial project setup for ECHOES - Solana Visual & Audio Archaeology Platform
- Complete Expo React Native project structure with TypeScript
- Tab-based navigation system with 5 main screens:
  - Scanner: QR code and artifact scanning functionality (later replaced with Discover feed)
  - Map: Location-based artifact discovery interface (removed in restructure)
  - Create: Artifact creation and recording tools
  - Archive: Personal artifact collection management
  - Profile: User settings and statistics
- Audio recording and playback capabilities with custom AudioPlayer component
- Location services integration for artifact discovery
- Custom UI components:
  - ArtifactCard: Display artifact information
  - BonkSlider: Custom slider component
  - Scanner: QR code scanning interface
  - StatusBar: Custom status bar styling
- State management with Zustand:
  - artifactStore: Manage artifact data and discovery
  - userStore: Handle user preferences and statistics
- Custom theming and color system
- Mock data for development and testing
- Comprehensive .gitignore for Expo, React Native, and Android development
- Project configuration files (app.json, tsconfig.json, package.json)

### Technical Details
- Expo SDK 53.0.18
- React Native with Expo Router for file-based navigation
- TypeScript configuration with strict mode
- Custom path mapping (@/* aliases)
- Multiple Expo modules: Camera, Audio, Location, Sensors, etc.
- Lucide React Native icons
- React Native SVG support