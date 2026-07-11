# React95 Theme Settings Implementation Plan

## Stage 1: Theme Registry and Persistence
**Goal**: Define a curated react95 theme registry and persist a validated theme choice with legacy accent migration.
**Success Criteria**: Eight supported themes have stable ids and metadata; missing, legacy, and invalid stored values normalize predictably.
**Tests**: Registry completeness, default theme, invalid fallback, and legacy accent migration.
**Status**: Complete

## Stage 2: Dynamic Desktop Theme
**Goal**: Apply the selected react95 theme and matching shell accent tokens to the complete desktop subtree.
**Success Criteria**: Changing the setting immediately updates react95 components and custom desktop chrome without affecting wallpaper or session state.
**Tests**: Theme provider behavior, persisted reload, and independent wallpaper behavior.
**Status**: Complete

## Stage 3: Settings and Terminal Controls
**Goal**: Add accessible theme previews to Settings and update terminal theme commands with legacy aliases.
**Success Criteria**: Users can select all curated themes, see the active choice, reset safely, and switch themes through documented terminal commands.
**Tests**: Settings selection, active state, terminal commands, reset, and compact layout behavior.
**Status**: Complete

## Stage 4: Regression and Delivery
**Goal**: Complete documentation, browser verification, and all repository quality gates.
**Success Criteria**: Desktop and compact theme switching works in a real browser; tests, lint, build, and diff checks pass; no temporary artifacts remain.
**Tests**: Full Jest suite, ESLint, production build, wide/narrow browser smoke tests, and persisted refresh.
**Status**: In Progress
