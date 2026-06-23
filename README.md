# Courier

> A modern API testing platform inspired by Postman, built with a scalable full-stack monorepo architecture.

Courier is an API testing, automation, and workflow platform designed for developers to create, organize, run, inspect, and validate API requests in a workspace-based environment.

The platform aims to combine:

```txt
API Testing + AI Test Case Generation + AI Workflow Automation + Performance Analysis
```

---

## Table of Contents

* [Overview](#overview)
* [Tech Stack](#tech-stack)
* [Core Features](#core-features)
* [Monorepo Structure](#monorepo-structure)
* [Applications](#applications)
* [Backend Structure](#backend-structure)
* [Frontend Structure](#frontend-structure)
* [Documentation App](#documentation-app)
* [Getting Started](#getting-started)
* [Environment Variables](#environment-variables)
* [Available Scripts](#available-scripts)
* [Database](#database)
* [Deployment](#deployment)
* [Development Guidelines](#development-guidelines)
* [Roadmap](#roadmap)
* [Authors](#authors)
* [Resources](#resources)
* [License](#license)

---

## Overview

Courier is a Postman-inspired API testing platform focused on real-world developer workflows.

It allows users to manage workspaces, organize collections, create API requests, send HTTP calls, inspect responses, persist request history, generate AI-assisted test cases, and build API workflows manually or with AI.

Courier is structured as a production-oriented monorepo with separate applications for the frontend, backend API, and documentation site.

---

## Tech Stack

### Monorepo

* Turborepo
* npm workspaces
* TypeScript
* Node.js >= 18
* npm >= 10

### Frontend

* React
* Vite
* TanStack Router
* TanStack Query
* Zustand
* TailwindCSS
* shadcn/ui
* Radix UI
* Axios
* React Hook Form
* Zod

### Backend

* NestJS
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Swagger/OpenAPI
* Zod environment validation
* Class Validator
* Class Transformer
* Helmet
* Cookie Parser

### Documentation

* Next.js
* React
* Shared UI package support

### Database & Infrastructure

* PostgreSQL
* Supabase-ready database setup
* Render-ready deployment setup
* Docker-ready architecture foundation
* External AI service integration

---

## Core Features

### API Request Testing

* Send HTTP requests using common methods such as `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`
* Configure request URL, headers, params, authorization, and body
* Support JSON body, raw body, form data, and GraphQL-related fields
* Preview and inspect response body, response headers, status code, duration, and size
* Save, update, and organize requests inside collections
* Persist request configuration for reuse

### Workspace Management

* Create and manage workspaces
* Keep requests and collections scoped by workspace
* Provide a foundation for team-based API testing workflows
* Support workspace switching in the frontend

### Collection Management

* Group related API requests into collections
* Manage request metadata, ordering, and collection-level organization
* Prepare foundation for collection import/export

### Request Run History

* Store execution history for API requests
* Persist request method, URL, status, duration, response size, and execution result
* Save actual request headers and response headers per run
* Support dashboard activity and analytics

### AI Test Case Generation

* Generate structured test cases from request data
* Support positive and negative test scenarios
* Persist generated test cases per request
* Manage generated cases through the request testing panel
* Reduce manual test case writing effort

### API Workflow Testing

* Create API workflows manually using a visual flow builder
* Chain multiple requests into executable flows
* Support real API scenarios such as login, fetch profile, update data, validate response, and logout
* Generate workflows with AI by describing the desired API scenario in natural language
* Automatically create flow nodes and connections based on the user's requirement
* Prepare foundation for end-to-end API automation

### Performance Analysis

* Track request execution time
* Analyze response size and status results
* Provide dashboard-level request statistics
* Prepare foundation for concurrent request testing and performance reports

### Documentation Site

* Dedicated documentation app under `apps/docs`
* Intended for product documentation, developer guides, API usage guides, architecture notes, and deployment instructions
* Built separately from the main web app to keep documentation maintainable and scalable

---

## Monorepo Structure

```bash
courier/
├── apps/
│   ├── api/                 # Backend application - NestJS
│   ├── web/                 # Frontend application - React + Vite
│   └── docs/                # Documentation site - Next.js
│
├── packages/                # Shared packages for UI/config/types
│
├── COMMIT_GUIDE.md          # Commit message conventions
├── README.md                # Project overview and setup guide
├── package.json             # Root workspace configuration
├── package-lock.json        # npm lockfile
├── turbo.json               # Turborepo task pipeline
└── ...
```

---

## Applications

### `apps/web`

The main frontend application.

Responsibilities:

* Authentication UI
* Workspace dashboard
* Collection sidebar
* Request editor
* Response viewer
* Request history UI
* AI test case panel
* Flow builder UI
* AI workflow generation UI

### `apps/api`

The backend API application.

Responsibilities:

* Authentication
* Workspace and collection APIs
* Request CRUD
* Request execution
* Request run history persistence
* Request and response metadata persistence
* AI test case generation integration
* Flow APIs
* AI flow generation integration
* Dashboard APIs
* Database access through Prisma

### `apps/docs`

The documentation site.

Responsibilities:

* Product documentation
* Developer onboarding guide
* API usage guide
* Architecture notes
* Deployment guide
* Changelog or roadmap
* Screenshots and feature explanations

This app is a Next.js application and should be kept if the project needs public or internal documentation. Keeping it is recommended for a production-style monorepo.

### `packages`

Shared workspace packages.

Recommended responsibilities:

* Shared UI components
* Shared ESLint config
* Shared TypeScript config
* Shared utility types
* Shared constants when needed across apps

---

## Backend Structure

```bash
apps/api/
├── prisma/
│   ├── schema.prisma        # Prisma database schema
│   ├── migrations/          # Database migrations
│   ├── seed.ts              # Main seed script
│   ├── seed-flows.ts        # Flow seed script
│   └── seed-testcases.ts    # Test case seed script
│
├── src/
│   ├── common/
│   │   ├── constants/       # Shared backend constants
│   │   ├── decorators/      # Custom NestJS decorators
│   │   ├── exceptions/      # Application-level exceptions
│   │   ├── filters/         # Global exception filters
│   │   ├── guards/          # Authentication and authorization guards
│   │   ├── interceptors/    # Response and logging interceptors
│   │   ├── middlewares/     # HTTP middlewares
│   │   ├── pipes/           # Validation and transformation pipes
│   │   ├── types/           # Shared backend types
│   │   └── utils/           # Shared utility functions
│   │
│   ├── config/              # Environment schema and app config
│   ├── database/            # Prisma module and service
│   ├── generated/           # Generated Prisma client/enums
│   ├── modules/             # Domain modules
│   │   ├── auth/
│   │   ├── collections/
│   │   ├── dashboard/
│   │   ├── flows/
│   │   ├── request-testcases/
│   │   ├── requests/
│   │   ├── user/
│   │   └── workspaces/
│   │
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
│
├── test/                    # API tests
├── package.json
├── prisma.config.ts
├── nest-cli.json
├── tsconfig.json
└── tsconfig.build.json
```

---

## Frontend Structure

```bash
apps/web/
├── src/
│   ├── api/                 # API client and request functions
│   ├── app/                 # App shell, routes, providers, and layouts
│   ├── assets/              # Static assets
│   ├── components/          # Shared UI components
│   ├── configs/             # Frontend configuration
│   ├── constants/           # Shared frontend constants
│   ├── features/            # Feature-based modules
│   ├── hooks/               # Shared React hooks
│   ├── lib/                 # Utility libraries
│   ├── services/            # Service-level logic
│   ├── store/               # Global and client state
│   ├── styles/              # Global styles
│   ├── types/               # Shared TypeScript types
│   └── main.tsx             # Application entry point
│
├── package.json
├── vite.config.ts
└── ...
```

---

## Documentation App

```bash
apps/docs/
├── app/                     # Next.js App Router pages
├── public/                  # Static documentation assets
├── package.json
└── ...
```

Recommended documentation sections:

```txt
docs/
├── Getting Started
├── Environment Setup
├── API Testing Guide
├── Workspace & Collection Guide
├── AI Test Case Generation
├── AI Flow Generation
├── Backend Architecture
├── Frontend Architecture
├── Database Schema Notes
├── Deployment Guide
└── Changelog
```

Recommended action for `apps/docs`:

* Keep `apps/docs`
* Replace the default Next.js starter content
* Build it into a real Courier documentation site
* Run it separately on port `3001`
* Use it for detailed docs instead of making the root README too large

---

## Getting Started

### Prerequisites

Install:

* Node.js >= 18
* npm >= 10
* PostgreSQL database
* Git

Optional:

* Supabase project
* Docker
* Prisma Studio

---

### 1. Clone the repository

```bash
git clone git@github.com:cuongnadev/courier.git
cd courier
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Configure environment variables

Create backend environment file:

```bash
cp apps/api/.env.example apps/api/.env
```

Create frontend environment file:

```bash
cp apps/web/.env.example apps/web/.env
```

Then update each file with your local values.

---

### 4. Generate Prisma client

```bash
cd apps/api
npx prisma generate
```

Or from the root if you use a root script:

```bash
npm run db:generate
```

---

### 5. Run database migrations

```bash
cd apps/api
npx prisma migrate dev
```

---

### 6. Start the development environment

From the root directory:

```bash
npm run dev
```

This runs the monorepo development pipeline through Turborepo.

---

## Environment Variables

Courier uses separate environment files for the backend API and frontend web app.

Do not commit real `.env` files. Only commit example files such as `.env.example`.

---

### API Environment

Location:

```bash
apps/api/.env
```

Example:

```env
NODE_ENV=development
PORT=4425

DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"

JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=10m

WEB_URL=http://localhost:5173

TEST_CASE_GENERATOR_URL=http://localhost:8081/generate
FLOW_GENERATOR_URL=http://localhost:8081/generate-flow
```

| Variable                  | Description                                                                    |
| ------------------------- | ------------------------------------------------------------------------------ |
| `NODE_ENV`                | Backend runtime environment, usually `development` or `production`             |
| `PORT`                    | Backend API server port                                                        |
| `DATABASE_URL`            | Prisma database connection URL used by the application                         |
| `DIRECT_URL`              | Direct database connection URL used for migrations and Prisma operations       |
| `JWT_SECRET`              | Secret key used to sign JWT tokens                                             |
| `JWT_EXPIRES_IN`          | Access token expiration time                                                   |
| `WEB_URL`                 | Frontend application URL used for CORS and redirects                           |
| `TEST_CASE_GENERATOR_URL` | AI service endpoint for generating request test cases                          |
| `FLOW_GENERATOR_URL`      | AI service endpoint for generating API workflows from natural language prompts |

---

### Web Environment

Location:

```bash
apps/web/.env
```

Example:

```env
VITE_API_URL=http://localhost:4425/api.courier.dev/v1
VITE_APP_NAME=Courier
VITE_APP_ENV=development
```

| Variable        | Description                                |
| --------------- | ------------------------------------------ |
| `VITE_API_URL`  | Base URL of the backend API                |
| `VITE_APP_NAME` | Application name displayed in the frontend |
| `VITE_APP_ENV`  | Frontend runtime environment               |

Because the frontend is built with Vite, all environment variables exposed to the browser must start with `VITE_`.

---

### Environment Security

Never commit real secrets, database passwords, JWT secrets, or production service credentials.

Files that should remain local:

```txt
apps/api/.env
apps/web/.env
```

Files that can be committed:

```txt
apps/api/.env.example
apps/web/.env.example
```

If a real database URL or JWT secret is accidentally exposed, rotate it immediately.

---

## Available Scripts

### Root scripts

```bash
npm run dev
npm run build
npm run lint
npm run format
npm run check-types
npm run seed
npm run seed:flows
npm run seed:testcases
```

### API scripts

```bash
cd apps/api

npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run test:e2e
npm run test:cov
npm run seed
npm run seed:flows
npm run seed:testcases
```

### Web scripts

```bash
cd apps/web

npm run dev
npm run build
npm run lint
npm run preview
```

### Docs scripts

```bash
cd apps/docs

npm run dev
npm run build
npm run start
npm run lint
npm run check-types
```

Default local ports:

| App  | Port   |
| ---- | ------ |
| Web  | `5173` |
| API  | `4425` |
| Docs | `3001` |

---

## Database

Courier uses PostgreSQL with Prisma ORM.

Main data areas:

* Users
* Workspaces
* Collections
* API requests
* Request headers
* Request run history
* Request run headers
* Response headers
* Generated request test cases
* API flows
* Flow nodes and connections
* Dashboard activity data

Useful Prisma commands:

```bash
cd apps/api

npx prisma generate
npx prisma migrate dev
npx prisma studio
```

Seed commands:

```bash
npm run seed
npm run seed:flows
npm run seed:testcases
```

---

## Deployment

Courier is designed to be deployed as separate applications.

Recommended deployment model:

```txt
Frontend  -> Render / Vercel / Netlify
Backend   -> Render / Railway / Fly.io
Docs      -> Vercel / Render / Netlify
Database  -> Supabase PostgreSQL / Neon / Railway PostgreSQL
AI API    -> Render / VPS / separate FastAPI service
```

Current deployed URL:

```txt
https://courier.onrender.com
```

Status: updating.

Before deploying to production, configure:

* Production database URL
* Direct migration database URL
* JWT secret
* Frontend URL
* Backend CORS settings
* AI test case generator URL
* AI flow generator URL
* Prisma migration strategy
* Build output settings
* Environment-specific secrets

---

## Development Guidelines

### Code Organization

* Keep backend domain logic inside `apps/api/src/modules`
* Keep reusable backend code inside `apps/api/src/common`
* Keep frontend features inside `apps/web/src/features`
* Keep shared UI/config/types inside `packages`
* Keep documentation inside `apps/docs`

### Import Style

Prefer path aliases instead of deep relative imports.

```ts
import { PrismaService } from '@/database/prisma.service';
import { ERROR_CODES } from '@/common/constants';
```

Avoid:

```ts
import { PrismaService } from '../../database/prisma.service';
```

### Backend Guidelines

* Use DTOs for request validation
* Use services for business logic
* Use modules for domain boundaries
* Use Prisma service for database access
* Use shared constants for repeated values
* Use custom exceptions for predictable API errors
* Keep request execution, history, test case generation, and flow generation separated when possible

### Frontend Guidelines

* Keep UI components small and reusable
* Keep API calls in dedicated API files
* Keep feature state close to its feature
* Use TanStack Query for server state
* Use Zustand only for client-side application state
* Prefer typed payloads and explicit response types

### Documentation Guidelines

* Keep root README focused on project overview and setup
* Keep detailed product and developer documentation in `apps/docs`
* Add screenshots and architecture diagrams in the docs app
* Document important flows such as request testing, AI test case generation, and AI flow generation

### Commit Guidelines

Use `COMMIT_GUIDE.md` as the source of truth for commit message conventions.

Recommended examples:

```bash
git commit -m "feat(requests): add response header viewer"
git commit -m "fix(api): persist request headers on update"
git commit -m "refactor(api): centralize backend constants"
git commit -m "docs: rewrite project README"
```

---

## Roadmap

Planned and ongoing improvements:

* API request editor enhancements
* Response preview improvements
* AI-generated test cases
* AI-generated API workflows from natural language prompts
* Workflow execution engine
* Swagger/OpenAPI import
* Environment variables management
* Collection import/export
* Response schema validation
* Performance testing and concurrent request execution
* Team collaboration features
* Public documentation site

---

## Authors

### Nguyễn Anh Cường

Developer: Nguyễn Anh Cường, also known as Cường Dev.

* Facebook: [Nguyễn Anh Cường](https://www.facebook.com/nguyenanh.cuong.600722/)
* Email: [cuongna.dev@gmail.com](mailto:cuongna.dev@gmail.com)

### Trần Thành Vinh

Collaborator.

* Facebook: [Trần Thành Vinh](https://www.facebook.com/FearTheNight/)
* Email: [personal.vinhtran205@gmail.com](mailto:personal.vinhtran205@gmail.com)

---

## Resources

### Frontend

* [React Documentation](https://react.dev/)
* [Vite Documentation](https://vite.dev/)
* [TanStack Router Documentation](https://tanstack.com/router/latest)
* [TanStack Query Documentation](https://tanstack.com/query/latest)
* [TailwindCSS Documentation](https://tailwindcss.com/docs)
* [shadcn/ui Documentation](https://ui.shadcn.com/)

### Backend

* [NestJS Documentation](https://docs.nestjs.com/)
* [Prisma Documentation](https://www.prisma.io/docs)
* [Supabase Documentation](https://supabase.com/docs)
* [Swagger Documentation](https://swagger.io/docs/)

### Documentation

* [Next.js Documentation](https://nextjs.org/docs)

### Tooling

* [Turborepo Documentation](https://turbo.build/repo/docs)
* [TypeScript Documentation](https://www.typescriptlang.org/docs/)
* [ESLint Documentation](https://eslint.org/docs/latest/)
* [Prettier Documentation](https://prettier.io/docs/)

### Deployment

* [Docker Documentation](https://docs.docker.com/)
* [Render Documentation](https://render.com/docs)
* [Vercel Documentation](https://vercel.com/docs)

---

## License

This project is currently maintained as a personal and collaborative software project.

License information will be updated when the project is prepared for public distribution.
