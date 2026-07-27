<div align="center">

# 🚀 Space

### Full-Stack Production SaaS Workspace Collaborative Management System

_The enterprise foundational backend engine built from the ground up to learn and demonstrate state-of-the-art modern SaaS architecture._

![Node.js](https://img.shields.io/badge/Node.js-22+-339933?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-5.x_Backend-black?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_Mongoose-47A248?style=for-the-badge&logo=mongodb)
![Frontend Compatible](https://img.shields.io/badge/Frontend-Next.js_%2F_Vue_%2F_Angular-007FFF?style=for-the-badge)
![Architecture](https://img.shields.io/badge/Architecture-Modular%20Monolith-blueviolet?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-100%25_HTTP--Only_Cookies-E0234E?style=for-the-badge)

</div>

---

# 📖 About

**Space** is a complete, production-ready **Full-Stack SaaS Workspace & Collaborative Management System** inspired by industry titans like **ClickUp, Linear, Trello, Notion, Jira, and Monday.com**.

This repository represents the **first major evolution of the Full-Stack platform**: building an indestructible, highly scalable **Backend Monolith Engine**. The architecture is specifically engineered to seamlessly power modern single-page applications (Next.js, Vue, or Angular) utilizing enterprise-grade cross-site scripting (XSS)-immune cookie security, asynchronous task workers, real-time notifications, and an integrated AI collaborative copilot.

The purpose of this project is **not only to build a fully monetized SaaS platform**, but also to document a **step-by-step masterclass** in how real-world systems are architected, modularized, and scaled for high-concurrency production environments.

---

# 🎯 Goals

This project is engineered to master:

- End-to-End Full-Stack Production SaaS Architecture
- Modular Monolith Design Pattern
- 100% Pure Functional Programming Strategy (Zero OOP ES6 Classes)
- Advanced MongoDB & Mongoose ODM Optimization
- Clean Code & SOLID Principles
- Repository & Service Layer Decoupling
- Zero-Trust Authentication, RBAC & ABAC Authorization
- Event-Driven Architecture & Domain Event Emitters
- Redis In-Memory Caching & Concurrency Locks
- BullMQ Asynchronous Background Workers
- Firebase Cloud Messaging (FCM) & Real-Time Push Notifications
- Stripe SaaS Subscription Monetization & Webhooks
- Advanced AI Integration (LLM, RAG & Vector Embeddings)
- Enterprise CI/CD Production Hardening & Deployment

---

# 🏗 Architecture

This platform implements a strict **Modular Monolith Architecture** powered entirely by **Pure Asynchronous Functions**.

```
Client (Next.js / Vue / Angular / Mobile)
       │
       ▼  (HTTP Request + Secure HTTP-Only Cookie)
     Routes
       │
       ▼  (Zod Validation & RBAC Security Guards)
  Controllers
       │
       ▼  (Pure Domain Business Logic)
    Services
       │
       ▼  (Database Abstraction Layer)
  Repositories
       │
       ▼  (NoSQL Document Storage)
    MongoDB
```

### Responsibility of Each Layer

### Routes

Responsible strictly for endpoint mapping, attaching defensive Zod validation interceptors, and binding role guards.

```javascript
POST / api / v1 / auth / register;
```

---

### Controllers

- Receive and sanitize HTTP Request contexts
- Dispatch validated payloads directly into the domain service
- Embed session passes into exclusive HTTP-Only Browser Cookie Vaults
- Format uniform JSON responses via standard application wrappers
- **Never contain domain business logic**

---

### Services

Contain 100% of domain business rules, password encryption, social token cryptographic verification, and state calculations.
Examples:

- Register user & mint 6-digit hardware-entropy OTPs
- Authenticate credentials & generate dual-token JWT sessions
- Verify Google OAuth ID Tokens
- Invite multi-tenant team members
- Calculate agile sprint analytics

---

### Repositories

Responsible solely for communicating directly with MongoDB & Mongoose. Isolates query constructions and indexing from core application mechanics.

- **No business logic allowed**

---

### Database

MongoDB Atlas + Mongoose ODM (utilizing sparse unique indexing and defensive `select: false` field blinding).

---

# 🛠 Tech Stack & Why We Picked Them

| Technology / Library                        | Where & Why It is Used                                                                                                                                               |
| :------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Node.js (v22+) & Express 5**              | Core server runtime and high-performance HTTP router featuring native asynchronous exception forwarding and getter-safe request handling.                            |
| **MongoDB Atlas & Mongoose ODM**            | Scalable NoSQL cloud database engine utilizing sparse unique indexes, atomic `$set`/`$lookup` aggregation pipelines, and defensive field blinding (`select: false`). |
| **Zod**                                     | Run-time data validation and type transformation engine shielding all API input payloads, query strings, and parameters before reaching core domain logic.           |
| **Bcrypt & Node:Crypto**                    | Industrial cryptographic password hashing (12 salt rounds) and hardware-entropy numbers for secure One-Time Password (OTP) verification loops.                       |
| **JsonWebToken (JWT) & Express Cookies**    | Dual-token authentication system generating 15-minute access passes and 7-day revolving refresh passes embedded straight into browser cookies.                       |
| **Google-Auth-Library (OAuth 2.0)**         | Cryptographic RSA-signature server verification client enabling one-click Google Sign-In ID Token exchanges without risky server-side callback redirects.            |
| **Winston Logger**                          | Production colorized application log engine that dynamically stringifies objects, measures millisecond API execution durations, and formats diagnostic output.       |
| **Redis & BullMQ** _(Upcoming)_             | Sub-millisecond database RAM caching, distributed concurrency locking, and asynchronous background worker queues for non-blocking task jobs.                         |
| **Resend & Nodemailer** _(Upcoming)_        | Transactional HTML email worker automation for dispatching OTP codes, password resets, and collaborative team workspace invitation links.                            |
| **Stripe Webhooks API** _(Upcoming)_        | Automated payment tier checkout sessions (Free, Pro, Enterprise), recurring subscription lifecycles, and cryptographic webhook identity validation.                  |
| **OpenAI / Gemini Embeddings** _(Upcoming)_ | AI Copilot integration for automatic agile sprint planning, vector similarity task lookups, and executive progress summarization.                                    |
| **Docker & Docker Compose** _(Upcoming)_    | Containerized deployment orchestration running Node, MongoDB, and Redis engines seamlessly for enterprise CI/CD deployment.                                          |

---

# 📂 Project Structure

```
src/
├── config/
├── constants/
├── cron/
├── database/
├── docs/
├── events/
├── logs/
├── middlewares/
├── modules/
├── providers/
├── queues/
├── shared/
├── utils/
└── validators/
```

Inside **modules**:

```
activity/
admin/
ai/
audit/
auth/
billing/
dashboard/
members/
notifications/
projects/
tasks/
users/
workspaces/
```

---

# 📦 Authentication Module

```
auth/
├── auth.constants.js
├── auth.controller.js
├── auth.repository.js
├── auth.routes.js
├── auth.service.js
├── auth.validation.js
└── index.js
```

---

# 👤 Users Module

```
users/
├── user.constants.js
├── user.indexes.js
├── user.model.js
├── user.repository.js
├── user.service.js
└── index.js
```

---

# ✨ Current Features

## Phase 1 — Project Setup ✅

- Root Express 5 Application Bootstrap
- Strict Environment Variable Validation
- Decoupled Configuration Layer
- Resilient MongoDB Atlas Connection Pipeline
- Professional Winston Logging Engine
- Enterprise Folder Structure Scaffolding

---

## Phase 1.5 — Production Core ✅

- Immutable HTTP Status Constants
- Domain Error Codes Matrix
- Custom Operational `AppError` Hierarchy
- Standardized Universal `ApiResponse` JSON Envelope
- Enterprise Pagination Schema & Calculation Helpers
- Non-Blocking `asyncHandler` Exception Catcher
- Getter-Safe Zod `validateRequest` Interceptor
- Intelligent Winston Request Execution Timers
- Global Centralized Error Handling Middleware
- Defensive 404 Route Fallback Shield

---

## Phase 2 — Identity & Authentication Engine ✅

- Mongoose User Modeling with Sparse Unique Indexing & Defensive Blinding
- Asynchronous Bcrypt Local Registration (`/register`)
- Dual-Token Login Strategy (`/login`) via Exclusive HTTP-Only Cookie Vault
- Automated Background Token Refresh Rotation (`/refresh`)
- Anti-Enumeration Session Revocation & Logout (`/logout`)
- 6-Digit Numeric OTP Account Verification (`/verify-email`)
- Secure Password Recovery Loops (`/forgot-password`, `/reset-password`)
- Pure Functional Defensive Route Guards (`protect` and `authorize`)
- One-Click Cryptographic Google OAuth 2.0 Sign-In (`/google`)

---

## Phase 3 — Workspaces & Multi-Tenant ABAC Engine ✅

- Decoupled Multi-Tenant Tenant Data Modeling (`Workspace` & Relational `WorkspaceMember` Junctions)
- Compound Unique Indexing for Team Membership & Anti-Duplication
- Automated Corporate Workspace Logo Handling & Organization Metadata
- Deterministic URL Slugification & Enterprise Regex Screening (`/workspaces/slug/:slug`)
- Atomic Founder Onboarding Workflows (Instantaneous Creator Assignment as `OWNER`)
- Sub-Millisecond Attribute-Based Access Control (ABAC) Security Middlewares (`verifyWorkspaceRole`)
- Hierarchical Domain Access Control Matrix (`OWNER`, `ADMIN`, `MEMBER`, `GUEST`)
- Multi-Tenant Organization Switcher & Member Pagination APIs

---

# 🚧 Master SaaS Roadmap & Phase Architectural Flows

## ✅ Phase 1 & 1.5 — Project Setup & Production Core

- **Core Mission:** Construct an unbreakable application skeleton, centralized diagnostic logging, and automated global exception shields.
- **Architectural Flow:**
  ```
  Incoming HTTP Request ➔ [Cors / Security Headers] ➔ [Winston Request Logger] ➔ [Zod Validation Middleware] ➔ [asyncHandler Controller] ➔ [Universal ApiResponse JSON Wrapper]
  ```

---

## ✅ Phase 2 — Enterprise Authentication & Zero-Trust Identity Engine

- **Core Mission:** Secure onboarding, automatic background session rotation, 6-digit OTP email verification and recovery loops, defensive RBAC guards, and Google social login.
- **Architectural Flows:**
  - **Registration & OTP Loop:** `POST /register` ➔ Bcrypt Hash ➔ Generate 6-digit OTP ➔ MongoDB (`PENDING`) ➔ Submit `POST /verify-email` ➔ Account switched to `ACTIVE`!
  - **Social & Local Login Loop:** `POST /login` (or `POST /google`) ➔ Cryptographic Verification ➔ Mint JWTs ➔ Embed into Exclusive HTTP-Only Cookies!
  - **Security Guard Pipeline (`protect` & `authorize`):** Interceptor reads HTTP-Only Cookie ➔ Verifies JWT Signature ➔ Interrogates MongoDB ➔ Enforces Instantaneous Bans ➔ Evaluates Roles (`USER`, `ADMIN`).

---

## ✅ Phase 3 — Workspaces Module (Multi-Tenant Architecture)

- **Core Mission:** Multi-tenant organization! Users create isolated collaborative workspaces, upload corporate logos, and switch domains.
- **Architectural Flow:**
  ```
  POST /workspaces ➔ Verify HTTP-Only Cookie ➔ Create Workspace Document ➔ Automatically Bind Creator as 'OWNER' in Relational Membership Table ➔ Return Tenant Context.
  ```

---

## ⏳ Phase 4 — Projects Module (Agile Collaboration Engine) — _Next Up!_

- **Core Mission:** Houses customer initiatives inside Workspaces. Handles project milestones, agile statuses (`PLANNED`, `IN_PROGRESS`, `COMPLETED`), and deadline analytics.
- **Architectural Flow:**
  ```
  GET /workspaces/:id/projects?status=IN_PROGRESS&page=1 ➔ Validate Tenant Permission ➔ Mongoose Aggregation Pipeline ➔ Return Paginated Projects with Milestone Percentages.
  ```

---

## 📋 Phase 5 — Tasks & Kanban Workflow Module

- **Core Mission:** The core collaboration engine! Assign team tasks, set priority weights (`LOW`, `URGENT`), and handle drag-and-drop Kanban column transitions (`TODO`, `IN_REVIEW`, `DONE`).
- **Architectural Flow:**
  ```
  PATCH /tasks/:id/move ➔ Validate Target Column & Lexicographical Index Float ➔ Atomic MongoDB $set Update ➔ Return Realigned Kanban State.
  ```

---

## 👥 Phase 6 — Members Module & Tenant ABAC Security

- **Core Mission:** Invite team members via tokenized emails and govern workspace access via **Attribute-Based Access Control (ABAC)** team roles (`OWNER`, `ADMIN`, `MEMBER`, `GUEST`).
- **Architectural Flow:**
  ```
  POST /workspaces/:id/invite ➔ Verify OWNER/ADMIN Privilege ➔ Generate Hex Invitation Token ➔ Dispatch Email ➔ Invitee Clicks Link ➔ Added to Workspace as 'MEMBER'.
  ```

---

## 🔔 Phase 7 — Notifications & Real-Time Alert Engine

- **Core Mission:** Keeps teams informed! Broadcasts real-time activities via Firebase Cloud Messaging (FCM) push alerts, responsive email digests, and in-app activity feeds.
- **Architectural Flow:**
  ```
  Task Assigned ➔ Emits Event 'TASK_ASSIGNED' ➔ Notification Service Intercepts ➔ Pushes Real-time Alert to Frontend WebSocket / Firebase Mobile Push!
  ```

---

## 💳 Phase 8 — SaaS Billing & Stripe Monetization

- **Core Mission:** Platform monetization! Connects directly to Stripe billing, managing subscription plans (`FREE_TIER`, `PRO_TEAM`, `ENTERPRISE`), enforcing seat caps, and processing real-time webhooks.
- **Architectural Flow:**
  ```
  Stripe Webhook Event (invoice.payment_succeeded) ➔ Cryptographically Verify Signature Header ➔ Locate Tenant via Customer ID ➔ Upgrade Status to PRO_TEAM ➔ Lift Seat Restrictions!
  ```

---

## ⚡ Phase 9 — High-Performance Optimization & Caching

- **Core Mission:** Sub-millisecond speeds! Wraps repeated database queries (session authorization, workspace metadata) inside ultra-fast Redis memory cache.
- **Architectural Flow:**
  ```
  Incoming Protected Request ➔ protect Middleware ➔ Check Redis Cache for User ID ➔ [Cache Hit: Return in 0.5ms!] ➔ (If Miss: Query MongoDB ➔ Save to Redis RAM for 15m ➔ Continue).
  ```

---

## 📨 Phase 10 — Event-Driven Architecture & Worker Queues

- **Core Mission:** Eliminates HTTP response delays by offloading heavy tasks (sending confirmation emails, exporting PDF reports) to asynchronous background workers.
- **Architectural Flow:**
  ```
  POST /register ➔ Controller Generates OTP ➔ Emits Domain Event: 'USER_REGISTERED' ➔ BullMQ Worker Catches Job in Redis Queue ➔ Resend Blasts HTML Email without blocking HTTP Response!
  ```

---

## ⚙ Phase 11 — Domain Event Emitters & Async Workflows

- **Core Mission:** Decoupled internal communication! Establishes an internal domain event bus allowing isolated modules to respond to system actions without circular dependencies.
- **Architectural Flow:**
  ```
  Workspace Deleted ➔ Event Bus Emits 'WORKSPACE_DELETED' ➔ Tasks Module & Billing Module Listeners Trigger Asynchronously ➔ Prune Orphaned Records & Cancel Subscriptions cleanly!
  ```

---

## 🤖 Phase 12 — AI Collaboration Copilot (LLM + RAG Integration)

- **Core Mission:** Embeds AI productivity assistants into user workflows! Users can instruct the Copilot to turn a two-sentence project goal into a structured 10-task agile sprint.
- **Architectural Flow:**
  ```
  POST /ai/generate-tasks { prompt: "Build onboarding screen" } ➔ AI Service Sends Structured System Prompt to LLM ➔ Returns JSON Task Matrix ➔ Automatically Batch Creates Kanban Tasks!
  ```

---

# 🌐 Complete API Endpoint Reference

### 🔐 Authentication Module (`http://localhost:5000/api/v1/auth`)

| Method | Endpoint           | Description                                   | Auth Required?  | Payload / Cookie Behavior                                    |
| :----- | :----------------- | :-------------------------------------------- | :-------------: | :----------------------------------------------------------- |
| `POST` | `/register`        | Register local account & generate 6-digit OTP |      ❌ No      | JSON: `{ email, password, firstName, lastName }`             |
| `POST` | `/verify-email`    | Confirm 6-digit OTP to activate account       |      ❌ No      | JSON: `{ email, otp }` ➡️ Switches account to `ACTIVE`       |
| `POST` | `/login`           | Authenticate credentials & open session       |      ❌ No      | JSON: `{ email, password }` ➡️ **Sets HTTP-Only Cookies**    |
| `POST` | `/refresh`         | Silent background token rotation              | 🍪 Yes (Cookie) | _Empty Body_ ➡️ Reads `refreshToken` cookie, renews both     |
| `POST` | `/logout`          | Terminate active session & clear cookies      | 🍪 Yes (Cookie) | _Empty Body_ ➡️ Clears browser HTTP-Only cookie vault        |
| `POST` | `/forgot-password` | Request self-service 6-digit recovery OTP     |      ❌ No      | JSON: `{ email }`                                            |
| `POST` | `/reset-password`  | Submit recovery OTP & brand new password      |      ❌ No      | JSON: `{ email, otp, newPassword }` (Revokes prior sessions) |
| `POST` | `/google`          | One-click Google OAuth ID Token exchange      |      ❌ No      | JSON: `{ idToken: "..." }` ➡️ **Sets HTTP-Only Cookies**     |

### 🏢 Workspaces Module (`http://localhost:5000/api/v1/workspaces`)

| Method   | Endpoint        | Description                                        | Auth Required?  | ABAC Role Guard                                              |
| :------- | :-------------- | :------------------------------------------------- | :-------------: | :----------------------------------------------------------- |
| `POST`   | `/`             | Create new multi-tenant corporate workspace        | 🍪 Yes (Cookie) | _Any Authenticated User_ (Creator becomes `OWNER`)           |
| `GET`    | `/`             | Retrieve all workspaces where user is a member     | 🍪 Yes (Cookie) | _Any Workspace Member_ (`OWNER`, `ADMIN`, `MEMBER`, `GUEST`) |
| `GET`    | `/:slug`        | Retrieve workspace metadata by unique URL slug     | 🍪 Yes (Cookie) | _Any Authenticated User_                                     |
| `PATCH`  | `/:workspaceId` | Update workspace settings, name, or corporate logo | 🍪 Yes (Cookie) | **`OWNER` or `ADMIN` exclusively**                           |
| `DELETE` | `/:workspaceId` | Archive and permanently delete corporate workspace | 🍪 Yes (Cookie) | **`OWNER` exclusively**                                      |

### 💡 API Testing Setup (Postman & ApiDog):

- **Automated Cookie Jar:** When you execute `POST /login` or `POST /google`, ApiDog and Postman automatically capture the `Set-Cookie` HTTP response headers. When hitting `POST /refresh` or `POST /logout`, your saved `accessToken` and `refreshToken` cookies are transmitted automatically!
- **Local Development OTP Access:** During testing prior to Phase 10 email queues, check your VS Code terminal output during `/register` or `/forgot-password` requests to read your generated 6-digit verification security code!

---

# 🔒 Security

- **Helmet:** Automated HTTP security headers and content security policies
- **CORS:** Strict origins Cross-Origin Resource Sharing control
- **100% Exclusive HTTP-Only Cookies:** Full immunity against client browser XSS credential hijacking
- **Dual JWT Token Rotation:** Automatic session re-validation with anti-replay shield protection
- **Bcrypt Encryption:** Asynchronous password hashing utilizing 12 cryptographic salt rounds
- **Universal Zod Validation:** Comprehensive payload and parameter purification before controller execution
- **RBAC & ABAC Role Guards:** Instantaneous database ban/suspension enforcement and privilege auditing
- **Anti-Enumeration Responses:** Unified operational response strings neutralizing account enumeration bots

---

# 📚 Learning Objectives

This Full-Stack production SaaS system is built to master:

- End-to-End SaaS application architecture from database to UI
- Production-ready Express 5 and modern Node.js application scaling
- Modular Monolith clean architecture and layer decoupling
- Multi-tenant NoSQL data modeling with MongoDB Atlas
- Enterprise dual-token authentication and Zero-Trust role security
- Pure functional engineering without Object-Oriented class bloat

Every feature across all 12 phases is architected and built **step-by-step**, focusing on comprehensive theoretical analysis and system mechanics prior to implementation.

The ultimate learning goal is to master **why** specific architectural decisions, algorithmic strategies, and system structures are chosen over simply copy-pasting code.

---

# 🤝 Contributing

This project is built as a complete masterclass in full-stack production SaaS backend architecture.

Contributions, suggestions, and architectural discussions are always welcome!

---

# ⭐ Repository Status

🚧 **Currently under active architectural development**

Current Progress:

- ✅ **Phase 1 — Completed (Project Setup)**
- ✅ **Phase 1.5 — Completed (Production Core)**
- ✅ **Phase 2 — Completed (Authentication & Security Engine)**
- ✅ **Phase 3 — Completed (Workspaces & ABAC Multi-Tenant Engine)**
- ⏳ **Phase 4 — Next Up (Projects Management Module)**

---

<div align="center">

Made with ❤️ while building and mastering Full-Stack Production SaaS Architecture.

</div>
