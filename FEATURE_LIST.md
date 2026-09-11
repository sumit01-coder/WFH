# WorkNexus — Feature List

**Version:** 1.0.2
**Date:** 2026-09-10
**Last Updated:** 2026-09-10T13:10:00+05:30

---

## MVP Features (v1.0) â€” Build First

### F01 â€” Authentication System
- [x] Email + password login
- [x] JWT access token (15 min TTL)
- [x] Refresh token rotation (7 days TTL)
- [x] Logout + token revocation
- [x] Forgot password (email OTP)
- [x] Reset password
- [x] Email verification on registration
- [x] Role-based dashboard redirect after login
- [x] Session management (Redis-backed)
- [x] Change password

### F02 â€” Multi-Tenant Company Onboarding
- [x] Company registration / self-onboarding
- [x] Company profile: name, logo, email, phone, address, website, timezone
- [x] Working days configuration (Mon-Fri, custom)
- [x] Working hours configuration (default 09:00-18:00)
- [x] Break policy configuration
- [x] WFH policy configuration (days per month, auto-approve threshold)
- [x] Tenant isolation enforced on all data

### F03 â€” Employee Management
- [x] Add / edit / deactivate employees
- [x] Employee fields: ID, name, email, phone, dept, team, designation, manager, joining date, status, photo
- [x] Employee status: Active, Inactive, On Leave, Suspended
- [x] Assign to department, team, manager
- [x] Invite via email
- [x] Account reset
- [x] Employee directory with search/filter

### F04 â€” Department Management
- [x] Create / edit / archive departments
- [x] Assign employees to departments
- [x] Department head assignment
- [x] View department members and stats

### F05 â€” Team Management
- [x] Create / edit / archive teams within departments
- [x] Add/remove team members
- [x] Assign team leader
- [x] View team performance summary

### F06 â€” Project Management
- [x] Create projects: name, description, client, dates, manager, team, status, priority
- [x] Project statuses: Planning, Active, On Hold, Completed, Cancelled
- [x] Project members management
- [x] Project activity feed
- [x] Project files section
- [x] Project comments
- [x] Project overview dashboard

### F07 â€” Task Management
- [x] Create tasks with: title, description, project, assignee, priority, status, dates, hours, labels, attachments
- [x] Task statuses: To Do, In Progress, Blocked, Review, Completed, Cancelled
- [x] Priorities: Low, Medium, High, Critical
- [x] Subtasks (nested)
- [x] Checklists
- [x] Task comments
- [x] Task attachments
- [x] Task history (all changes logged)
- [x] Task dependencies (blocks/blocked-by)
- [x] Due-date reminders (automated)
- [x] Bulk task operations
- [x] Kanban board view
- [x] List view
- [x] Filters: status, priority, assignee, project, date

### F08 â€” Assignment Management
- [x] Create assignments: title, description, project, employee, assignor, priority, dates, hours, files, instructions
- [x] Full workflow: Assigned -> In Progress -> Submitted -> Under Review -> Approved
- [x] Rework flow: Rework Required -> Resubmitted -> Approved
- [x] Version history (all submissions stored)
- [x] Reviewer comments per submission
- [x] Deadline reminders (automated)

### F09 â€” WFH Management
- [x] Employee WFH request submission: date, reason, location, notes
- [x] Statuses: Pending, Approved, Rejected, Cancelled
- [x] Manager/HR approve/reject with remarks
- [x] WFH calendar (Office / WFH / Holiday per day)
- [x] WFH policy enforcement
- [x] WFH history per employee

### F10 â€” Attendance System
- [x] Check In / Check Out
- [x] Start Break / End Break
- [x] Auto-calculate: total time, break time, effective time, overtime
- [x] Late login detection
- [x] Early logout detection
- [x] Attendance status per employee (real-time)
- [x] Attendance calendar per employee
- [x] Admin/HR attendance dashboard

### F11 â€” Daily Work Reports
- [x] Submit report: completed work, WIP, blockers, tomorrow plan, hours, attachments
- [x] Manager actions: approve, request changes, comment
- [x] Report history retained
- [x] Reminder notification at 5 PM
- [x] Report status: Draft, Submitted, Approved, Changes Requested

### F12 â€” Weekly Work Planning
- [x] Create weekly plans per day
- [x] Manager view of all team weekly plans
- [x] Plans editable during the week

### F13 â€” Manager Dashboard
- [x] Team summary: Total, Working Now, WFH Today, On Break, Offline
- [x] Pending tasks count
- [x] Overdue tasks count
- [x] Pending assignment reviews
- [x] Pending daily reports
- [x] Team activity timeline
- [x] Real-time updates via Socket.IO

