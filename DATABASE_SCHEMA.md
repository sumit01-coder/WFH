# WorkFlow Pro — Database Schema

**Version:** 1.0.0
**Date:** 2026-09-07
**Last Updated:** 2026-09-07T14:50:46+05:30

---

## Entity Relationship Overview

```
companies
    |
    +-- users (employees, managers, HR, admins)
    |       +-- user_roles
    |       `-- roles --> role_permissions --> permissions
    |
    +-- departments
    |       `-- teams
    |               `-- team_members (users)
    |
    +-- projects
    |       +-- project_members (users)
    |       +-- tasks
    |       |       +-- task_subtasks
    |       |       +-- task_comments
    |       |       +-- task_attachments
    |       |       `-- task_history
    |       `-- assignments
    |               +-- assignment_submissions
    |               `-- assignment_reviews
    |
    +-- attendance
    |       `-- attendance_breaks
    |
    +-- wfh_requests
    +-- leave_requests
    +-- work_reports
    +-- weekly_plans
    +-- notifications
    +-- files
    +-- goals
    +-- performance_records
    +-- audit_logs
    +-- meetings
    |       +-- meeting_participants
    |       `-- meeting_notes
    +-- chat_rooms
    |       +-- chat_members
    |       `-- chat_messages
    `-- ai_conversations
            +-- ai_messages
            `-- ai_tool_calls
