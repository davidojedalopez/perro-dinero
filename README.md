[![Netlify Status](https://api.netlify.com/api/v1/badges/484d9a9f-dc24-4d30-90c4-142ae40c60b7/deploy-status)](https://app.netlify.com/sites/practical-fermi-c5a1da/deploys)

# Perro Dinero

A personal finance blog in Spanish ("Perro Dinero" translates to "Money Dog") focused on providing accessible financial education, investment guidance, and practical money management tips for Spanish-speaking audiences.

## Tech Stack

> For specific package versions, see [`package.json`](package.json).

### Core Framework
- **[Eleventy (11ty)](https://www.11ty.dev/)** - Static site generator powering the entire site
- **Node.js** - Runtime environment requirement

### Templating
- **Nunjucks** - Primary templating engine for HTML layouts
- **Markdown** - Content authoring format for blog posts and essays
- **markdown-it** - Markdown parser with extensions
  - markdown-it-anchor - Auto-generate heading anchors
  - markdown-it-toc-done-right - Table of contents generation

### Styling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
  - @tailwindcss/forms - Form styling plugin
  - Dark mode support (class-based)
- **PostCSS** - CSS processing
- **Webpack** - Asset bundling and build pipeline
  - Handles CSS extraction and processing
  - Service worker generation for PWA support

### Eleventy Plugins
- **@11ty/eleventy-plugin-rss** - RSS feed generation
- **@11ty/eleventy-navigation** - Navigation structure management
- **@11ty/eleventy-img** - Image optimization and processing
- **@11ty/eleventy-cache-assets** - Cache external API data
- **eleventy-plugin-reading-time** - Calculate estimated reading time

### Data Sources
- **Banxico API** - Fetches Mexican economic indicators including:
  - Minimum wage data (border and general)
  - UDI (Unidades de Inversión) values
  - CETES (Mexican Treasury Certificates) yield rates
  - Requires `BANXICO_API_KEY` environment variable
- **INEGI** - Mexican statistical data integration
  - UMA (Unit of Measure and Update) values for tax calculations

### Features
- **Image Processing** - Automatic WebP and JPEG format generation with responsive widths
- **Structured Data** - JSON-LD schema.org markup for BlogPosting type
- **Algolia Search** - Full-text search powered by Algolia crawler
- **PWA Support** - Progressive Web App with service worker and manifest
- **Dark Mode** - Class-based dark mode implementation with Tailwind CSS
- **Reading Time** - Automatic calculation of estimated reading time
- **Internationalization** - Spanish locale (es-MX) with Luxon for date formatting

### Deployment
- **Netlify** - Continuous deployment platform
  - **@netlify/plugin-lighthouse** - Performance auditing
  - **netlify-plugin-a11y** - Accessibility testing
  - **netlify-plugin-no-more-404** - 404 error tracking

## Project Structure

```
perro-dinero/
├── _data/              # Global data files (Banxico, INEGI APIs)
├── _includes/          # Nunjucks layouts and partials
├── _site/              # Generated static site (build output)
├── atomic_essays/      # Short-form essays (ensayos atómicos)
├── posts/              # Main blog posts
├── books/              # Book reviews and recommendations
├── faqs/               # Frequently asked questions
├── newsletters/        # Newsletter content
├── img/                # Images and media assets
├── scripts/            # JavaScript source files
├── styles/             # CSS source files
├── .eleventy.js        # Eleventy configuration
├── webpack.config.js   # Webpack build configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── netlify.toml        # Netlify deployment configuration
└── package.json        # Dependencies and scripts
```

## Development

### Installation

```bash
# Clone the repository
git clone git://github.com/davidojedalopez/perro-dinero.git
cd perro-dinero

# Install dependencies
npm install
```

### Local Development

```bash
# Start development server with hot reload
npm run dev
```

This command runs both Webpack (in watch mode) and Eleventy (with serve mode) in parallel. The site will be available at `http://localhost:8080` with automatic reloading on file changes.

### Production Build

```bash
# Build for production
npm run build
```

This creates an optimized production build in the `_site/` directory.

### Other Useful Scripts

```bash
# Debug mode with verbose logging
npm run debug

# Convert GIF files to MP4 and WebM formats
npm run convert-gifs

# Update portfolio data
npm run update-portfolio

# Clean build directory
npm run clean
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
BANXICO_API_KEY=your_banxico_api_key_here
```

The **BANXICO_API_KEY** is required to fetch economic indicators from Banco de México (Banxico) API. You can obtain an API key by registering at [Banxico's SIE API portal](https://www.banxico.org.mx/SieAPIRest/service/v1/).

## Content Types

The blog features two main content types:

### Blog Posts (`/posts/`)
Long-form articles covering comprehensive personal finance topics such as investing, budgeting, taxes, retirement planning, and financial products. Posts are written in Markdown with frontmatter metadata.

### Atomic Essays (`/atomic_essays/`)
Short-form essays (ensayos atómicos) presenting concise financial concepts and insights. These are bite-sized pieces designed for quick reading and focused learning.

## License

MIT License - See [LICENSE](LICENSE) file for details

## Author

**David Ojeda**
- Email: davidojeda@hey.com
- Website: [https://davidojeda.dev](https://davidojeda.dev)
- GitHub: [@davidojedalopez](https://github.com/davidojedalopez)

