# WorkNexus — System Workflow

**Version:** 1.0.0
**Date:** 2026-09-07
**Last Updated:** 2026-09-07T14:50:46+05:30

---

## 1. Employee Daily Workflow

```
Employee Starts Day
        |
        v
    CHECK IN
  (Attendance recorded, timestamp logged, Socket.IO: manager sees "Working")
        |
        v
   VIEW DASHBOARD
  (Today's tasks, upcoming deadlines, pending assignments, WFH status, notifications)
        |
        v
   WORK ON TASKS
  (Change status: In Progress, update actual hours)
        |
        v
   START BREAK
  (Attendance break recorded, Socket.IO: manager sees "On Break")
        |
        v
   END BREAK
  (Break duration calculated, resume status)
        |
        v
  SUBMIT ASSIGNMENTS
  (Upload files, add notes, version stored, manager notified)
        |
        v
  SUBMIT DAILY REPORT
  (Completed work, WIP, blockers, tomorrow plan)
        |
        v
    CHECK OUT
  (Total time, effective time, overtime calculated, logged out from Socket.IO)
```

---

## 2. Manager Daily Workflow

```
Manager Starts Day
        |
        v
   VIEW MANAGER DASHBOARD
  (Real-time: Total team, Working Now, WFH Today, On Break, Offline)
        |
        v
   REVIEW PENDING ITEMS
  (Assignments Under Review, Pending Daily Reports, WFH Requests)
        |
        v
   REVIEW ASSIGNMENT SUBMISSION
  (Read submission, review files, leave comments)
        |
        v
   APPROVE OR REWORK
  (Employee notified instantly via Socket.IO + notification)
        |
        v
   REVIEW DAILY REPORT
  (Read report, approve or request changes, leave comment)
        |
        v
   CREATE TASKS / ASSIGNMENTS
  (Assign to employees, set priority, due date, instructions)
        |
        v
   APPROVE WFH REQUESTS
  (Review WFH request, approve or reject with remarks)
```

---

## 3. Task Lifecycle

```
CREATED (by Manager/Admin)
        |
        v
     TO DO (assignee notified)
        |
        v
  IN PROGRESS (employee starts working)
        |
        v
   [BLOCKED?] --> Yes --> BLOCKED (blocker noted, manager notified)
        |                     |
        No                    v (blocker resolved)
        |               IN PROGRESS
        v
    REVIEW (employee marks complete, manager notified)
        |
        v
   [Approved?]
    Yes   No
     |     |
     v     v
COMPLETED BACK TO IN PROGRESS / BLOCKED
```

---

## 4. Assignment Lifecycle

```
CREATED & ASSIGNED (manager creates assignment)
        |
        v
     ASSIGNED (employee notified, deadline set)
        |
        v
  IN PROGRESS (employee starts)
        |
        v
   SUBMITTED (employee uploads files, adds notes)
        |
        v
  UNDER REVIEW (manager/reviewer reads submission)
        |
        v
  [Verdict?]
    Approved    Rework Required
        |              |
        v              v
   APPROVED       REWORK REQUIRED
                       |
                       v (employee revises)
                  RESUBMITTED (version+1 stored)
                       |
                       v
                 UNDER REVIEW (again)
                       |
                       v
                   APPROVED
```

All submission versions are permanently stored.

---

## 5. WFH Request Workflow

```
EMPLOYEE submits WFH request
  (Date, Reason, Work Location, Notes)
        |
        v
   PENDING (Manager/HR notified)
        |
        v
   Manager/HR reviews
        |
        v
  [Decision?]
   Approved      Rejected
       |              |
       v              v
  APPROVED         REJECTED
  (Employee        (Employee
   notified)        notified with
                    remarks)
        |
        v
  Attendance for that day marked as WFH
  WFH Calendar updated
```

---

## 6. Attendance Workflow

```
09:00 AM - Employee opens dashboard
        |
        v
   CHECK IN BUTTON
  (Attendance record created, check_in_at recorded)
  Late? -> is_late = true (if after company working_hours_start + grace period)
        |
        v
   Working status -> Socket.IO broadcasts to manager
        |
        v
   Employee works...
        |
        v
   START BREAK (attendance_break record: break_start)
        |
        v
   END BREAK (break_end, duration calculated)
        |
        v
   Employee continues...
        |
        v
   CHECK OUT
  (check_out_at recorded)
  Early? -> is_early_checkout = true
  Calculate: total_minutes, break_minutes, effective_working_minutes, overtime
        |
        v
   Status -> Offline (Socket.IO broadcast)
```

---

## 7. Daily Report Workflow

