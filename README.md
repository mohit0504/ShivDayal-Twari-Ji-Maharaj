# Shri Shivdayal Tiwari Ji Maharaj — Website

A Vite + React + TypeScript + Tailwind + Framer Motion frontend for the official personal-brand site.

## Run locally

```bash
npm install
npm run dev
```

## Deploy on Vercel

1. Create a GitHub repository and upload this project.
2. Import the repository in Vercel. It will use the included Vite settings automatically.
3. In **Settings → Environment Variables**, add `NAVAMSHA_API_KEY` with your Navamsha API key for Production, Preview, and Development.
4. Deploy. The Kundli generator runs through the included `/api/kundli` Vercel function.

Never commit the Navamsha API key to GitHub.

## Content policy

The project only publishes facts supplied by the owner. Add verified events, videos, audios, articles, testimonials, email, social links, and address details through `src/data/` before publishing those sections.

## Frontend enquiry forms

The forms validate in the browser and are ready to connect to an API or CRM. They intentionally do not claim to send an enquiry until a real endpoint is configured.
