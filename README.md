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

## 🎯 Purpose of this Project

The primary purpose of **WorkFlowPro** is to centralize and simplify the operational workflows of modern, distributed companies. In a world where remote and hybrid work is the norm, managing employee presence, assigning tasks across different departments, and maintaining clear communication can become chaotic. WorkFlowPro solves this by providing a unified, role-based platform where HR, managers, and employees can collaborate seamlessly without juggling multiple disconnected tools.

---

## 🌟 Key Benefits

- **Increased Productivity**: By bringing tasks, attendance, and communication into one dashboard, employees spend less time switching contexts and more time doing actual work.
- **Enhanced Accountability**: Clear tracking of active hours, idle time, and task assignments ensures everyone is aligned on expectations and deliverables.
- **Streamlined Management**: Managers and HR can easily oversee team performance, approve leaves/WFH requests, and manage company structures from a bird's-eye view.
- **Secure & Organized**: Strict hierarchical roles ensure that sensitive company data is only accessible to authorized personnel.

---

## ⚖️ Pros and Cons (The Future of using this platform)

### Pros
- **All-in-One Solution**: Eliminates the need for separate apps for attendance, task management, and basic chat.
- **Highly Customizable**: Built with a modular stack (React + Prisma + Postgres), making it easy to add new features like payroll integrations or advanced analytics in the future.
- **Role-Aware Workflows**: The UI automatically adapts based on whether the user is an Employee, Manager, HR, or Admin, preventing clutter.
- **Real-Time Updates**: Features like chat and status updates happen in real-time, bridging the gap between remote teams.

### Cons & Areas for Future Growth
- **Initial Setup Curve**: Onboarding an entire company structure (Departments -> Teams -> Managers -> Employees) requires initial setup time from the Admin.
- **Mobile Experience**: While responsive, a dedicated mobile app (e.g., React Native) would be beneficial for on-the-go workers in the future.
- **Third-Party Integrations**: Currently acts as a standalone platform; future iterations could benefit from integrations with tools like Slack, GitHub, or Google Workspace.

---

## 🏢 Industry & Market Positioning

While the market is saturated with specialized tools—such as **Jira / Asana** for project management, **BambooHR / Gusto** for HR and attendance, and **Slack / Microsoft Teams** for communication—**WorkFlowPro** sits uniquely at the intersection of these domains.

### Current Project Level
WorkFlowPro is currently at an **Enterprise MVP (Minimum Viable Product)** stage. It successfully consolidates core functionalities that a mid-sized remote organization needs into a single pane of glass.

### Comparison to Existing Market Giants
- **Versus HR Software (e.g., BambooHR)**: WorkFlowPro includes attendance and leave tracking but adds direct operational features like Task and Project management which pure HR tools lack.
- **Versus Project Management (e.g., Jira/Linear)**: WorkFlowPro keeps task management simple and accessible for all employees, avoiding the steep learning curve and feature bloat of tools like Jira, while integrating presence (attendance/WFH) directly into the workflow.
- **Versus Communication (e.g., Slack)**: WorkFlowPro offers basic real-time team chat, contextualizing communication around projects and teams, rather than replacing general-purpose enterprise chat entirely.

**Target Audience**: Startups, digital agencies, and SMEs (Small to Medium Enterprises) of 10-200 employees who want to reduce software subscription fatigue by replacing 3-4 separate SaaS products with one cohesive ecosystem.

---

## ✨ Features

- **🔐 Role-Based Access Control**: Hierarchical roles (Super Admin, Company Admin, HR, Manager, Employee) ensure secure and structured access to sensitive data.
- **🕒 Attendance & Work Logs**: Track check-ins, check-outs, active/idle time, and submit daily work reports effortlessly.
- **✅ Task Management**: Create, assign, and manage tasks across projects and teams with rich descriptions and priority tracking.
- **📊 Real-Time Dashboards**: Customized widgets and analytical overviews tailored to each user's specific role in the organization.
- **👥 Company Directory**: Secure employee onboarding through invite-only workflows and departmental groupings.
- **📅 Leave Management & WFH**: Automated tracking of leave balances, Work From Home requests, and manager approvals.
- **💬 Real-Time Chat & Notifications**: Built-in messaging and instant alerts via Socket.IO, keeping the entire organization connected.
- **💻 Desktop Application**: A dedicated Windows desktop app (built with Electron) featuring automatic background updates via GitHub Releases.

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
