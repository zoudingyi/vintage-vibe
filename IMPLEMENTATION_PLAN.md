# Desktop Shell 1.0 Implementation Plan

## Stage 1: Window State Core
**Goal**: Centralize window lifecycle and geometry in a predictable state model.
**Success Criteria**: Window actions preserve app state, maintain a valid active window, and expose position, size, and status through the desktop context.
**Tests**: Open/focus/minimize/restore/close behavior, focus fallback, duplicate app handling, and state preservation while minimized.
**Status**: In Progress

## Stage 2: Window Controls and Taskbar
**Goal**: Add bounded movement, resizing, maximize/restore, taskbar toggling, and desktop window arrangement.
**Success Criteria**: Windows remain recoverable, taskbar behavior matches desktop conventions, and context-menu actions arrange or hide windows correctly.
**Tests**: Maximize/restore geometry, active task toggling, show desktop, cascade/tile layouts, and geometry constraints.
**Status**: Not Started

## Stage 3: Keyboard, Focus, and Accessibility
**Goal**: Make the desktop shell fully operable without a mouse.
**Success Criteria**: Desktop icons, start menu, and windows support documented keyboard commands with visible focus and appropriate semantics.
**Tests**: Icon navigation, Enter, Escape, Ctrl+Escape, Alt+Tab, Alt+F4, dialog labelling, and focus restoration.
**Status**: Not Started

## Stage 4: Responsive Desktop and Session Restore
**Goal**: Support narrow/touch screens and versioned persistence for desktop settings and window sessions.
**Success Criteria**: Key content fits common viewport sizes, touch users can open apps, and valid sessions restore without making corrupted data fatal.
**Tests**: Storage migration/fallback, restore opt-out, window session restore, settings reset isolation, and responsive interaction modes.
**Status**: Not Started

## Stage 5: Application Modules and Quality Gates
**Goal**: Split desktop applications into focused modules, replace placeholders, remove legacy code, and finish documentation.
**Success Criteria**: The app registry is declarative, routes and content are complete, project-controlled warnings are removed, and all quality gates pass.
**Tests**: Registry validation, primary app behavior, route behavior, full regression suite, production build, and diff checks.
**Status**: Not Started
