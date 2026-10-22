# Project Rules: My College Life

## Overview
- **Project**: "My College Life" — an AI-powered student companion web app.
- **Stack**: Next.js (App Router) + TypeScript + Tailwind CSS. Single repo, deployed on Vercel.

## Core Architecture & Guidelines

### 1. Data Storage & Persistence
- **No authentication, login, registration, or external database.**
- All user data lives in browser `localStorage`.
- All `localStorage` interactions must go through a single storage helper located in `/lib/storage.ts`.
- Every page/component must handle empty initial state gracefully and never crash when `localStorage` is empty.

### 2. AI Integration & API Handlers
- AI features use the Google Gemini API via the official `@google/genai` SDK.
- SDK calls must happen **ONLY** in Next.js route handlers under `/app/api/*`. Client components must never import the SDK or access the API key directly.
- The API key comes from `process.env.GEMINI_API_KEY` and must never be exposed to client-side code.
- Gemini model name comes from `process.env.GEMINI_MODEL` with a sensible fallback default (e.g., `gemini-2.5-flash`).

### 3. Core Features
- **Dashboard**
- **AI Travel Planner**
- **Finance Tracker**
- **Task Manager**
- **Academic Portfolio**
- **AI Study Assistant**

### 4. UI, Styling & Design System
- UI must match user-provided Stitch design images.
- Use shared components and design tokens (colors, fonts, border radii) configured in Tailwind CSS config and `/app/globals.css`.
- **Mobile-first & fully responsive** design on every screen.
- Explicitly handle and display **loading**, **empty**, and **error** states on every page and interactive component.

### 5. Code Quality & Workflow Requirements
- Strict TypeScript typing across all modules (avoid `any`).
- Keep files and functions modular, concise, and focused.
- Add comments only for non-obvious logic and decisions; avoid redundant commentary.
- **Verification step**: Run lint and build checks (`npm run lint` / `npm run build`) after every task and resolve all errors prior to task completion.
