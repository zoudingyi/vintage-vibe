# Vintage Vibe

Vintage Vibe is a playable React portfolio that combines a Windows 95-inspired desktop shell with a Vaporwave boot screen. Applications open in managed windows and share desktop-level interactions instead of behaving like separate pages.

Planned visual effects, audio features, and desktop applications are tracked in [ROADMAP.md](ROADMAP.md).

## Desktop features

- Draggable, resizable, minimizable, maximizable windows.
- Active-window focus, taskbar switching, cascading, tiling, and Show Desktop.
- Keyboard navigation for desktop icons, the Start menu, and open windows.
- Responsive full-screen windows and single-tap app launching on compact or touch devices.
- Persistent themes, window geometry, and optional session restore.
- Eight curated react95 system themes with live color previews.
- Five-page Settings app for appearance, desktop icons, taskbar, audio, and system behavior.
- Eight wallpapers, including an animated Neon Horizon and a local Pixel Clouds background.
- Profile, project explorer, Vaporwave Radio, media player, settings, terminal, guestbook, and system applications.
- Reduced-motion support and versioned local-storage recovery.

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `Enter` or `Space` | Open the focused desktop icon or Start menu item |
| Arrow keys | Move between desktop icons or Start menu items |
| `Ctrl + Esc` | Toggle the Start menu |
| `Esc` | Dismiss the Start menu or desktop context menu |
| `Alt + Tab` | Switch visible windows |
| `Shift + Alt + Tab` | Switch visible windows in reverse |
| `Alt + F4` | Close the active window |

## Development

This repository uses pnpm and the checked-in `pnpm-lock.yaml`.

```bash
pnpm install
pnpm start
CI=true pnpm test --watchAll=false
pnpm build
```

Application source lives in `src/desktop/apps/`, while `src/desktop/appRegistry.js` defines which applications appear on the desktop and in the Start menu. Window lifecycle and geometry are managed by `DesktopProvider` and `windowReducer`.

## Local data

Desktop settings and restorable window sessions are stored in the browser under a versioned `vintage-vibe-desktop-state` key. The Settings app can disable restoration, clear only the window session, reset appearance, or reset every preference. Guestbook entries use a separate local key and remain private to the current browser.

## Settings pages

- **Appearance** controls the react95 theme, wallpaper, scanlines, and scanline strength with a live CRT monitor preview.
- **Desktop** controls column/grid icon layout, small/medium/large icon sizing, and three selectable icon selection effects.
- **Taskbar** controls 12/24-hour clock formatting, seconds, and icon-only window buttons.
- **Audio** controls the global sound switch, master volume, synthesized test tone, and three persistent Vaporwave Radio appearances.
- **System** controls session restore, the boot log, scoped resets, and window-session cleanup.

## System themes

Settings includes Windows 95, Sixties USA, Vapor Teal, Candy, Lilac, Matrix, Modern Dark, and High Contrast themes. The selected react95 theme updates windows, controls, menus, the taskbar, and matching desktop accent colors, while wallpaper remains independently configurable.

The Terminal app also accepts `theme original`, `theme vapor`, `theme candy`, `theme lilac`, `theme matrix`, `theme dark`, and `theme contrast`. Legacy `purple`, `green`, and `amber` aliases remain supported.

Hidden vaporwave presets are available through `aesthetic` (Vapor Teal, Neon Horizon, strong scanlines), `mallsoft` (Candy, Pixel Clouds, subtle scanlines), `vhs on`, `vhs off`, and `sunset`. They intentionally remain absent from Terminal `help` output.
