# Audio-Visual Collage Tool Project Plan

## Project Overview
An interactive audio-visual collage tool that allows users to create complex layered compositions with support for various media types, procedural generation, and MIDI control.

## Core Features & Roadmap

### Phase 1: Core Infrastructure
- [x] Project Setup
  - [x] Initialize React + TypeScript frontend
  - [x] Set up Zustand state management
  - [x] Configure build system and development environment
  - [x] Set up local storage for persistence
  - [x] Configure TypeScript
  - [x] Set up development environment

- [x] Basic Media Layer System
  - [x] Implement base layer class/interface
  - [x] Support for image layers
  - [x] Support for GIF layers
  - [x] Support for video layers
  - [x] Basic layer transformation (position, scale, rotation)
  - [x] Layer ordering system

### Phase 2: Advanced Layer Features
- [ ] Shape-Based Layer Support
  - [x] Rectangle shape support
  - [x] Circle shape support
  - [x] Triangle shape support
  - [ ] Custom shape drawing tools
  - [ ] Shape combination operations
  - [ ] Shape pattern generation

- [ ] Pattern System
  - [x] Pattern definition system
  - [x] Pattern application to layers
  - [x] Pattern modification tools
  - [ ] Pattern animation system
  - [ ] Persist patterns to DB

- [ ] Advanced Video Control
  - [ ] Time offset management
    - [ ] Multiple instances of same video with different offsets
    - [ ] Synchronized offset control
    - [ ] Relative offset scheduling
  - [ ] Playback speed control
    - [ ] Per-video playback rate adjustment
    - [ ] Animation curves for speed changes
    - [ ] MIDI-controlled speed adjustment
  - [ ] Video sampling and manipulation
    - [ ] Frame extraction and processing
    - [ ] Time slicing effects
    - [ ] Video looping configuration

### Phase 3: Procedural Generation
- [ ] Procedural Pattern Generation
  - [ ] Random pattern generation
  - [ ] Rule-based pattern generation
  - [ ] Pattern parameter controls
  - [ ] Pattern preview system
  - [ ] Pattern export/import

- [ ] Hydra Integration
  - [ ] Hydra shader support
  - [ ] Hydra pattern generation
  - [ ] Hydra layer effects
  - [ ] Hydra parameter controls
  - [ ] Hydra pattern presets

- [ ] Pattern Scripting System
  - [ ] Script-based pattern generation
    - [ ] Custom JavaScript pattern scripts
    - [ ] Script editor with syntax highlighting
    - [ ] Parameter binding to script variables
  - [ ] Script scheduling and sequencing
    - [ ] Time-based script execution
    - [ ] Event-triggered script execution
    - [ ] Script chaining and dependencies
  - [ ] Script library and management
    - [ ] Script import/export
    - [ ] Script versioning
    - [ ] Script sharing system

### Phase 4: MIDI Integration
- [ ] MIDI Control System
  - [ ] MIDI input detection
  - [ ] MIDI mapping interface
  - [ ] MIDI parameter control
  - [ ] MIDI pattern triggering
  - [ ] MIDI preset system

### Phase 5: User Interface & Experience
- [ ] Layer Management UI
  - [ ] Layer list interface
  - [ ] Layer properties panel
  - [ ] Layer transformation controls
  - [ ] Layer visibility controls
  - [ ] Layer grouping system
  - [ ] Layer-specific pattern targeting
  - [ ] Interactive layer sidebar
    - [ ] Layer list with drag-and-drop reordering
    - [ ] Add/remove layer controls
    - [ ] Layer media selection interface
    - [ ] Layer pattern assignment
    - [ ] Layer visibility toggles
    - [ ] Layer transformation controls
    - [ ] Detachable sidebar window support
      - [ ] Pop-out functionality for secondary monitors
      - [ ] Sync state between main window and detached sidebar
      - [ ] Persist detached window state

