# WorkFlow Pro — System Architecture

**Version:** 1.0.0
**Date:** 2026-09-07
**Last Updated:** 2026-09-07T14:50:46+05:30

---

## 1. High-Level Architecture

```
+------------------------------------------------------+
|                    CLIENT LAYER                      |
|   React + TypeScript + Vite + Tailwind CSS           |
|   TanStack Query | Zustand | Socket.IO Client        |
+-------------------------+----------------------------+
                          |
                    HTTPS / WSS
                          |
+-------------------------v----------------------------+
|                  API GATEWAY LAYER                   |
|              Nginx Reverse Proxy                     |
|         SSL Termination | Rate Limiting              |
+-------------------------+----------------------------+
                          |
          +---------------+-----------------+
          |                                 |
+---------v----------+          +-----------v---------+
|   REST API SERVER  |          |  SOCKET.IO SERVER   |
|  Express.js (TS)   |          |  Real-Time Events   |
|  Port: 3000        |          |  Port: 3001         |
+---------+----------+          +-----------+---------+
          |                                 |
          +---------------+-----------------+
                          |
          +---------------+-----------------+
          |               |                 |
+---------v----+  +-------v------+  +-------v------+
|  PostgreSQL  |  |    Redis     |  |  File Store  |
|  (Primary    |  |  (Cache /    |  |  (S3 / Local)|
|   Data)      |  |   Queue /    |  |              |
|              |  |   Sessions)  |  |              |
+--------------+  +--------------+  +--------------+
```

---

## 2. Multi-Tenant Architecture

```
Platform (Super Admin)
   |
   +-- Company A (company_id = uuid-a)
   |       |-- Users
   |       |-- Departments
   |       |-- Teams
   |       |-- Projects
   |       |-- Tasks
   |       |-- Assignments
   |       |-- Attendance
   |       `-- WFH Requests
   |
   +-- Company B (company_id = uuid-b)
   |       |-- Users
   |       |-- ...
   |
   `-- Company C (company_id = uuid-c)
           |-- ...
```

All tables that store company-specific data include a `company_id` foreign key.
Every API query filters by `company_id` of the authenticated user.

---

## 3. Frontend Architecture

```
frontend/
+-- src/
    +-- components/          # Reusable UI components
    |   +-- ui/              # Base: Button, Input, Modal, Card
    |   +-- layout/          # Sidebar, Header, Breadcrumb
    |   `-- shared/          # DataTable, Charts, FileUpload
    |
    +-- pages/               # Top-level page components
    +-- layouts/             # App layouts (AuthLayout, DashboardLayout)
    +-- hooks/               # Custom React hooks
    +-- services/            # API service functions (axios)
    +-- stores/              # Zustand state stores
    +-- types/               # TypeScript type definitions
    +-- utils/               # Helper functions
    +-- routes/              # React Router config
    |
    `-- features/            # Feature modules (co-located)
        +-- auth/
        +-- dashboard/
        +-- employees/
        +-- attendance/
        +-- wfh/
        +-- tasks/
        +-- assignments/
        +-- projects/
        +-- reports/
        +-- notifications/
        +-- chat/
        +-- meetings/
        +-- analytics/
        `-- ai/
```

### Frontend Rules
- Business logic stays in hooks and services, NOT in components
- API calls are made via TanStack Query (server state)
- Client-only state managed via Zustand
- Components must be small and focused (< 200 lines)

---

## 4. Backend Architecture

```
backend/
+-- src/
|   +-- config/          # DB, Redis, environment config
|   +-- middleware/      # Auth, RBAC, validation, rate limiter, error handler
|   +-- controllers/     # HTTP handlers (thin, calls services only)
|   +-- services/        # Business logic layer
|   +-- repositories/    # Database access (Prisma queries)
|   +-- routes/          # Express route definitions
|   +-- validators/      # Zod input schemas
|   +-- websocket/       # Socket.IO event handlers
|   +-- jobs/            # Background job runners (Redis Bull/BullMQ)
|   +-- ai/              # AI context builder, prompt templates
|   +-- webmcp/          # WebMCP tool definitions and handlers
|   `-- utils/           # Shared utilities (logger, response, crypto)
|
+-- prisma/
|   `-- schema.prisma    # Full DB schema
|
`-- tests/               # Unit, service, and API tests
```

### Controller-Service-Repository Pattern

