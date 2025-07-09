# Changelog

All notable changes to the ECHOES project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2024-12-19

### Added
- Initial project setup for ECHOES - Solana Visual & Audio Archaeology Platform
- Complete Expo React Native project structure with TypeScript
- Tab-based navigation system with 5 main screens:
  - Scanner: QR code and artifact scanning functionality
  - Map: Location-based artifact discovery interface
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