- [ ] Media Source Management
  - [ ] URL quick-switching system
    - [ ] URL presets for rapid source changes
    - [ ] Keyboard shortcuts for URL switching
    - [ ] URL history management
  - [ ] Transition effects
    - [ ] Fade in/out for video sources
    - [ ] Cross-fade between compositions
    - [ ] Configurable transition timing
    - [ ] Transition triggering via MIDI

- [ ] Pattern Management UI
  - [ ] Pattern library interface
  - [ ] Pattern creation tools
  - [ ] Pattern parameter controls
  - [ ] Pattern preview system
  - [ ] Pattern export/import interface
  - [ ] Pattern preview in sidebar
    - [ ] Live pattern preview for selected layer
    - [ ] Pattern thumbnail generation
    - [ ] Pattern animation preview
    - [ ] Pattern parameter visualization

- [ ] Pattern Parameter System
  - [ ] Dynamic parameter controls
    - [ ] Customizable parameter slots (p1, p2, p3, etc.)
    - [ ] Parameter type selection (number, function, etc.)
    - [ ] Built-in function library (sin, cos, etc.)
    - [ ] Custom function input
    - [ ] Parameter animation controls
    - [ ] Parameter linking between layers
    - [ ] LFO modulation system
      - [ ] Multiple waveform types (sine, square, triangle, etc.)
      - [ ] Per-parameter LFO assignment
      - [ ] LFO rate and depth controls
      - [ ] LFO sync options (free, tempo, other parameters)
  - [ ] Parameter UI Components
    - [ ] Parameter sliders and inputs
    - [ ] Function selector interface
    - [ ] Parameter animation timeline
    - [ ] Parameter value visualization
    - [ ] Parameter presets system

- [ ] MIDI Control UI
  - [ ] MIDI device selection
  - [ ] MIDI mapping interface
  - [ ] MIDI parameter controls
  - [ ] MIDI preset management

## Technical Requirements

### Frontend Architecture
- [x] React with TypeScript
- [x] Zustand for state management
- [ ] Canvas/WebGL for rendering
- [x] MIDI.js for MIDI support
- [x] Hydra.js integration
- [x] Local storage for data persistence
- [ ] IndexedDB for larger media storage

### Dependencies
- Phase 1 must be completed before any other phases
- Hydra integration requires basic pattern system
- MIDI integration requires pattern system
- UI development can happen in parallel with core features

## Architecture & Code Organization

### Core Principles
- **KISS (Keep It Simple, Stupid)**
  - [x] Avoid over-engineering solutions
  - [x] Write clear, straightforward code
  - [x] Break down complex problems into simpler parts
  - [x] Use simple, descriptive naming conventions

- **SOLID Principles**
  - [x] Single Responsibility Principle (SRP)
    - Each component/hook/class should have one reason to change
    - Separate concerns into distinct modules
  - [x] Open/Closed Principle (OCP)
    - Design for extension without modification
    - Use composition over inheritance
  - [x] Liskov Substitution Principle (LSP)
    - Ensure derived classes can substitute their base classes
    - Maintain consistent interfaces
  - [x] Interface Segregation Principle (ISP)
    - Create specific interfaces for specific clients
    - Avoid "fat" interfaces
  - [x] Dependency Inversion Principle (DIP)
    - Depend on abstractions, not concrete implementations
    - Use dependency injection where appropriate

### File Organization
- [x] Duck Pattern Structure implemented
- [x] Feature-based organization
- [x] Clear separation of concerns
- [x] Proper directory structure

### Component Organization
- [x] One component per file
- [x] Components should be self-contained
- [x] Use composition for complex UI elements
- [x] Keep components focused and small
- [x] Extract reusable logic into custom hooks

### Custom Hooks
- [x] Each hook in its own file
- [x] Hooks should be focused and single-purpose
- [x] Use TypeScript for hook typing
- [x] Document hook parameters and return values
- [x] Test hooks independently

