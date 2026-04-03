# Janak Pokharel Portfolio

This project is now structured as a Vercel-ready Next.js app using the App Router and a GitHub-backed JSON CMS source.

## Stack

- Next.js App Router
- TypeScript
- Node.js deployment on Vercel
- GitHub-backed JSON CMS through `data/site-content.json`

## Edit content

The live CMS content file is `data/site-content.json`. These sections are editable from `/admin`:

- `site`: SEO metadata, contact info, domain settings
- `navigation`: top navigation links
- `hero`: homepage hero copy and CTAs
- `about`: intro, stats, highlight cards, organization logos
- `services`: expertise cards
- `projects`: locked portfolio messaging
- `resume`: experience, education, certifications
- `blog`: blog page intro and all article content
- `contact`: contact section and WhatsApp card

## Required environment variables

Add these in Vercel Project Settings and locally in `.env.local` if you want the admin CMS to save changes:

- `GITHUB_REPO_OWNER`: GitHub username or organization
- `GITHUB_REPO_NAME`: repository name
- `GITHUB_REPO_BRANCH`: branch to update, usually `main`
- `GITHUB_CONTENT_PATH`: content file path, default `data/site-content.json`
- `GITHUB_TOKEN`: GitHub personal access token with repository contents access
- `CMS_ADMIN_SECRET`: private password required to save from `/admin`

## Run locally

Next.js official docs currently list a minimum Node.js version of `20.9` for modern installs.

1. Install Node.js 20.9 or newer.
2. Install dependencies with `npm install`.
3. Start development with `npm run dev`.
4. Open `http://localhost:3000`.
5. Open `http://localhost:3000/admin` to edit content.

## Deploy to Vercel

1. Push this folder to GitHub.
2. Import the repo into Vercel.
3. Add the environment variables from `.env.example`.
4. Add your custom domain `janakpokharel.com.np` in the Vercel project settings.
5. The website reads the latest JSON content from GitHub on each request, so CMS edits appear without waiting for a manual redeploy.

## How the CMS works

- `/admin` loads the current content JSON.
- Saving from `/admin` commits the updated JSON file back to your GitHub repository.
- The public site reads that same JSON from GitHub on Vercel, so homepage sections, blog pages, footer, and metadata stay in sync.
- If GitHub CMS variables are missing, the app safely falls back to the bundled local JSON file.
