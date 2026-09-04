# SmartGrade Database Architecture Context

## Schema Design (PostgreSQL + Prisma)

### Core Entities
1. **User**
   - Base model for authentication and profiles.
   - `role` Enum: STUDENT, TEACHER, PARENT.
2. **Class/Course**
   - Groups students and teachers together.
3. **Enrollment**
   - Join table connecting Students to Classes.
4. **Assignment**
   - Created by Teachers, assigned to a Class.
5. **Submission**
   - Created by Students for a specific Assignment.
   - Stores the AI feedback JSON directly (or parsed fields: `score`, `grade`, `strengths`, `weaknesses`).

## ACP Rule 6 (Sync Contract)
The Prisma Schema is the absolute source of truth. If a field is `String?` in Prisma, the frontend UI MUST handle the possibility of it being `null`.

## Database Rules
1. Every table must have a `createdAt` and `updatedAt` field.
2. Primary keys should be UUIDs (`@id @default(uuid())`) per ACP Rule 14.
3. Use Enums instead of magic strings where possible (roles, assignment statuses).

*Pending: Generate initial Prisma schema mapping.*
