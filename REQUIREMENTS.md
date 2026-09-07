# WorkFlow Pro — Requirements Specification

**Version:** 1.0.0
**Date:** 2026-09-07
**Last Updated:** 2026-09-07T14:50:46+05:30

---

## 1. Functional Requirements

### 1.1 Authentication & Authorization

| ID | Requirement |
|----|-------------|
| FR-AUTH-01 | Users must log in using email and password |
| FR-AUTH-02 | System must issue JWT access tokens (15 min TTL) and refresh tokens (7 days TTL) |
| FR-AUTH-03 | Refresh tokens must be rotated on every use |
| FR-AUTH-04 | Password must be hashed using bcrypt (cost factor >= 12) |
| FR-AUTH-05 | System must support forgot password via email OTP |
| FR-AUTH-06 | System must support email verification on registration |
| FR-AUTH-07 | After login, users must be redirected to role-specific dashboard |
| FR-AUTH-08 | RBAC must be enforced on every API endpoint |
| FR-AUTH-09 | Users must never access resources of a different company (tenant isolation) |
| FR-AUTH-10 | Sessions must be invalidatable server-side |

### 1.2 Multi-Tenant Company Management

| ID | Requirement |
|----|-------------|
| FR-COMP-01 | Each company must have isolated data — no cross-company data leakage |
| FR-COMP-02 | Company must configure working days, working hours, and break policy |
| FR-COMP-03 | Company must support logo, name, email, phone, address, website, timezone |
| FR-COMP-04 | Company admin must configure WFH policy (days allowed per month, approval rules) |
| FR-COMP-05 | Company admin must be able to invite employees via email |

### 1.3 Employee Management

| ID | Requirement |
|----|-------------|
| FR-EMP-01 | Admins can add employees with: ID, name, email, phone, department, team, designation, manager, joining date, status |
| FR-EMP-02 | Employee statuses: Active, Inactive, On Leave, Suspended |
| FR-EMP-03 | Admin can deactivate, reactivate, and reset employee accounts |
| FR-EMP-04 | Employee profile must include photo upload |
| FR-EMP-05 | Employee must be assignable to one department, one team, one manager |

### 1.4 Department & Team Management

| ID | Requirement |
|----|-------------|
| FR-DEPT-01 | Admin can create departments: Development, Design, Marketing, HR, Finance, Sales, Operations, custom |
| FR-DEPT-02 | Each department can contain multiple teams |
| FR-TEAM-01 | Manager can create teams, add/remove employees, assign team leaders |
| FR-TEAM-02 | Team leader can view team task progress and team activity |

### 1.5 Project Management

| ID | Requirement |
|----|-------------|
| FR-PROJ-01 | Projects must have: name, description, client, start date, end date, manager, team, status, priority |
| FR-PROJ-02 | Project statuses: Planning, Active, On Hold, Completed, Cancelled |
| FR-PROJ-03 | Each project contains: tasks, assignments, files, members, comments, activity |
| FR-PROJ-04 | Only authorized company users can access company projects |

### 1.6 Task Management

| ID | Requirement |
|----|-------------|
| FR-TASK-01 | Tasks: title, description, project, assignee, creator, priority, status, dates, estimated/actual hours, labels, attachments |
| FR-TASK-02 | Task statuses: To Do, In Progress, Blocked, Review, Completed, Cancelled |
| FR-TASK-03 | Task priorities: Low, Medium, High, Critical |
| FR-TASK-04 | Tasks must support: subtasks, checklists, comments, attachments, history, dependencies, due-date reminders |
| FR-TASK-05 | Task history must record every status change with timestamp and actor |

### 1.7 Assignment Management

| ID | Requirement |
|----|-------------|
| FR-ASGN-01 | Assignments: title, description, project, employee, assignor, priority, dates, estimated hours, required files, instructions |
| FR-ASGN-02 | Workflow: Assigned -> In Progress -> Submitted -> Under Review -> Approved |
| FR-ASGN-03 | Rework flow: Under Review -> Rework Required -> Resubmitted -> Approved |
| FR-ASGN-04 | All submission versions must be stored |
| FR-ASGN-05 | Manager/reviewer can leave comments on each submission |

### 1.8 WFH Management

