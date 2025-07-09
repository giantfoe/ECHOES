# Changelog

All notable changes to the ECHOES project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Removed header titles from tab navigation for cleaner UI experience
- Updated tab layout to hide page titles in the top navigation bar
- Removed map screen from navigation as it's no longer needed with the new discover feed approach
- Restructured navigation from 5 tabs to 4 tabs (Discover, Create, Archive, Profile)
- Made create tab icon uniform with other icons by removing special styling (background, padding, margin)

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