<h1 align="center">
   Warehouse Safety Enhancer

</h1>

<p align="center">
Warehouse Safety Enhancer is an advanced real-time monitoring and visualization system designed to improve safety and operational efficiency in warehouse environments. The project leverages cutting-edge technologies to provide comprehensive insights and interactive 3D modeling capabilities.
</p>

<p align="center">

<p align="center">
  <a href="#architecture"><strong>Architecture</strong></a> ·
  <a href="#installation"><strong>Installation</strong></a> ·
  <a href="#tech-stack--features"><strong>Tech Stack + Features</strong></a> ·
  <a href="#author"><strong>Author</strong></a> ·
  <a href="#credits"><strong>Credits</strong></a>
</p>
<br/>

![fa](https://github.com/user-attachments/assets/2e9006f6-355e-4061-a0e4-422dda907ed8)

## Architecture

### Data Pipeline

- MQTT Server: Central message broker
- Telegraf: Data collection and transmission agent
- InfluxDB: Time-series database for real-time data storage
- Supabase: Authentication and User data storage

### Backend
- Node.js powered server
- Handles data processing and WebSocket communication
- Interfaces with multiple data sources

### Frontend
- Next.js React application
- Real-time data visualization
- 3D BIM model interaction

### Cloud Infrastructure & DevOps
- Azure, AWS (progress)
- Github Actions
- Docker , Kubernetes (progress)
- Teraform ( progress )
- Gitops, ArgoCD ( progress )
- Ansible, Grafana ( progress )


## Demonstration
[![Demonstration](https://img.youtube.com/vi/MLYDQCEAPv4/0.jpg)](https://www.youtube.com/watch?v=MLYDQCEAPv4)


## Installation

Clone & create this repo locally with the following command:

```bash
git clone "https://github.com/yethuhlaing/warehouse-safety-enhancer.git"
```

### Steps

1. Install dependencies frontend & backend:

```sh
cd frontend
npm install

cd backend
npm install
```

2. Copy `.env.example` to `.env` and update the variables.

```sh
cd frontend
cp .env.example .env

cd backend
cp .env.example .env
```

3. Start the development server:

```sh
cd frontend
npm run dev

cd backend
npm run start
```

4. Seeding the Sensor Data
```sh
cd backend
npm run seed
```

## Tech Stack + Features

### Frameworks

- [Next.js](https://nextjs.org/) – React framework for building performant apps with the best developer experience
- [Auth.js](https://authjs.dev/) – Handle user authentication with ease with providers like Google, Twitter, GitHub, etc.
- [Prisma](https://www.prisma.io/) – Typescript-first ORM for Node.js
- [React Email](https://react.email/) – Versatile email framework for efficient and flexible email development

### Platforms

- [Docker](https://docker.com/) – Easily preview & deploy changes with git
- [Resend](https://resend.com/) – A powerful email framework for streamlined email development
- [Prisma](https://prisma.io/) – Serverless Postgres with autoscaling, branching, bottomless storage and generous free tier.

### UI

- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework for rapid UI development
- [Rechart](https://rechart.org/) – Graph and Chart Component for React frontend
- [Shadcn/ui](https://ui.shadcn.com/) – Re-usable components built using Radix UI and Tailwind CSS
- [Framer Motion](https://framer.com/motion) – Motion library for React to animate components with ease
- [Lucide](https://lucide.dev/) – Beautifully simple, pixel-perfect icons
- [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) – Optimize custom fonts and remove external network requests for improved performance
- [`ImageResponse`](https://nextjs.org/docs/app/api-reference/functions/image-response) – Generate dynamic Open Graph images at the edge

### Hooks and Utilities

- `useIntersectionObserver` – React hook to observe when an element enters or leaves the viewport
- `useLocalStorage` – Persist data in the browser's local storage
- `useScroll` – React hook to observe scroll position ([example](https://github.com/mickasmt/precedent/blob/main/components/layout/navbar.tsx#L12))
- `nFormatter` – Format numbers with suffixes like `1.2k` or `1.2M`
- `capitalize` – Capitalize the first letter of a string
- `truncate` – Truncate a string to a specified length
- `use-websocket-data` - Fetching sensor data from backend
- `use-debounce` - Debounce a function call / state update

### Code Quality

- [TypeScript](https://www.typescriptlang.org/) – Static type checker for end-to-end typesafety
- [Prettier](https://prettier.io/) – Opinionated code formatter for consistent code style
- [ESLint](https://eslint.org/) – Pluggable linter for Next.js and TypeScript

### Miscellaneous

- [Vercel Analytics](https://vercel.com/analytics) – Track unique visitors, pageviews, and more in a privacy-friendly way

## Author

Created by [@yethuhlaing](https://yethuhlaing.vercel.app) in 2024, released under the [MIT license](https://github.com/yethuhlaing/warehouse-safety-enhancer/blob/main/LICENSE).

## Credits

This project was inspired by shadcn's [Taxonomy](https://github.com/shadcn-ui/taxonomy), Steven Tey’s [Precedent](https://github.com/steven-tey/precedent), and Antonio Erdeljac's [Next 13 AI SaaS](https://github.com/AntonioErdeljac/next13-ai-saas), mickasmt's [next-saas-stripe-starter](https://github.com/mickasmt/next-saas-stripe-starter).

- Shadcn ([@shadcn](https://twitter.com/shadcn))
- Steven Tey ([@steventey](https://twitter.com/steventey))
- Antonio Erdeljac ([@YTCodeAntonio](https://twitter.com/AntonioErdeljac))
