# 🚀 COURIER – API TESTING PLATFORM (POSTMAN-INSPIRED)
> ⚡ Built with a modern fullstack architecture using Turborepo, TanStack ecosystem, and scalable backend design.

## 🧩 Project Environment

- Runtime: **Node.js v22+**  
- Package manager: **pnpm or npm**  
- Monorepo: **Turborepo** 

- Frontend: **React + Vite + TanStack Router + React Query**  
- Backend: **NestJS** 

- Database: **PostgreSQL (hosted on Supabase)**  
- ORM: **Prisma ORM**  

- UI: **TailwindCSS + shadcn/ui**

## 👨‍💻 Author

Developed by **Nguyễn Anh Cường (Cường Dev)**  
Facebook: [ Nguyễn Anh Cường ](https://www.facebook.com/nguyenanh.cuong.600722/)  
Email: [cuongna.dev@gmail.com](mailto:cuongna.dev@gmail.com) 

Collaborator: **Trần Thành Vinh**  
Facebook: [ Trần Thành Vinh ](https://www.facebook.com/FearTheNight/)  
Email: [personal.vinhtran205@gmail.com](mailto:personal.vinhtran205@gmail.com)

## 🎯 Introduction

**Courier** is a modern API testing platform inspired by Postman, designed to:

- Test APIs quickly and intuitively  
- Automate testing processes  
- Analyze API performance

The goal is to build an all-in-one API testing solution for developers.

The project aims towards a system:

> **API Testing + Automation + Workflow + Performance Analysis**

## ✨ Core Features

🔹 API Testing (Postman-like)
- Send HTTP requests (GET, POST, PUT, DELETE…)
- Customize headers, params, and body
- Save and manage requests

---

🔹 Advanced Testing Features

📥 Import Swagger / OpenAPI 
- Automatically import API schemas
- Generate endpoint collections


✅ Response Schema Validation
- Validate responses using JSON schema
- Quickly detect API inconsistencies


🤖 Auto Test Case Generation
- Generate test cases from API responses
- Reduce manual testing effort


🔄 API Workflow Testing
- Chain multiple requests into workflows
- Example: login → fetch data → update


⚡ Performance Testing
- Measure response time
- Test concurrent requests
- Analyze API performance

---

## 🏗️ Monorepo Structure

```bash
courier/
├── apps/
│   ├── web/        # Frontend (React + Vite)
│   ├── docs/       # Documentation
│   └── api/        # Backend (NestJS)
│
├── packages/       # Shared packages
├── turbo.json      # Turborepo configuration
├── README.md       # Project overview and setup guide
├── COMMIT_GUIDE.md # Commit message conventions and guidelines
├── ...
```

## 🌐 Frontend Structure (apps/web)
```bash
src/
├── api/
├── app/
│   ├── layouts/
│   ├── pages/
│   ├── providers/
│   ├── routes/
│   ├── index.tsx
│   ├── router.ts
│
├── assets/
├── components/
├── configs/
├── constants/
├── features/
├── hooks/
├── lib/
├── services/
├── store/
├── styles/
├── types/
├── main.tsx
├── ...
```

## 🔧 Backend Structure (apps/api)
```bash
prisma/
src/
├── common/
├── configs/
├── database/
├── modules/
├── routes/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts
├── ...
```

## ⚙️ Installation Guide – Development Mode

First, start the development environment:

```bash
# Clone the repository
git clone git@github.com:cuongnadev/courier.git

# Navigate into the project folder
cd courier

# Install dependencies
npm i

# Copy and configure your environment file
cp .env.example .env

# Run the development server
npm run dev
```

## 🌐 Deployed Project

**Render** is a cloud platform that supports deploying both the **frontend** and **backend** of your application.  
You can try the deployed version of Courier here:
👉 https://courier.onrender.com (updating)

## 🧠 Learn More

To learn more about the technologies used in **Courier**, check out these resources:

### ⚛️ Frontend
- [React Documentation](https://react.dev/) – Learn the core concepts of building UI with components.  
- [Vite Docs](https://vite.dev/) – Lightning-fast frontend tooling and development server. 
- [TanStack Router Docs](https://tanstack.com/router/latest) – Type-safe routing for modern React apps.
- [TanStack Query Docs](https://tanstack.com/query/latest) – Powerful data fetching and caching solution. 
- [TailwindCSS Docs](https://tailwindcss.com/docs/installation/using-vite) – Utility-first CSS framework for rapid UI development. 
- [shadcn/ui Docs](https://ui.shadcn.com/) – Reusable and accessible UI components built with Radix UI.

### 🧩 Backend
- [NestJS Documentation](https://docs.nestjs.com/) – Progressive Node.js framework for building scalable backend applications.
- [Prisma Docs](https://www.prisma.io/docs) – Next-generation ORM for database access and migrations.
- [Supabase Documentation](https://supabase.com/docs) – Learn how to manage databases, authentication, and storage.  

### ⚙️ Tooling & Infrastructure
- [Turborepo Docs](https://turborepo.dev/docs) – High-performance build system for JavaScript/TypeScript monorepos. 
- [TypeScript Docs](https://www.typescriptlang.org/docs/) – Typed superset of JavaScript for scalable applications.
- [ESLint Docs](https://eslint.org/docs/latest/) – Tooling for identifying and fixing code issues.
- [Prettier Docs](https://prettier.io/docs/) – Opinionated code formatter.

### 🌐 Deployment & DevOps  
- [Docker Documentation](https://docs.docker.com/) – Learn how to containerize and deploy your app.  
- [Render Docs](https://render.com/docs) – Cloud platform to deploy both frontend and backend services.  

---

## ⭐ Notes
- Built with scalability and maintainability in mind
- Designed for real-world API testing workflows
- Suitable for capstone, portfolio, and production use

---