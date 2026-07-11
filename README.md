# Vintage Vibe

Vintage Vibe is a playable React portfolio that combines a Windows 95-inspired desktop shell with a Vaporwave boot screen. Applications open in managed windows and share desktop-level interactions instead of behaving like separate pages.

## Desktop features

- Draggable, resizable, minimizable, maximizable windows.
- Active-window focus, taskbar switching, cascading, tiling, and Show Desktop.
- Keyboard navigation for desktop icons, the Start menu, and open windows.
- Responsive full-screen windows and single-tap app launching on compact or touch devices.
- Persistent themes, window geometry, and optional session restore.
- Eight curated react95 system themes with live color previews.
- Profile, project explorer, media player, settings, terminal, guestbook, and system applications.
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

Desktop settings and restorable window sessions are stored in the browser under a versioned `vintage-vibe-desktop-state` key. The Settings app can disable restoration, clear only the window session, or reset personalization. Guestbook entries use a separate local key and remain private to the current browser.

## System themes

Settings includes Windows 95, Sixties USA, Vapor Teal, Candy, Lilac, Matrix, Modern Dark, and High Contrast themes. The selected react95 theme updates windows, controls, menus, the taskbar, and matching desktop accent colors, while wallpaper remains independently configurable.

The Terminal app also accepts `theme original`, `theme vapor`, `theme candy`, `theme lilac`, `theme matrix`, `theme dark`, and `theme contrast`. Legacy `purple`, `green`, and `amber` aliases remain supported.
