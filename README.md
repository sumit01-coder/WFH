<div align="center">
  <h1>🚀 WorkFlowPro</h1>
  <p><em>A modern, comprehensive employee management, attendance tracking, and task delegation platform.</em></p>
  
  [![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
</div>

<hr />

## ✨ Features

- **🔐 Role-Based Access Control**: Hierarchical roles (Super Admin, Company Admin, HR, Manager, Employee) ensure secure and structured access to sensitive data.
- **🕒 Attendance & Work Logs**: Track check-ins, check-outs, active/idle time, and submit daily work reports effortlessly.
- **✅ Task Management**: Create, assign, and manage tasks across projects and teams with rich descriptions and priority tracking.
- **📊 Real-Time Dashboards**: Customized widgets and analytical overviews tailored to each user's specific role in the organization.
- **👥 Company Directory**: Secure employee onboarding through invite-only workflows and departmental groupings.
- **📅 Leave Management & WFH**: Automated tracking of leave balances, Work From Home requests, and manager approvals.

---

## 🛠️ Technology Stack

### Frontend 🎨
- **Core**: React, TypeScript, Vite
- **Styling**: TailwindCSS, Framer Motion (Animations), Lucide (Icons)
- **State & Routing**: React Router v6, Axios

### Backend ⚙️
- **Core**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Security**: bcrypt (hashing), JWT (authentication)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [PostgreSQL](https://www.postgresql.org/) installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/workflowpro.git
   cd workflowpro
   ```

2. **Install Dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend && npm install
   
   # Install backend dependencies
   cd ../backend && npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@localhost:5432/workflowpro?schema=public"
   JWT_SECRET="your_super_secret_jwt_key"
   FRONTEND_URL="http://localhost:5173"
   ```

4. **Database Setup**
   ```bash
   cd backend
   npx prisma db push
   # Optional: Seed the database with initial roles and super admin
   npm run seed
   ```

5. **Start Development Servers**
   Open two terminals:
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev
   ```
   ```bash
   # Terminal 2: Frontend
   cd frontend && npm run dev
   ```

---

## ⚖️ Copyright & Licensing

This software is strictly **proprietary**. Please read the `LICENSE` file in the root directory for strict copyright terms and restrictions. Unauthorized copying of this file, via any medium, is strictly prohibited.
