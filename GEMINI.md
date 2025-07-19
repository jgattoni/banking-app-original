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
- **Database**: [Supabase](https://supabase.io/) (Primary database for user and application data)
- **Authentication**: [Clerk](https://clerk.com/) (Integrated with Supabase for user management)
- **Error Tracking**: [Sentry](https://sentry.io/)

## Architectural Refinements & Key Changes (July 2025)

This section documents significant architectural shifts and key changes made to the project.

### 1. Clear Separation of Concerns
- **Backend as Data Source:** The FastAPI backend (`backend/`) is now the sole layer responsible for direct interaction with the Supabase database and all third-party API integrations (e.g., Plaid, Dwolla).
- **Frontend as Presentation Layer:** The Next.js frontend (`frontend/`) focuses purely on UI/UX. All data fetching from the database or external APIs is routed through the FastAPI backend.

### 2. Unified User Management
- **Clerk as Primary Authenticator:** User authentication is handled exclusively by Clerk.
- **Unified User Object:** A consistent `User` type has been established in `frontend/types/index.d.ts` that combines properties from Clerk (e.g., `id`, `firstName`) and application-specific data stored in Supabase (e.g., `dwollaCustomerId`).
- **Backend User Endpoint:** A new FastAPI endpoint (`GET /api/users/{clerk_id}`) has been added to retrieve unified user data from Supabase based on the Clerk user ID.

### 3. Plaid Integration
- **Backend-Driven:** All Plaid API calls (e.g., `create_link_token`, `exchange_public_token`) are now handled by the FastAPI backend.
- **SSL Certificate Fix:** Resolved `SSLCertVerificationError` in the Python backend by ensuring correct SSL certificate installation, enabling secure communication with Plaid.

### 4. Dwolla Integration
- **Backend Responsibility:** The Dwolla integration logic has been removed from the Next.js frontend and is now intended to be implemented entirely within the FastAPI backend.

### 5. Environment Variables
- **Frontend (`frontend/.env.local`):** Required for Next.js configuration and `NEXT_PUBLIC_BACKEND_URL`.
- **Backend (`backend/.env`):** Essential for FastAPI configuration, Supabase credentials (`SUPABASE_URL`, `SUPABASE_KEY`), and Plaid API keys (`PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV`, `PLAID_PRODUCTS`, `PLAID_COUNTRY_CODES`).

## Development Workflow

1.  **Frontend**: Run `npm run dev` in the `frontend` directory to start the Next.js development server.
2.  **Backend**: The FastAPI server will be run from the `backend` directory.
3.  **Commits**: Follow conventional commit standards for commit messages.