```

---

## Table Definitions

---

### TABLE: companies

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, default gen_random_uuid() | |
| name | VARCHAR(255) | NOT NULL | Company name |
| slug | VARCHAR(100) | UNIQUE NOT NULL | URL-safe identifier |
| logo_url | TEXT | NULL | S3/local path |
| email | VARCHAR(255) | NOT NULL | Primary contact email |
| phone | VARCHAR(50) | NULL | |
| address | TEXT | NULL | |
| website | VARCHAR(255) | NULL | |
| timezone | VARCHAR(100) | NOT NULL, default 'UTC' | IANA timezone |
| working_days | JSONB | NOT NULL | e.g. ["MON","TUE","WED","THU","FRI"] |
| working_hours_start | TIME | NOT NULL, default '09:00' | |
| working_hours_end | TIME | NOT NULL, default '18:00' | |
| break_start | TIME | NULL | |
| break_end | TIME | NULL | |
| wfh_days_per_month | INTEGER | DEFAULT 0 | Max WFH days allowed per month |
| wfh_requires_approval | BOOLEAN | DEFAULT true | |
| subscription_plan | VARCHAR(50) | DEFAULT 'free' | free/starter/pro/enterprise |
| subscription_expires_at | TIMESTAMPTZ | NULL | |
| is_active | BOOLEAN | DEFAULT true | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes:** slug, is_active

---

### TABLE: roles

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| name | VARCHAR(50) | UNIQUE NOT NULL | SUPER_ADMIN, COMPANY_ADMIN, HR, MANAGER, TEAM_LEADER, EMPLOYEE |
| description | TEXT | NULL | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

### TABLE: permissions

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| name | VARCHAR(100) | UNIQUE NOT NULL | e.g. tasks:create, wfh:approve |
| description | TEXT | NULL | |
| resource | VARCHAR(50) | NOT NULL | e.g. tasks, wfh, employees |
| action | VARCHAR(50) | NOT NULL | e.g. create, read, update, delete, approve |

---

### TABLE: role_permissions

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| role_id | UUID | FK roles.id | |
| permission_id | UUID | FK permissions.id | |
| PRIMARY KEY | (role_id, permission_id) | | |

---

### TABLE: users

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| company_id | UUID | FK companies.id, NOT NULL | Tenant key |
| employee_id | VARCHAR(50) | NULL | Human-readable ID e.g. EMP001 |
| first_name | VARCHAR(100) | NOT NULL | |
| last_name | VARCHAR(100) | NOT NULL | |
| email | VARCHAR(255) | NOT NULL | |
| phone | VARCHAR(50) | NULL | |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt |
| photo_url | TEXT | NULL | |
| designation | VARCHAR(150) | NULL | Job title |
| department_id | UUID | FK departments.id, NULL | |
| team_id | UUID | FK teams.id, NULL | |
| manager_id | UUID | FK users.id (self), NULL | |
| joining_date | DATE | NULL | |
| status | VARCHAR(30) | NOT NULL, default 'ACTIVE' | ACTIVE, INACTIVE, ON_LEAVE, SUSPENDED |
| email_verified | BOOLEAN | DEFAULT false | |
| email_verify_token | VARCHAR(255) | NULL | |
| password_reset_token | VARCHAR(255) | NULL | |
| password_reset_expires | TIMESTAMPTZ | NULL | |
| last_login_at | TIMESTAMPTZ | NULL | |
| is_deleted | BOOLEAN | DEFAULT false | Soft delete |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Unique:** (company_id, email)
**Indexes:** company_id, department_id, team_id, manager_id, status, email

---

### TABLE: user_roles

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| user_id | UUID | FK users.id | |
| role_id | UUID | FK roles.id | |
| company_id | UUID | FK companies.id | For isolation |
| PRIMARY KEY | (user_id, role_id) | | |

---

### TABLE: refresh_tokens

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| user_id | UUID | FK users.id | |
| token_hash | VARCHAR(255) | UNIQUE NOT NULL | SHA-256 of token |
| expires_at | TIMESTAMPTZ | NOT NULL | |
| revoked | BOOLEAN | DEFAULT false | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes:** user_id, token_hash

---

### TABLE: departments

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| company_id | UUID | FK companies.id, NOT NULL | |
| name | VARCHAR(150) | NOT NULL | |
| description | TEXT | NULL | |
| head_id | UUID | FK users.id, NULL | Department head |
| is_active | BOOLEAN | DEFAULT true | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Unique:** (company_id, name)
**Indexes:** company_id, head_id

---

### TABLE: teams

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| company_id | UUID | FK companies.id, NOT NULL | |
| department_id | UUID | FK departments.id, NOT NULL | |
| name | VARCHAR(150) | NOT NULL | |
| description | TEXT | NULL | |
| leader_id | UUID | FK users.id, NULL | Team Leader |
| is_active | BOOLEAN | DEFAULT true | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Unique:** (company_id, name)
**Indexes:** company_id, department_id, leader_id

---

### TABLE: team_members

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| team_id | UUID | FK teams.id | |
| user_id | UUID | FK users.id | |
| joined_at | TIMESTAMPTZ | DEFAULT NOW() | |
| PRIMARY KEY | (team_id, user_id) | | |

---

### TABLE: projects

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| company_id | UUID | FK companies.id, NOT NULL | |
| name | VARCHAR(255) | NOT NULL | |
| description | TEXT | NULL | |
| client_name | VARCHAR(255) | NULL | |
| manager_id | UUID | FK users.id, NULL | Project manager |
| team_id | UUID | FK teams.id, NULL | |
| status | VARCHAR(30) | NOT NULL, default 'PLANNING' | PLANNING, ACTIVE, ON_HOLD, COMPLETED, CANCELLED |
| priority | VARCHAR(20) | NOT NULL, default 'MEDIUM' | LOW, MEDIUM, HIGH, CRITICAL |
| start_date | DATE | NULL | |
| end_date | DATE | NULL | |
| is_archived | BOOLEAN | DEFAULT false | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes:** company_id, manager_id, team_id, status

---

### TABLE: project_members

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| project_id | UUID | FK projects.id | |
| user_id | UUID | FK users.id | |
| role | VARCHAR(50) | DEFAULT 'MEMBER' | OWNER, MANAGER, MEMBER |
| joined_at | TIMESTAMPTZ | DEFAULT NOW() | |
| PRIMARY KEY | (project_id, user_id) | | |

---

### TABLE: tasks

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| company_id | UUID | FK companies.id, NOT NULL | |
| project_id | UUID | FK projects.id, NULL | |
| parent_task_id | UUID | FK tasks.id (self), NULL | For subtasks |
| title | VARCHAR(500) | NOT NULL | |
| description | TEXT | NULL | |
| assignee_id | UUID | FK users.id, NULL | |
| created_by_id | UUID | FK users.id, NOT NULL | |
| status | VARCHAR(30) | NOT NULL, default 'TODO' | TODO, IN_PROGRESS, BLOCKED, REVIEW, COMPLETED, CANCELLED |
| priority | VARCHAR(20) | NOT NULL, default 'MEDIUM' | LOW, MEDIUM, HIGH, CRITICAL |
| labels | TEXT[] | DEFAULT '{}' | Array of label strings |
| start_date | DATE | NULL | |
| due_date | DATE | NULL | |
| estimated_hours | DECIMAL(5,2) | NULL | |
| actual_hours | DECIMAL(5,2) | NULL | |
| checklist | JSONB | DEFAULT '[]' | [{text, done}] |
| is_archived | BOOLEAN | DEFAULT false | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes:** company_id, project_id, assignee_id, status, due_date, parent_task_id

---

### TABLE: task_dependencies

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| task_id | UUID | FK tasks.id | The task that is blocked |
| depends_on_id | UUID | FK tasks.id | The task it depends on |
| PRIMARY KEY | (task_id, depends_on_id) | | |

---

### TABLE: task_comments

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| task_id | UUID | FK tasks.id, NOT NULL | |
| user_id | UUID | FK users.id, NOT NULL | Author |
| content | TEXT | NOT NULL | |
| is_edited | BOOLEAN | DEFAULT false | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes:** task_id, user_id

---

### TABLE: task_history

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| task_id | UUID | FK tasks.id, NOT NULL | |
| changed_by_id | UUID | FK users.id, NOT NULL | |
| field_name | VARCHAR(100) | NOT NULL | Which field changed |
| old_value | TEXT | NULL | |
| new_value | TEXT | NULL | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes:** task_id

---

### TABLE: assignments

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| company_id | UUID | FK companies.id, NOT NULL | |
| project_id | UUID | FK projects.id, NULL | |
| title | VARCHAR(500) | NOT NULL | |
| description | TEXT | NULL | |
| instructions | TEXT | NULL | Detailed submission instructions |
| assigned_to_id | UUID | FK users.id, NOT NULL | Employee |
| assigned_by_id | UUID | FK users.id, NOT NULL | Manager/Admin |
| status | VARCHAR(30) | NOT NULL, default 'ASSIGNED' | ASSIGNED, IN_PROGRESS, SUBMITTED, UNDER_REVIEW, APPROVED, REWORK_REQUIRED, RESUBMITTED, CANCELLED |
| priority | VARCHAR(20) | NOT NULL, default 'MEDIUM' | |
| start_date | DATE | NULL | |
| due_date | DATE | NULL | |
| estimated_hours | DECIMAL(5,2) | NULL | |
| required_files | JSONB | DEFAULT '[]' | List of required file descriptions |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes:** company_id, project_id, assigned_to_id, assigned_by_id, status, due_date

---

### TABLE: assignment_submissions

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| assignment_id | UUID | FK assignments.id, NOT NULL | |
| submitted_by_id | UUID | FK users.id, NOT NULL | |
| version | INTEGER | NOT NULL, default 1 | Submission version number |
| notes | TEXT | NULL | Submission notes |
| submitted_at | TIMESTAMPTZ | DEFAULT NOW() | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes:** assignment_id, submitted_by_id

---

### TABLE: assignment_reviews

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| assignment_id | UUID | FK assignments.id, NOT NULL | |
| submission_id | UUID | FK assignment_submissions.id, NOT NULL | |
| reviewed_by_id | UUID | FK users.id, NOT NULL | |
| verdict | VARCHAR(30) | NOT NULL | APPROVED, REWORK_REQUIRED |
| comments | TEXT | NULL | |
| reviewed_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes:** assignment_id, submission_id

---

### TABLE: attendance

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| company_id | UUID | FK companies.id, NOT NULL | |
| user_id | UUID | FK users.id, NOT NULL | |
| date | DATE | NOT NULL | |
| check_in_at | TIMESTAMPTZ | NULL | |
| check_out_at | TIMESTAMPTZ | NULL | |
| total_minutes | INTEGER | NULL | Effective working minutes |
| break_minutes | INTEGER | NULL | Total break minutes |
| overtime_minutes | INTEGER | NULL | |
| status | VARCHAR(30) | DEFAULT 'PRESENT' | PRESENT, ABSENT, HALF_DAY, LATE, WFH, HOLIDAY |
| is_late | BOOLEAN | DEFAULT false | |
| is_early_checkout | BOOLEAN | DEFAULT false | |
| notes | TEXT | NULL | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Unique:** (user_id, date)
**Indexes:** company_id, user_id, date

---

### TABLE: attendance_breaks

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| attendance_id | UUID | FK attendance.id, NOT NULL | |
| break_start | TIMESTAMPTZ | NOT NULL | |
| break_end | TIMESTAMPTZ | NULL | |
| duration_minutes | INTEGER | NULL | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes:** attendance_id

---

### TABLE: wfh_requests

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| company_id | UUID | FK companies.id, NOT NULL | |
| user_id | UUID | FK users.id, NOT NULL | Employee |
| date | DATE | NOT NULL | WFH date |
| reason | TEXT | NOT NULL | |
| work_location | VARCHAR(255) | NULL | Home, Cafe, etc. |
| notes | TEXT | NULL | |
| status | VARCHAR(20) | NOT NULL, default 'PENDING' | PENDING, APPROVED, REJECTED, CANCELLED |
| reviewed_by_id | UUID | FK users.id, NULL | Manager/HR |
| reviewed_at | TIMESTAMPTZ | NULL | |
| review_remarks | TEXT | NULL | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Unique:** (user_id, date)
**Indexes:** company_id, user_id, date, status

---

### TABLE: leave_requests

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| company_id | UUID | FK companies.id, NOT NULL | |
| user_id | UUID | FK users.id, NOT NULL | |
| leave_type | VARCHAR(50) | NOT NULL | SICK, CASUAL, ANNUAL, UNPAID, MATERNITY, PATERNITY |
| start_date | DATE | NOT NULL | |
| end_date | DATE | NOT NULL | |
| reason | TEXT | NULL | |
| status | VARCHAR(20) | NOT NULL, default 'PENDING' | PENDING, APPROVED, REJECTED, CANCELLED |
| reviewed_by_id | UUID | FK users.id, NULL | |
| reviewed_at | TIMESTAMPTZ | NULL | |
| review_remarks | TEXT | NULL | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes:** company_id, user_id, status, start_date

---

### TABLE: work_reports

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| company_id | UUID | FK companies.id, NOT NULL | |
| user_id | UUID | FK users.id, NOT NULL | |
| date | DATE | NOT NULL | Report date |
| completed_work | TEXT | NOT NULL | What was done today |
| wip | TEXT | NULL | Work in progress |
| blockers | TEXT | NULL | Problems or blockers |
| tomorrow_plan | TEXT | NULL | Plan for tomorrow |
| hours_worked | DECIMAL(4,2) | NULL | Self-reported hours |
| status | VARCHAR(30) | DEFAULT 'DRAFT' | DRAFT, SUBMITTED, APPROVED, CHANGES_REQUESTED |
| reviewed_by_id | UUID | FK users.id, NULL | |
| review_comments | TEXT | NULL | |
| reviewed_at | TIMESTAMPTZ | NULL | |
| is_ai_generated | BOOLEAN | DEFAULT false | Was draft AI-generated |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Unique:** (user_id, date)
**Indexes:** company_id, user_id, date, status

---

### TABLE: weekly_plans

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| company_id | UUID | FK companies.id, NOT NULL | |
| user_id | UUID | FK users.id, NOT NULL | |
| week_start_date | DATE | NOT NULL | Monday of the week |
| plan | JSONB | NOT NULL | {MON:[], TUE:[], ...} array of plan items per day |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Unique:** (user_id, week_start_date)
**Indexes:** company_id, user_id, week_start_date

---

### TABLE: notifications

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| company_id | UUID | FK companies.id, NOT NULL | |
| user_id | UUID | FK users.id, NOT NULL | Recipient |
| type | VARCHAR(50) | NOT NULL | TASK_ASSIGNED, ASSIGNMENT_DUE, WFH_APPROVED, REPORT_REMINDER, etc. |
| title | VARCHAR(255) | NOT NULL | |
| body | TEXT | NULL | |
| resource_type | VARCHAR(50) | NULL | task, assignment, wfh, etc. |
| resource_id | UUID | NULL | ID of related resource |
| is_read | BOOLEAN | DEFAULT false | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes:** company_id, user_id, is_read, created_at

---

### TABLE: files

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| company_id | UUID | FK companies.id, NOT NULL | |
| uploaded_by_id | UUID | FK users.id, NOT NULL | |
| resource_type | VARCHAR(50) | NOT NULL | task, assignment, project, work_report, meeting |
| resource_id | UUID | NOT NULL | ID of related resource |
| original_name | VARCHAR(500) | NOT NULL | |
| stored_name | VARCHAR(500) | NOT NULL | UUID-based filename |
| file_path | TEXT | NOT NULL | Storage path |
| mime_type | VARCHAR(100) | NOT NULL | |
| size_bytes | BIGINT | NOT NULL | |
| version | INTEGER | DEFAULT 1 | For assignment submissions |
| is_deleted | BOOLEAN | DEFAULT false | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes:** company_id, resource_type, resource_id, uploaded_by_id

---

### TABLE: meetings

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| company_id | UUID | FK companies.id, NOT NULL | |
| project_id | UUID | FK projects.id, NULL | |
| title | VARCHAR(500) | NOT NULL | |
| description | TEXT | NULL | |
| organizer_id | UUID | FK users.id, NOT NULL | |
| start_at | TIMESTAMPTZ | NOT NULL | |
| end_at | TIMESTAMPTZ | NOT NULL | |
| location | VARCHAR(255) | NULL | Room, Meet link, etc. |
| status | VARCHAR(20) | DEFAULT 'SCHEDULED' | SCHEDULED, ONGOING, COMPLETED, CANCELLED |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes:** company_id, organizer_id, start_at

---

### TABLE: meeting_participants

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| meeting_id | UUID | FK meetings.id | |
| user_id | UUID | FK users.id | |
| rsvp | VARCHAR(20) | DEFAULT 'PENDING' | PENDING, ACCEPTED, DECLINED |
| PRIMARY KEY | (meeting_id, user_id) | | |

---

### TABLE: meeting_notes

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| meeting_id | UUID | FK meetings.id, NOT NULL | |
| written_by_id | UUID | FK users.id, NOT NULL | |
| content | TEXT | NOT NULL | |
| action_items | JSONB | DEFAULT '[]' | [{text, assigned_to, due_date}] |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

### TABLE: chat_rooms

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| company_id | UUID | FK companies.id, NOT NULL | |
| type | VARCHAR(20) | NOT NULL | DIRECT, TEAM, PROJECT |
| name | VARCHAR(255) | NULL | For team/project rooms |
| team_id | UUID | FK teams.id, NULL | |
| project_id | UUID | FK projects.id, NULL | |
| created_by_id | UUID | FK users.id, NOT NULL | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes:** company_id, type

---

### TABLE: chat_members

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| room_id | UUID | FK chat_rooms.id | |
| user_id | UUID | FK users.id | |
| joined_at | TIMESTAMPTZ | DEFAULT NOW() | |
| last_read_at | TIMESTAMPTZ | NULL | For unread count |
| PRIMARY KEY | (room_id, user_id) | | |

---

### TABLE: chat_messages

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| room_id | UUID | FK chat_rooms.id, NOT NULL | |
| sender_id | UUID | FK users.id, NOT NULL | |
| content | TEXT | NULL | Text content |
| type | VARCHAR(20) | DEFAULT 'TEXT' | TEXT, FILE, SYSTEM |
| file_id | UUID | FK files.id, NULL | For file messages |
| mentions | UUID[] | DEFAULT '{}' | Array of mentioned user IDs |
| is_edited | BOOLEAN | DEFAULT false | |
| is_deleted | BOOLEAN | DEFAULT false | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes:** room_id, sender_id, created_at

---

### TABLE: goals

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| company_id | UUID | FK companies.id, NOT NULL | |
| created_by_id | UUID | FK users.id, NOT NULL | |
| assigned_to_id | UUID | FK users.id, NULL | NULL = team goal |
| team_id | UUID | FK teams.id, NULL | NULL = individual goal |
| title | VARCHAR(500) | NOT NULL | |
| description | TEXT | NULL | |
| target_value | DECIMAL(10,2) | NOT NULL | |
| current_value | DECIMAL(10,2) | DEFAULT 0 | |
| unit | VARCHAR(50) | NOT NULL | tasks, hours, assignments, % |
| period | VARCHAR(20) | NOT NULL | WEEKLY, MONTHLY, QUARTERLY, YEARLY |
| start_date | DATE | NOT NULL | |
| end_date | DATE | NOT NULL | |
| status | VARCHAR(20) | DEFAULT 'ACTIVE' | ACTIVE, COMPLETED, CANCELLED |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes:** company_id, assigned_to_id, team_id, status

---

### TABLE: performance_records

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| company_id | UUID | FK companies.id, NOT NULL | |
| user_id | UUID | FK users.id, NOT NULL | |
| period | VARCHAR(20) | NOT NULL | WEEKLY, MONTHLY |
| period_start | DATE | NOT NULL | |
| period_end | DATE | NOT NULL | |
| tasks_completed | INTEGER | DEFAULT 0 | |
| tasks_on_time | INTEGER | DEFAULT 0 | |
| tasks_overdue | INTEGER | DEFAULT 0 | |
| assignments_completed | INTEGER | DEFAULT 0 | |
| assignments_rework | INTEGER | DEFAULT 0 | |
| reports_submitted | INTEGER | DEFAULT 0 | |
| reports_expected | INTEGER | DEFAULT 0 | |
| attendance_days | INTEGER | DEFAULT 0 | |
| wfh_days | INTEGER | DEFAULT 0 | |
| computed_score | DECIMAL(5,2) | NULL | Overall score (0-100) |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Unique:** (user_id, period, period_start)
**Indexes:** company_id, user_id, period_start

---

### TABLE: audit_logs

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| company_id | UUID | FK companies.id, NULL | NULL for super admin actions |
| actor_id | UUID | FK users.id, NOT NULL | Who performed the action |
| action | VARCHAR(100) | NOT NULL | e.g. user.deactivate, task.status_change |
| resource_type | VARCHAR(50) | NULL | e.g. user, task, assignment |
| resource_id | UUID | NULL | |
| old_data | JSONB | NULL | Snapshot before change |
| new_data | JSONB | NULL | Snapshot after change |
| ip_address | VARCHAR(50) | NULL | |
| user_agent | TEXT | NULL | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes:** company_id, actor_id, action, resource_type, created_at

---

### TABLE: ai_conversations

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| company_id | UUID | FK companies.id, NOT NULL | |
| user_id | UUID | FK users.id, NOT NULL | |
| title | VARCHAR(255) | NULL | Auto-generated from first message |
| is_active | BOOLEAN | DEFAULT true | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes:** company_id, user_id

---

### TABLE: ai_messages

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| conversation_id | UUID | FK ai_conversations.id, NOT NULL | |
| role | VARCHAR(20) | NOT NULL | user, assistant, tool |
| content | TEXT | NULL | |
| token_count | INTEGER | NULL | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes:** conversation_id

---

### TABLE: ai_tool_calls

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| message_id | UUID | FK ai_messages.id, NOT NULL | |
| tool_name | VARCHAR(100) | NOT NULL | WebMCP tool name |
| input | JSONB | NOT NULL | Tool input parameters |
| output | JSONB | NULL | Tool result |
| status | VARCHAR(20) | DEFAULT 'PENDING' | PENDING, SUCCESS, ERROR |
| error | TEXT | NULL | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes:** message_id

---

## Relationships Summary

| From | To | Type | Via |
|------|----|------|-----|
| companies | users | 1:N | company_id |
| companies | departments | 1:N | company_id |
| departments | teams | 1:N | department_id |
| teams | users | N:M | team_members |
| users | users (manager) | N:1 self-join | manager_id |
| users | roles | N:M | user_roles |
| roles | permissions | N:M | role_permissions |
| projects | tasks | 1:N | project_id |
| projects | assignments | 1:N | project_id |
| projects | project_members | 1:N | project_id |
| tasks | tasks (subtasks) | 1:N self-join | parent_task_id |
| tasks | task_comments | 1:N | task_id |
| tasks | task_history | 1:N | task_id |
| tasks | task_dependencies | N:M self-join | depends_on_id |
| assignments | assignment_submissions | 1:N | assignment_id |
| assignment_submissions | assignment_reviews | 1:N | submission_id |
| attendance | attendance_breaks | 1:N | attendance_id |
| meetings | meeting_participants | 1:N | meeting_id |
| meetings | meeting_notes | 1:N | meeting_id |
| chat_rooms | chat_members | 1:N | room_id |
| chat_rooms | chat_messages | 1:N | room_id |
| users | files | 1:N | uploaded_by_id |
| files | tasks/assignments/projects | polymorphic | resource_type + resource_id |
