# Project Analysis

This document provides an overview of the project structure, technologies used, and conventions to follow.

## Directory Structure

The project is a monorepo with a `frontend` and `backend` directory.

- **`frontend/`**: Contains the Next.js web application.
- **`backend/`**: Contains the FastAPI backend.

## Technologies Used

### Frontend

The frontend is a Next.js application built with TypeScript.

- **Framework**: [Next.js](https://nextjs.org/) (using the App Router)
- **Authentication**: [Clerk](https://clerk.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/) and [Radix UI](https://www.radix-ui.com/)
- **Charting**: [Chart.js](https://www.chartjs.org/)
- **Linting**: ESLint
- **Error Tracking**: [Sentry](https://sentry.io/)

#### Key Frontend Directories

- **`app/`**: Contains the pages and layouts of the application, following the Next.js App Router conventions.
  - **`(auth)/`**: Authentication-related pages (sign-in, sign-up).
  - **`(root)/`**: The main application pages after authentication.
- **`components/`**: Reusable React components.
  - **`ui/`**: UI components from Shadcn/ui.
- **`lib/`**: Contains application logic, utility functions, and API integrations.
  - **`actions/`**: Server-side actions for interacting with the backend and external services.
- **`public/`**: Static assets like images and icons.

### Backend

The backend is a Python application.

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Database/Auth**: [Supabase](https://supabase.io/)
- **Error Tracking**: [Sentry](https://sentry.io/)

## Development Workflow

1.  **Frontend**: Run `npm run dev` in the `frontend` directory to start the Next.js development server.
2.  **Backend**: The FastAPI server will be run from the `backend` directory.
3.  **Commits**: Follow conventional commit standards for commit messages.