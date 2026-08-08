# PromptCraft Studio

PromptCraft Studio is a Vite + React + Express app for generating AI prompts, previewing live site layouts, and handling auth/help desk features.

## Tech stack

- React 19
- Vite 6
- Express
- TypeScript
- Groq AI integration

## Prerequisites

- Node.js 20+
- npm
- Groq API key

## Local setup

1. Install dependencies:
   `npm install`
2. Create a local environment file by copying [.env.example](.env.example) or creating `.env` with:
   - `GROQ_API_KEY=your_key_here`
   - `APP_URL=http://localhost:3000`
   - `PORT=3000`
3. Start the app in development mode:
   `npm run dev`
4. Production build:
   `npm run build`
5. Start the production server:
   `npm run start`

## Application scripts

From [package.json](package.json):

- `npm run dev` → starts the Express + Vite dev server
- `npm run build` → builds the frontend and server bundle
- `npm run start` → runs the compiled production server
- `npm run preview` → preview the Vite frontend
- `npm run lint` → TypeScript check

## Docker build

```bash
docker build -t promptcraft-studio .
docker run -p 3000:3000 --env-file .env promptcraft-studio
```
