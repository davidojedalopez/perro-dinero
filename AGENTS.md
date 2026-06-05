# AGENTS.md

## Project

Perro Dinero is a Spanish personal-finance static site built with Eleventy, Nunjucks/Markdown, Tailwind CSS, Webpack, and Netlify. The README has the full project overview; use this file for quick agent context.

## Setup

- Use Node.js `26.3.0` (see `.nvmrc`).
- Install dependencies with `npm install`.
- Builds require `BANXICO_API_KEY` in local `.env`; the value is configured in Netlify for the `perrodinero` site.
- Never print, commit, or place secrets in URLs/logs. `.env` is gitignored.

## Useful commands

- `npm run dev` - local Eleventy + Webpack dev server.
- `npm run build` - production build to `_site/`.
- `npm run debug` - verbose Eleventy run.
- `npm run clean` - remove `_site/`.

## Agent guidelines

- Prefer small, focused changes and verify with `npm run build` when touching templates, data, styles, scripts, or content structure.
- Keep public-facing copy in Spanish (`es-MX`) unless asked otherwise.
- When drafting, editing, or refining Perro Dinero content, follow `writing-style.md` to preserve David's voice.
- Content lives mainly in `posts/`, `atomic_essays/`, `books/`, `newsletters/`, and `faqs/`.
- Do not edit or commit generated/local directories: `_site/`, `node_modules/`, `.cache/`, `.netlify/`, `.agents/`.
- Banxico API requests should authenticate with the `Bmx-Token` header, not a `token` query parameter.
- Netlify publishes `_site/` using `npm run build` from `netlify.toml`.
