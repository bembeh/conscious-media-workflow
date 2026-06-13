# Conscious Media — YouTube Thumbnail Workflow Hub

A premium browser-based YouTube thumbnail builder and production workflow system for the **Conscious Media** channel — focused on reggae history, reggae culture, dancehall, artist birthdays, music documentaries, and Caribbean storytelling.

## Features

- 🎨 **Live Thumbnail Builder** — Real-time 1280×720 canvas with layered effects
- 📁 **Drag & Drop Image Upload** — Upload your own artist photo or background image
- 🎛️ **Editor Controls** — Typography, color themes, glows, vignette, overlays
- 📋 **7 Preset Templates** — March Birthday, Roots Doc, Dancehall, Top 10, History, Commentary, Radio Promo
- 🤖 **AI Copywriter** — Generates thumbnail text suggestions per category
- ☁️ **Google Workspace Integration** — Connects to Google Drive & Google Sheets
- 📊 **Content Database Tracker** — Tracks videos, status, links, upload dates
- 📱 **Mobile & YouTube Feed Simulators** — Preview how thumbnails look on mobile

## Brand System

| Color | Name | Hex |
|---|---|---|
| 🟩 | Roots Green | `#1A4C32` |
| 🟡 | Imperial Gold | `#E6B325` |
| 🔴 | Livity Red | `#A82424` |
| ⬛ | Midnight Black | `#0B0C10` |

## Usage

Open `index.html` directly in any browser — **no server required**.

Or serve locally:
```bash
npx http-server . -p 3007
```

Then open `http://localhost:3007`

## Project Structure

```
├── index.html        # App shell & UI
├── styles.css        # Full design system
├── app.js            # All logic, rendering, Google API integration
└── assets/
    ├── reggae_legend.png      # Default artist image
    └── reggae_poster_bg.png   # Vintage texture background
```

## Google Workspace Setup

To enable Google Drive & Sheets sync:
1. Create a Google Cloud project
2. Enable Drive API and Sheets API
3. Create OAuth2 credentials (Web client)
4. Enter your Client ID in the **G-Connect Setup** tab

---

Built with ❤️ for **Conscious Media** | Reggae Culture • Roots History • Documentary Creator