### State Management
- [x] Use Zustand stores for global state
- [x] Keep stores focused and minimal
- [x] Use local state for component-specific data
- [x] Implement proper state normalization
- [x] Use selectors for derived state

### Code Quality
- [x] Implement ESLint with strict rules
- [x] Use Prettier for consistent formatting
- [x] Set up pre-commit hooks
- [x] Implement proper TypeScript strict mode
- [x] Document complex logic and decisions

## Implementation Tasks

### Frontend Setup
- [x] Create React project with TypeScript
- [x] Configure build system (Webpack/Vite)
- [x] Set up Zustand store structure
- [x] Create basic component structure
- [x] Set up routing system
- [x] Configure development environment

### Data Persistence
- [ ] Implement local storage system
- [ ] Set up IndexedDB for media storage
- [ ] Create data serialization/deserialization
- [ ] Implement auto-save functionality
- [ ] Add export/import functionality

### Core Layer System
- [x] Design layer data structure
- [x] Implement layer rendering system
- [x] Create layer transformation system
- [x] Implement layer ordering
- [x] Add layer visibility controls
- [x] Create layer grouping system
- [ ] Implement transition effects
  - [ ] Fade in/out controls for layers
  - [ ] Cross-fade between layer states
  - [ ] Transition timing configuration

### Video Processing System
- [ ] Create video source management
  - [ ] Support for multiple instances of same source
  - [ ] Independent time offset control
  - [ ] Playback speed adjustment
  - [ ] Custom video loop points
- [ ] Implement video effect pipeline
  - [ ] Real-time video processing
  - [ ] Video shader effects
  - [ ] Frame buffer manipulation
- [ ] Add video synchronization
  - [ ] Beat-synced video playback
  - [ ] MIDI-triggered video events
  - [ ] Frame-accurate video control

### Pattern Scripting System
- [ ] Create scripting infrastructure
  - [ ] JavaScript execution environment
  - [ ] Pattern script compiler/interpreter
  - [ ] Script parameter binding
- [ ] Implement script editor
  - [ ] Code editing interface
  - [ ] Script testing tools
  - [ ] Debugging support
- [ ] Add script scheduling system
  - [ ] Time-based execution
  - [ ] Event-driven execution
  - [ ] Performance optimization

### Pattern System
- [ ] Design pattern data structure
- [ ] Implement pattern application system
- [ ] Create pattern modification tools
- [ ] Add pattern animation system
- [ ] Implement pattern presets
- [ ] Create pattern export/import system
- [ ] Build parameter modulation system
  - [ ] LFO implementation for all parameters
  - [ ] Multi-stage envelope generators
  - [ ] Modulation matrix for complex parameter relationships
  - [ ] Modulation visualization tools

### Hydra Integration
- [ ] Set up Hydra.js
- [ ] Create Hydra pattern system
- [ ] Implement Hydra effects
- [ ] Add Hydra parameter controls
- [ ] Create Hydra pattern presets
- [ ] Implement Hydra layer effects

### MIDI Integration
- [ ] Set up MIDI.js
- [ ] Create MIDI input system
- [ ] Implement MIDI mapping
- [ ] Add MIDI parameter control
- [ ] Create MIDI preset system
- [ ] Implement MIDI pattern triggering

## Next Steps
1. [x] Set up development environment
2. [x] Create basic project structure
3. [x] Implement core layer system
4. [ ] Add basic pattern support
5. [ ] Integrate Hydra
6. [ ] Add MIDI support
7. [ ] Develop user interface
8. [ ] Test and refine features
9. [ ] Implement parameter modulation with LFOs

## Notes
- Consider using WebGL for better performance with complex patterns
- Implement progressive loading for large media files
- Add support for layer masks and blending modes
- Consider adding audio visualization features
- Plan for future expansion of pattern types and effects
- Use browser's IndexedDB for storing larger media files
- Implement proper cleanup for media resources
- Explore Electron integration for better windowing support
- Consider WebRTC for sharing compositions between windows