| ID | Requirement |
|----|-------------|
| FR-WFH-01 | Employees submit WFH requests: date, reason, work location, notes |
| FR-WFH-02 | Request statuses: Pending, Approved, Rejected, Cancelled |
| FR-WFH-03 | Manager/HR can approve or reject requests with remarks |
| FR-WFH-04 | WFH calendar view must show Office/WFH/Holiday per day |
| FR-WFH-05 | WFH policy limits must be enforced (configurable per company) |

### 1.9 Attendance

| ID | Requirement |
|----|-------------|
| FR-ATT-01 | Employees can: check in, check out, start break, end break |
| FR-ATT-02 | System must calculate: total time, break time, effective working time, overtime |
| FR-ATT-03 | Late login and early logout must be flagged |
| FR-ATT-04 | No invasive tracking — only platform-triggered events |
| FR-ATT-05 | Admin/HR can view attendance reports by employee, department, date range |

### 1.10 Daily Work Reports

| ID | Requirement |
|----|-------------|
| FR-DWR-01 | Employees submit daily report: completed work, WIP, blockers, tomorrow plan, hours, attachments |
| FR-DWR-02 | Manager can: approve, request changes, comment |
| FR-DWR-03 | Report history must be retained indefinitely |
| FR-DWR-04 | AI can auto-generate a draft report (editable before submission) |

### 1.11 Weekly Work Planning

| ID | Requirement |
|----|-------------|
| FR-WWP-01 | Employees can create weekly plans per day |
| FR-WWP-02 | Managers can view all team members weekly plans |
| FR-WWP-03 | Plans are editable during the week |

### 1.12 Notifications

| ID | Requirement |
|----|-------------|
| FR-NOTIF-01 | Notifications for: new assignment, task assigned, deadlines, WFH status, report reminders, comments, mentions, meetings |
| FR-NOTIF-02 | Notifications must be delivered in real-time via Socket.IO |
| FR-NOTIF-03 | Redis background jobs must handle scheduled notifications (deadline reminders) |
| FR-NOTIF-04 | Users can mark notifications as read/unread |

### 1.13 Team Chat

| ID | Requirement |
|----|-------------|
| FR-CHAT-01 | Support: one-to-one chat, team chat, project chat |
| FR-CHAT-02 | Features: file sharing, mentions (@user), read status |
| FR-CHAT-03 | Messages delivered via Socket.IO in real-time |

### 1.14 Meetings

| ID | Requirement |
|----|-------------|
| FR-MTG-01 | Meetings: title, description, date, start/end time, organizer, participants, project, notes, action items |
| FR-MTG-02 | Meeting notifications sent to all participants |
| FR-MTG-03 | Meeting calendar view |

### 1.15 File Management

| ID | Requirement |
|----|-------------|
| FR-FILE-01 | Files uploadable for: tasks, assignments, projects, reports, meetings |
| FR-FILE-02 | Supported formats: PDF, DOC/DOCX, XLS/XLSX, PPT/PPTX, PNG, JPG, ZIP |
| FR-FILE-03 | Files must not be accessible via guessable public URLs |
| FR-FILE-04 | File versioning must be supported for assignments |
| FR-FILE-05 | File size limits enforced per company policy |

### 1.16 Goals & KPIs

| ID | Requirement |
|----|-------------|
| FR-GOAL-01 | Managers create goals: name, target, period, assigned to (individual/team) |
| FR-GOAL-02 | Progress tracked automatically from tasks/assignments completed |
| FR-GOAL-03 | Goals: Monthly, Quarterly, Individual, Team |

### 1.17 Performance Analytics

| ID | Requirement |
|----|-------------|
| FR-PERF-01 | Metrics: tasks completed, assignments completed, on-time completion %, rework rate, daily report submission %, goal completion % |
| FR-PERF-02 | Employee view: personal performance dashboard |
| FR-PERF-03 | Manager view: team performance, project performance, deadline adherence |
| FR-PERF-04 | Performance must NOT be defined solely by hours online |

### 1.18 Reports & Exports

