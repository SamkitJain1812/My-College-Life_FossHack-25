# My College Life

An AI-powered student companion for managing college life in one place. My College Life combines study support, travel planning, personal finance, tasks, and an academic portfolio in a responsive Next.js application.

## Overview

College students often switch between separate tools for assignments, spending, trip planning, notes, and career materials. My College Life brings these workflows together with a student-focused dashboard and AI assistance.

All personal application data is stored locally in the browser using `localStorage`. Gemini requests are handled only by server-side Next.js route handlers, so the API key is never sent to the client.

## Features

- **Dashboard**
  - Monthly spending versus budget
  - Tasks due today and overdue tasks
  - Latest saved trip
  - Portfolio completeness
  - Quick actions for every feature
- **AI Travel Planner**
  - Student-budget-friendly itineraries
  - Structured day-by-day plans
  - Estimated costs and travel tips
- **Finance Tracker**
  - Expense logging and editing
  - Monthly budget tracking in Indian rupees
  - Category breakdown and spending trends
  - CSV export
- **Task Manager**
  - Task creation, priorities, due dates, and statuses
  - Overdue task visibility
- **Academic Portfolio**
  - Projects, certifications, skills, and education
  - Profile completeness tracking
- **AI Study Assistant**
  - Streaming doubt-solving responses
  - Notes summarization mode
  - Markdown-style answer rendering
  - Copy answers and save chat history locally
- **Settings and backup**
  - Export and restore local application data as JSON
  - Reset local data when needed
- **Theme support**
  - Responsive layouts for mobile, tablet, and desktop
  - Light and dark themes

## Tech Stack

- **Framework:** Next.js App Router
- **Language:** TypeScript
- **UI:** React and Tailwind CSS
- **Icons and charts:** Lucide React and Recharts
- **AI:** Google Gemini API through the official `@google/genai` SDK
- **Validation:** Zod
- **Persistence:** Browser `localStorage`
- **Deployment:** Vercel-compatible Next.js application

## Setup

### Prerequisites

- Node.js 18 or newer
- npm
- A Google Gemini API key for AI features

### Install and run

```bash
git clone https://github.com/SamkitJain1812/My-College-Life_FossHack-25.git
cd My-College-Life_FossHack-25
npm install
copy .env.example .env.local
npm run dev
```

On macOS or Linux, use `cp .env.example .env.local` instead of the Windows `copy` command.

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Verify the project

```bash
npm run lint
node ./node_modules/typescript/bin/tsc --noEmit
npm run build
```

## Environment Variables

Create a `.env.local` file in the project root. It is ignored by Git and must never be committed.

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.8-flash
```

| Variable | Required | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes for AI features | Server-side Google Gemini API key |
| `GEMINI_MODEL` | No | Gemini model name; defaults to `gemini-3.8-flash` |

The API key is consumed by [`lib/api.ts`](./lib/api.ts) and the route handlers under [`app/api/`](./app/api/). Do not prefix it with `NEXT_PUBLIC_`.

## Project Structure

```text
app/
  api/
    study/route.ts       # Streaming study assistant endpoint
    travel/route.ts      # Structured travel planner endpoint
  dashboard/             # Data-driven dashboard
  finance/               # Finance tracker
  portfolio/             # Academic portfolio
  study/                 # Study assistant UI
  tasks/                 # Task manager
  travel/                # Travel planner UI
  settings/              # Backup and local data settings
components/              # Shared application and UI components
lib/
  api.ts                 # Server-side Gemini and API utilities
  storage.ts             # Typed localStorage helpers
  types.ts               # Shared domain types
```

## Data and Privacy

Application records remain in the browser's local storage. There is no login system or external application database. AI requests are sent to the server route handlers, which use `GEMINI_API_KEY` without exposing it to client-side code.

Do not commit:

- `.env.local`
- `.env`
- Any file containing a real API key

## Future Scope

- Native Android and iOS applications
- AI career guidance and internship recommendations
- Smart timetable and study-plan generation
- Calendar and reminder integrations
- Collaborative study sessions
- More granular privacy and data portability controls

## Contributors

- Samkit Jain
- Moksh Sharma
- Madhav Singla
- Mayank Verma

## License

This project is licensed under the [MIT License](./LICENSE).
