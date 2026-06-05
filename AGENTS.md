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
- `BANXICO_OFFLINE=true npm run verify` - deterministic full local verification without live Banxico calls.
- `npm run debug` - verbose Eleventy run.
- `npm run clean` - remove `_site/`.

## Agent guidelines

- Prefer small, focused changes and verify with `BANXICO_OFFLINE=true npm run verify` when touching templates, data, styles, scripts, content structure, or root Markdown files.
- Keep public-facing copy in Spanish (`es-MX`) unless asked otherwise.
- When drafting, editing, or refining Perro Dinero content, follow `writing-style.md` to preserve David's voice.
- Content lives mainly in `posts/`, `atomic_essays/`, `books/`, `newsletters/`, and `faqs/`.
- Root-level Markdown files are public Eleventy inputs unless ignored. Agent-only docs such as `AGENTS.md`, `README.md`, `writing-style.md`, plans, or internal guides must be listed in `.eleventyignore` or explicitly configured with non-public front matter before committing.
- Do not edit or commit generated/local directories: `_site/`, `node_modules/`, `.cache/`, `.netlify/`, `.agents/`.
- Banxico API requests should authenticate with the `Bmx-Token` header, not a `token` query parameter.
- Netlify publishes `_site/` using `npm run build` from `netlify.toml`.
- Netlify's `netlify-plugin-no-more-404` keeps a cached manifest. If a PR intentionally removes a generated URL that existed in an earlier deploy of the same branch, bump `[plugins.inputs].cacheKey` for `netlify-plugin-no-more-404` in `netlify.toml` after fixing the source/ignore rule.