```
HTTP Request
    |
    v
Middleware (Auth + RBAC + Validation)
    |
    v
Controller (parse request, call service, return response)
    |
    v
Service (business logic, orchestration)
    |
    v
Repository (Prisma queries)
    |
    v
PostgreSQL
```

---

## 5. Authentication Flow

```
POST /api/v1/auth/login
    |
    +--> Validate input (Zod)
    +--> Find user by email (Repository)
    +--> Verify password (bcrypt.compare)
    +--> Generate JWT access token (15 min)
    +--> Generate refresh token (7 days) -> store in DB + Redis
    +--> Return { accessToken, refreshToken }

POST /api/v1/auth/refresh
    |
    +--> Validate refresh token from cookie/body
    +--> Check token in Redis (not revoked)
    +--> Rotate: issue new access + refresh tokens
    +--> Revoke old refresh token
    +--> Return { accessToken, refreshToken }

POST /api/v1/auth/logout
    |
    +--> Revoke refresh token from Redis
    +--> Invalidate session
```

---

## 6. RBAC Architecture

```
User
 |-- has Roles (many-to-many via user_roles)
 `-- Role has Permissions (many-to-many via role_permissions)

Roles:
  SUPER_ADMIN
  COMPANY_ADMIN
  HR
  MANAGER
  TEAM_LEADER
  EMPLOYEE

Permission check flow:
  Request --> AuthMiddleware (verify JWT) --> RBACMiddleware (check role + permission) --> Controller
```

---

## 7. Real-Time Architecture (Socket.IO)

```
Client connects with JWT
    |
    v
Socket.IO Auth Middleware (verify token)
    |
    v
Join rooms: user:{userId}, company:{companyId}, team:{teamId}
    |
    v
Events:
  notification:new     -> user room
  task:updated        -> project room
  chat:message        -> chat room
  attendance:updated  -> manager room
  presence:online     -> company room
  presence:offline    -> company room
```

---

## 8. Background Jobs Architecture (Redis + BullMQ)

```
Jobs:
  deadline-reminder    -> runs every hour, checks task/assignment due dates
  daily-report-reminder -> runs at 5 PM company timezone
  weekly-summary       -> runs every Friday 6 PM
  notification-sender  -> processes notification queue
  attendance-auto-checkout -> runs at end of working hours

Worker Flow:
  BullMQ Worker -> Process Job -> Emit Socket.IO event OR send email
```

---

## 9. AI + WebMCP Architecture

```
User asks AI question
    |
    v
AI Context Builder (collect user role, company_id, current data)
    |
    v
LLM (with tools defined)
    |
    v
WebMCP Tool Layer
    |
    +--> Auth check (is user logged in?)
    +--> RBAC check (can this role call this tool?)
    +--> Company check (does data belong to user's company?)
    |
    v
Business Service
    |
    v
PostgreSQL (parameterized Prisma query)
    |
    v
Response back to AI -> User
```

---

## 10. File Storage Architecture

```
File Upload:
  Client -> Multipart form -> Backend -> Validate (type + size) -> Store (S3/local) -> Save metadata in DB

File Download:
  Client requests file -> Backend verifies permission -> Generate pre-signed URL (15 min) -> Return URL -> Client downloads
```

Files are never served via guessable public URLs.
File metadata table links to: tasks, assignments, projects, work reports, meetings.

---

## 11. Security Layers

```
Layer 1: HTTPS (SSL/TLS via Nginx)
Layer 2: Rate Limiting (Express rate-limiter + Redis)
Layer 3: CORS (configured allowed origins)
Layer 4: Helmet.js (secure HTTP headers)
Layer 5: Input Validation (Zod schemas on every endpoint)
Layer 6: JWT Auth Middleware
Layer 7: RBAC Middleware
Layer 8: Tenant Isolation (every query filters by company_id)
Layer 9: Prisma ORM (no raw SQL, no injection risk)
Layer 10: File Validation (mime type + size)
Layer 11: Audit Logs (all important actions logged)
```

---

## 12. Deployment Architecture

```
Production:

Internet
    |
    v
Nginx (SSL, reverse proxy, static files)
    |
    +-- /api         -> Node.js Backend (port 3000)
    +-- /ws          -> Socket.IO Server (port 3001)
    `-- /            -> React Frontend (built static files)

Services:
  PostgreSQL (managed DB or self-hosted)
  Redis (managed or self-hosted)
  S3 (file storage, or MinIO locally)
  SMTP (email notifications)
```
