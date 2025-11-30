This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Automatic deploys to Vercel (Git)

If you want the project to be automatically deployed to Vercel on every push to your `main` branch, there are two common approaches:

- Recommended: connect the repository in the Vercel dashboard — Vercel will automatically create deployments for every push/PR and handle preview/production routing.
- Alternative: use the included GitHub Actions workflow which runs a build and triggers a production deploy (useful if you want a CI step before deploy).

This repository already contains a GitHub Actions workflow: `.github/workflows/deploy-vercel.yml`.

To make the workflow work, configure these repository secrets in GitHub (Settings → Secrets & variables → Actions):

- `VERCEL_TOKEN` — a personal token from your Vercel account (Profile → Tokens → Create Token).
- `VERCEL_ORG_ID` — the organization id for the Vercel project (from the project settings on Vercel).
- `VERCEL_PROJECT_ID` — the project id for this project (from the project settings on Vercel).

Notes:
- The workflow deploys on every push to `main` (and can be triggered manually via Workflow Dispatch).
- If you'd rather use Vercel's Git integration directly (recommended for simpler setup), just link the repo from the Vercel dashboard — no secrets needed and Vercel will deploy previews for PRs automatically.

If you want help hooking this repo to your Vercel account or fetching the org/project IDs and token, tell me the Vercel user/org and I can guide you through the exact steps.  