### F14 â€” Employee Dashboard
- [x] Today's attendance (check in/out button)
- [x] Working hours today
- [x] Current status
- [x] Today's tasks
- [x] Upcoming deadlines
- [x] Pending assignments
- [x] WFH status
- [x] Daily report status
- [x] Notifications panel
- [x] Weekly progress

### F15 â€” Notifications System
- [x] In-app notifications
- [x] Real-time delivery via Socket.IO
- [x] Scheduled notifications via Redis/BullMQ
- [x] Notification types: assignment, task, WFH, report, meeting, mention, message
- [x] Mark as read/unread
- [x] Notification bell with badge count

### F16 â€” Basic Reports
- [x] Attendance reports (daily, weekly, monthly)
- [x] WFH reports (requests, approved, rejected)
- [x] Task reports (by status, employee, project)
- [x] Assignment reports (by status, employee)
- [x] Work report history
- [x] Export: PDF, CSV, Excel

### F17 â€” Audit Logs
- [x] Log all admin actions with: actor, action, target, timestamp, IP
- [x] Login/logout logs
- [x] Employee change logs
- [x] Task/assignment change logs
- [x] Approval/rejection logs
- [x] Permission change logs
- [x] Company settings change logs
- [x] File action logs
- [x] Non-deletable by regular users

### F18 â€” Work Timeline
- [x] Transparent activity timeline per employee
- [x] Activities: login, task started, assignment submitted, meeting, break, logout
- [x] Only platform-generated events (no invasive tracking)

### F19 â€” Search & Filtering
- [x] Global search: employees, tasks, assignments, projects, reports, files
- [x] Filters: date, employee, department, team, project, priority, status

### F20 â€” Windows Desktop Application
- [x] Electron-based Windows installer
- [x] Auto-updater via GitHub Releases
- [x] Real-time version checking and download

### F21 â€” Super Admin Chat
- [x] Direct real-time chat between Super Admin and Company Admins
- [x] Cross-tenant chat room auto-provisioning

---

## Phase 2 Features (v1.5) â€” Add After MVP is Stable

### F20 â€” Team Chat
- [ ] One-to-one messaging
- [ ] Team chat rooms
- [ ] Project chat rooms
- [ ] File sharing in chat
- [ ] Mentions (@user)
- [ ] Read receipts
- [ ] Message history
- [ ] Real-time via Socket.IO

### F21 â€” Meeting Management
- [ ] Schedule meetings: title, description, date, time, organizer, participants, project
- [ ] Calendar view
- [ ] Meeting notifications
- [ ] Participant management
- [ ] Meeting notes
- [ ] Action items from meetings

### F22 â€” Goals & KPIs
- [ ] Manager creates goals: name, target, period, assigned to
- [ ] Auto-track progress from tasks/assignments
- [ ] Goal types: Individual, Team, Monthly, Quarterly
- [ ] Progress visualization

### F23 â€” Performance Analytics
- [ ] Metrics: tasks completed, on-time %, rework rate, report submission %
- [ ] Employee performance dashboard
- [ ] Manager team performance view
- [ ] Project performance analytics
- [ ] Trend charts (weekly/monthly)

### F24 â€” Advanced Reports
- [ ] Custom date range reports
- [ ] Cross-department comparison
- [ ] Performance trend analysis
- [ ] Executive summary report

---

## Phase 3 Features (v2.0) â€” AI & Automation

### F25 â€” AI Assistant
- [ ] Natural language queries for employees and managers
- [ ] Role-restricted data access
- [ ] Draft daily/weekly reports
- [ ] Task suggestions
- [ ] Risk detection (overdue tasks/assignments)

### F26 â€” AI Daily Summary
- [ ] Auto-generate end-of-day summary
- [ ] Editable before submission
- [ ] Includes: completed tasks, time, blockers, tomorrow plan

### F27 â€” AI Weekly Summary
- [ ] Auto-generate weekly summary
- [ ] Metrics: tasks, assignments, on-time rate
- [ ] Risk alerts: approaching deadlines

### F28 â€” WebMCP Integration
- [ ] Controlled tool layer for AI
- [ ] Employee tools: get_my_tasks, submit_assignment, create_work_report, etc.
- [ ] Manager tools: get_team_summary, get_pending_assignments, etc.
- [ ] All tools enforce RBAC and tenant isolation

---

## Future Features (v3.0+) â€” Not in Current Scope

- Mobile Application (React Native)
- Video Meeting Integration
- Payroll Integration
- Leave Management System
- Calendar Integration (Google/Outlook)
- Email Integration
- Slack / Microsoft Teams Integration
- Enterprise SSO (SAML/OIDC)
- Custom Workflow Builder
- Billing & Subscription Management
- Advanced AI Work Planning
- AI Risk Detection System
