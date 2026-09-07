# WorkFlowPro

WorkFlowPro is a comprehensive employee management, attendance tracking, and task delegation platform designed for modern remote and hybrid teams. 

## Features
- **Role-Based Access Control**: Hierarchical roles (Super Admin, Company Admin, HR, Manager, Employee) ensure secure and structured access.
- **Attendance & Work Logs**: Track check-ins, check-outs, active/idle time, and daily work reports.
- **Task Management**: Create, assign, and manage tasks across projects and teams.
- **Real-Time Dashboards**: Customized widgets and overviews tailored to each user's specific role in the organization.
- **Company Directory**: Secure employee onboarding through invite-only workflows.

## Technology Stack
- **Frontend**: React, TypeScript, TailwindCSS, Vite
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL

## Installation
1. Clone the repository
2. Install dependencies for both frontend and backend:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```
3. Set up environment variables in `backend/.env`
4. Run Prisma migrations: `npx prisma db push`
5. Start development servers:
   - Backend: `npm run dev`
   - Frontend: `npm run dev`

## Copyright & Licensing
This software is strictly proprietary. Please read the `LICENSE` file for strict copyright terms and restrictions.