| ID | Requirement |
|----|-------------|
| FR-RPT-01 | Attendance reports: daily, weekly, monthly |
| FR-RPT-02 | WFH reports: requests, approved, rejected, WFH days |
| FR-RPT-03 | Task reports: completed, pending, overdue, by employee, by project |
| FR-RPT-04 | Assignment reports: submitted, approved, rework, overdue |
| FR-RPT-05 | Work reports: daily, weekly, monthly |
| FR-RPT-06 | Export formats: PDF, CSV, Excel |

### 1.19 Audit Logs

| ID | Requirement |
|----|-------------|
| FR-AUDIT-01 | All important admin actions must be logged: actor, action, target, timestamp, IP |
| FR-AUDIT-02 | Logged events: login, logout, employee changes, task changes, assignment changes, approvals, permission changes, settings, file actions |
| FR-AUDIT-03 | Audit logs must be non-deletable by regular admins |

### 1.20 AI Assistant

| ID | Requirement |
|----|-------------|
| FR-AI-01 | AI answers natural-language queries based on user role and data |
| FR-AI-02 | AI can draft daily and weekly reports (user edits before submission) |
| FR-AI-03 | AI must respect RBAC — it cannot query data outside user permissions |
| FR-AI-04 | AI uses WebMCP tools with proper auth/authz enforcement |
| FR-AI-05 | AI must never execute arbitrary SQL |

---

## 2. Non-Functional Requirements

### 2.1 Security

| ID | Requirement |
|----|-------------|
| NFR-SEC-01 | All API traffic over HTTPS |
| NFR-SEC-02 | Passwords hashed with bcrypt |
| NFR-SEC-03 | JWT secrets stored in environment variables |
| NFR-SEC-04 | Rate limiting on login (5 attempts/minute), API (100 req/minute per user) |
| NFR-SEC-05 | CORS configured to allowed origins only |
| NFR-SEC-06 | SQL injection prevented via Prisma parameterized queries |
| NFR-SEC-07 | File uploads validated for type and size |
| NFR-SEC-08 | Error responses must never expose stack traces or DB details |
| NFR-SEC-09 | Tenant isolation enforced on every API query |
| NFR-SEC-10 | Secure HTTP headers (Helmet.js) |

### 2.2 Performance

| ID | Requirement |
|----|-------------|
| NFR-PERF-01 | Dashboard loads within 2 seconds on standard connection |
| NFR-PERF-02 | List APIs paginated (default 20 items per page) |
| NFR-PERF-03 | Redis caches frequently-accessed data (company config, user roles) |
| NFR-PERF-04 | Database indexes on: user_id, company_id, created_at, status, due_date |
| NFR-PERF-05 | File downloads served via pre-signed URLs (expires in 15 minutes) |

### 2.3 Scalability

| ID | Requirement |
|----|-------------|
| NFR-SCALE-01 | Architecture must support horizontal scaling |
| NFR-SCALE-02 | Redis used for session storage (not in-memory) |
| NFR-SCALE-03 | Socket.IO must support Redis adapter for multi-instance deployment |
| NFR-SCALE-04 | Database connection pooling via Prisma |

### 2.4 Reliability

| ID | Requirement |
|----|-------------|
| NFR-REL-01 | 99.9% uptime target |
| NFR-REL-02 | Database backups daily, retained for 30 days |
| NFR-REL-03 | Graceful error handling — no uncaught exceptions in production |
| NFR-REL-04 | Background job retries for failed notification deliveries |

### 2.5 Maintainability

| ID | Requirement |
|----|-------------|
| NFR-MAINT-01 | TypeScript strict mode enabled |
| NFR-MAINT-02 | No `any` type unless unavoidable |
| NFR-MAINT-03 | Environment variables for all secrets |
| NFR-MAINT-04 | API versioned at /api/v1/ |
| NFR-MAINT-05 | Clean separation: controllers, services, repositories |

### 2.6 Usability

| ID | Requirement |
|----|-------------|
| NFR-UX-01 | Responsive design: 375px, 768px, 1024px, 1440px breakpoints |
| NFR-UX-02 | WCAG 2.1 AA accessibility compliance |
| NFR-UX-03 | Page load must not cause layout shift (CLS < 0.1) |
| NFR-UX-04 | Keyboard navigation support on all interactive elements |
| NFR-UX-05 | All SVG icons (Lucide/Heroicons), no emoji as icons |
