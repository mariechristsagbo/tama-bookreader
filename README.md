# Tama Book Reader

An interactive, responsive 2D/3D PDF reader built with Next.js, Tailwind CSS, Motion, and PDF.js. Open a local PDF or use image-based pages to recreate the feel of turning a physical book across desktop and mobile devices.

<img width="2940" height="1766" alt="Tama Book Reader preview" src="https://github.com/user-attachments/assets/84093b11-bbaf-41f7-b739-62258ae72442" />

## Demo

### Desktop

![Desktop flipbook demo](./public/demo/desktop.gif)

## Features

- Realistic 3D page-turn animations
- Responsive single-page and two-page layouts
- Previous and next navigation through controls or page hotspots
- Reduced-motion support based on the user’s system preferences
- Local PDF loading with no server upload
- Progressive PDF page rendering and caching
- Reusable book configuration independent from the reader engine
- Support for real page images and generated placeholders
- Statically rendered Next.js entry page

## Tech Stack

- [Next.js 16](https://nextjs.org/) with the App Router
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Motion](https://motion.dev/) for page-turn animations
- [PDF.js](https://mozilla.github.io/pdf.js/) for PDF parsing and rendering
- TypeScript
- pnpm

## Getting Started

### Prerequisites

- Node.js 20 or later
- pnpm 10 or later

### Installation

```bash
git clone git@github.com:mariechristsagbo/tama-bookreader.git
cd tama-bookreader
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the local development server |
| `pnpm build` | Create an optimized production build |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint across the project |

## Project Structure

```text
app/
├── _components/
│   ├── book-sources/       # Image/PDF page adapters and sample content
│   ├── flip-book/          # Format-agnostic navigation and page turns
│   └── pdf-reader/         # PDF loading, rendering, caching, and cleanup
├── globals.css             # Global styles and visual design tokens
├── layout.tsx              # Metadata and root layout
└── page.tsx                # Application entry page
public/book/                # Cover and page images
```

## Using Another Book

Select **Open PDF** in the reader to open a local document. The file is processed directly in the browser and is not uploaded to a server.

The reader also accepts a `BookDefinition`, so image-based content can be replaced without changing the animation or navigation components.

1. Add the cover and page assets to `public/book/`.
2. Update the definition in `app/_components/flip-book/book-data.ts`.
3. Keep the pages ordered in the `pages` array.
4. Update the accessible labels to describe the new book.

The navigation model supports both odd and even page counts.

## Quality Checks

Before opening a pull request, run:

```bash
pnpm lint
pnpm build
```
