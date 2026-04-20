# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Overview

This is a **观点交易所 (Opinion Exchange)** - a concept demo where users can trade opinions like stocks, participate in structured debates, and bet on positions with points. It's a frontend-only Next.js 16 application with mocked data.

## Technology Stack

- **Next.js 16.2.1** (App Router)
- **React 19.2.4** + TypeScript
- **Tailwind CSS 4**
- **HTML Canvas** for chart rendering

## Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server on http://localhost:3000 |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Architecture

This is a **frontend-only demo** (no backend). All data is in `src/lib/mock-data.ts`.

### Key Directories

- **`src/app/`** - Next.js App Router pages:
  - `page.tsx` - Home page (opinion marketplace)
  - `opinion/[id]/page.tsx` - Opinion detail with price chart
  - `debate/page.tsx` - Debate list
  - `debate/[id]/page.tsx` - Debate room
  - `profile/page.tsx` - User profile/holdings

- **`src/components/`** - Reusable UI components:
  - `Navbar.tsx` - Top navigation
  - `OpinionCard.tsx` - Opinion listing card
  - `Sparkline.tsx` - Canvas-based mini price chart
  - `TradeModal.tsx` - Buy/sell interface

- **`src/lib/`** - Type definitions and data:
  - `types.ts` - Core interfaces (Opinion, Debate, UserProfile, etc.)
  - `mock-data.ts` - All mock data including price history generator

### Important Notes

- This is Next.js 16 with breaking changes from older versions - read `node_modules/next/dist/docs/` before modifying Next.js-specific code
- All data is mocked - no API calls or backend integration
- Charts are rendered with HTML Canvas, not external charting libraries