```
5:00 PM - System sends REMINDER notification to employees
           who have not submitted today's report
        |
        v
   EMPLOYEE opens Daily Report form
        |
        v
   [AI Assist?]
    Yes  No
     |    |
     v    v
  AI drafts report    Employee fills manually
  from today's        (completed, WIP, blockers,
  task/assignment     plan, hours)
  activity
     |
     v
  Employee reviews + edits AI draft
        |
        v
   SUBMIT REPORT
        |
        v
   Manager notified
        |
        v
   Manager reviews
        |
        v
   APPROVED / CHANGES REQUESTED
        |
        v
   Employee notified
```

---

## 8. Notification Flow

```
Event Trigger (e.g., Assignment submitted)
        |
        v
   Backend: Create notification record in DB
        |
        v
   Redis Queue: Push notification job
        |
        v
   BullMQ Worker picks up job
        |
        v
   Socket.IO emit to user room (if online)
   + (optionally) Email notification
        |
        v
   Client receives notification in real-time
   Bell icon badge count updates
```

Scheduled notifications (deadline reminders):
```
BullMQ Cron Job (runs every hour)
        |
        v
   Query: tasks/assignments due in next 24h
        |
        v
   Create notification records
        |
        v
   Emit via Socket.IO
```

---

## 9. Authentication Flow

```
POST /api/v1/auth/login
        |
        v
  Validate: email + password format (Zod)
        |
        v
  Find user by email in company (or super admin)
        |
        v
  bcrypt.compare(password, hash)
        |
        v
  Generate:
    accessToken (JWT, 15min, contains userId, companyId, role)
    refreshToken (random UUID, stored in DB + Redis, 7 days)
        |
        v
  Return tokens to client
        |
        v
  Client stores accessToken in memory
  Client stores refreshToken in httpOnly cookie
        |
        v
  API Request:
    Authorization: Bearer <accessToken>
        |
        v
  AuthMiddleware: verify JWT signature + expiry
        |
        v
  RBACMiddleware: check user role + permission
        |
        v
  TenantMiddleware: attach company_id to request
        |
        v
  Controller handles request
```

Token refresh:
```
accessToken expired
        |
        v
  Client sends refreshToken (httpOnly cookie)
        |
        v
  Backend: lookup token in Redis (not revoked)
        |
        v
  Issue new accessToken + new refreshToken
  Revoke old refreshToken
        |
        v
  Return new tokens
```

---

## 10. File Upload Workflow

```
User selects file(s)
        |
        v
  Frontend: validate file type + size (client-side preview)
        |
        v
  POST /api/v1/files (multipart/form-data)
        |
        v
  Backend middleware:
    Validate MIME type (whitelist)
    Validate size (company policy)
        |
        v
  Store file:
    Generate UUID-based filename
    Save to S3/local storage
        |
        v
  Create file record in DB:
    company_id, uploaded_by_id, resource_type, resource_id
    original_name, stored_name, file_path, mime_type, size_bytes
        |
        v
  Return file metadata (id, name, url)

File Download:
        |
        v
  GET /api/v1/files/:id/download
        |
        v
  Backend: check user permission (same company, resource access)
        |
        v
  Generate pre-signed URL (expires 15 minutes)
        |
        v
  Return URL to client
        |
        v
  Client downloads directly from storage
```

---

## 11. AI + WebMCP Workflow

```
Employee types: "What tasks do I have today?"
        |
        v
  AI receives message with user context:
    { userId, companyId, role, currentDate }
        |
        v
  AI decides to call WebMCP tool: get_my_tasks
        |
        v
  WebMCP tool handler:
    1. Verify user is authenticated
    2. Check role permission (EMPLOYEE can call get_my_tasks)
    3. Query Service: TaskService.getMyTasks(userId, companyId, today)
    4. Return structured data
        |
        v
  AI formats response:
    "You have 3 tasks today:
     1. Complete API documentation (Due: 5 PM, High Priority)
     2. Fix login bug (Due: 3 PM, Critical)
     3. Team meeting prep (Due: 2 PM, Medium)"
        |
        v
  Employee sees formatted, helpful response
```

Security guarantee: AI NEVER executes raw SQL. All data access is through typed WebMCP tools with full RBAC.

---

## 12. Real-Time Presence Workflow

```
User logs in / opens dashboard
        |
        v
  Socket.IO connection established (JWT in handshake)
        |
        v
  Server: verify JWT, get userId, companyId
        |
        v
  User joins rooms:
    user:{userId}          (personal notifications)
    company:{companyId}    (company-wide events)
    team:{teamId}          (team events)
        |
        v
  Server broadcasts to company room:
    presence:online { userId, name, status: 'WORKING' }
        |
        v
  Manager dashboard updates in real-time
        |
        v
  User disconnects (logout or browser close)
        |
        v
  Server broadcasts:
    presence:offline { userId }
        |
        v
  Set Redis key: user:{userId}:lastSeen = now()
```
