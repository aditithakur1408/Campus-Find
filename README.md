# 📌 CampusFind

> **Lost it on campus? Spot it before it's gone.**  
> A college-tailored Lost & Found Management System designed to help students and security staff recover misplaced belongings with anti-fraud ownership verification, real-time campus statistics, and cryptographic handover verification.

---

## 🌟 Overview

Misplacing personal belongings on a busy university campus—such as student ID cards, laptop chargers, dorm keys, calculators, and wallets—frequently leads to scattered social media posts, crowded WhatsApp groups, or unanswered notices on physical bulletin boards. 

**CampusFind** solves this by offering a centralized, student-friendly digital noticeboard crafted with a unique **vintage notebook & corkboard aesthetic**. Built with strict anti-fraud safeguards, CampusFind ensures that found items are returned strictly to their rightful owners through **secret ownership verification questions** and a **6-digit in-person Handover OTP** workflow.

---

## ✨ Key Features & User Experience

### 1. 📋 Live Campus Pinboard & Discovery Feed
- **Notice Classification**: Quickly toggle between **All Notices**, **Lost Belongings**, and **Found Belongings**.
- **Dual Filter Modes**: Switch between:
  - **Category Drawer**: Electronics & Gadgets, Wallets, IDs & Cards, Keys, Bags, Books & Stationery, Clothing, Bottles, etc.
  - **Campus Spots Drawer**: Central Library, Academic Block A/B, Dining Hall, Sports Complex, Admin Building, Student Centre.
- **Full-Text Live Search**: Search by item title, brand, color, or description keywords.
- **Visual Notice Cards**: Polaroid-style photo frames, status badges (`OPEN`, `CLAIM PENDING`, `RESOLVED`), category tags, and relative timestamps.

### 2. 📊 Campus Recovery Snapshot (Real-Time Metrics)
- **Lost Notices**: Count of currently missing items reported across campus.
- **Found Notices**: Belongings safely spotted and secured by good samaritans or security.
- **Handed Over**: Total reunited belongings alongside the campus **Recovery Rate (%)**.
- **Proof Claims**: Live tally of ownership claims currently under review.

### 3. 🛡️ Anti-Fraud Ownership Claims & Verification
- When reporting a found item, finders can attach a **Secret Proof Question** (e.g., *"What wallpaper is on the lock screen?"*, *"What keychain is attached to the keys?"*).
- Claimants must provide a convincing answer before their claim is evaluated.
- **Finder & Security Review**: Finders or Campus Security Staff review submitted answers directly inside the notice drawer.

### 4. 🔑 Cryptographic 6-Digit Handover OTP
- Upon approving a claim, the system automatically generates a **one-time 6-digit Handover Code (OTP)** hashed with SHA-256.
- The claimant presents their OTP code in-person at the campus security desk or to the finder.
- Once verified in the system, the item status immediately transitions to **`RESOLVED & RETURNED`**, and an unalterable audit log is generated.

### 5. 🔍 Automated Potential Match Suggestions
- Powered by a suggestion algorithm that correlates newly reported lost items with active found notices (and vice versa) sharing the same category and keywords.

### 6. 📖 Campus Activity Logbook & Audit Trail
- An open, transparent campus audit log tracking important platform events:
  - Student & staff registrations
  - Secure logins
  - Confirmed item handovers and resolutions

### 7. 🔐 Privacy Shielding & Role-Based Access Control
- Distinct permission tiers: **`STUDENT`**, **`SECURITY_STAFF`**, and **`ADMIN`**.
- Contact details (phone numbers, personal student emails) are shielded from public view until authorized claims are processed.

---

## 🎨 Design System & Aesthetic

CampusFind features a tactile, skeuomorphic **notebook & campus corkboard** interface:
- **Typography**: Google Fonts [`Caveat`](https://fonts.google.com/specimen/Caveat) (handwritten headers), [`Patrick Hand`](https://fonts.google.com/specimen/Patrick+Hand) (body notes), and [`Special Elite`](https://fonts.google.com/specimen/Special+Elite) (typewriter badges).
- **Textured Background**: Lined notebook paper styling with spiral margin punch-holes and subtle grain overlay.
- **Interactive Sticky Notes**: Color-morphing pastel stat notes (`#ffc9dc`, `#ffe45e`, `#b8ecd0`, `#c2e5f7`) with dynamic tilt angles.
- **Handmade Accents**: Masking tape headers, ink stamp badges, hand-drawn sketch borders (`border-[2.5px]`), and animated pencil loaders.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18 (Vite 6), Tailwind CSS v3, React Router v7, Lucide Icons, Axios |
| **Backend** | Node.js, Express.js (v5), Multer (Multipart image uploads), CORS, Dotenv |
| **Database & ORM** | PostgreSQL, Prisma ORM (v6) with automated schema migrations & connection pooling |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js password hashing, Role Middleware |
| **Architecture** | RESTful API with structured response wrappers and centralized error handling |

---

## 📐 System Architecture & Handover Flow

### Architecture Overview

```mermaid
flowchart TD
    subgraph Client ["Client Tier (React 18 + Vite)"]
        UI["Pinboard & Action Modals"]
        AuthCtx["Auth Context & Token Store"]
        Axios["Axios API Client"]
    end

    subgraph Server ["Server Tier (Node.js + Express.js)"]
        Router["Express REST Router (/api)"]
        AuthMid["JWT & Role Authorization"]
        MulterMid["Multer File Uploads (/uploads)"]
        Controllers["Item, Claim & Meta Controllers"]
    end

    subgraph Database ["Persistence Tier"]
        Prisma["Prisma ORM Client"]
        PG[("PostgreSQL Database")]
        Uploads[("Local Static Uploads")]
    end

    UI --> Axios
    Axios -->|Bearer Token + JSON / Multipart| Router
    Router --> AuthMid
    Router --> MulterMid
    AuthMid --> Controllers
    MulterMid --> Uploads
    Controllers --> Prisma
    Prisma -->|Type-Safe SQL Queries| PG
```

### Anti-Fraud Claim & Handover Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Finder as Finder / Security
    actor Claimant as Owner / Claimant
    participant API as CampusFind Server
    participant DB as PostgreSQL (Prisma)

    Finder->>API: Post found item with Secret Proof Question
    Claimant->>API: View item & submit Ownership Claim Answer
    API->>DB: Store claim with status PENDING; notify Finder
    Finder->>API: Review answer & Approve Claim
    API->>DB: Generate 6-digit OTP (SHA-256 hash stored)
    API-->>Claimant: Transmit Handover OTP
    Note over Finder, Claimant: In-Person Meeting at Campus Security Desk
    Claimant->>Finder: Present 6-digit Handover Code
    Finder->>API: Submit OTP for verification
    API->>DB: Verify hash, mark item RESOLVED, write AuditLog
    API-->>Finder: Handover Confirmed!
```

---

## 🗄️ Database Entity-Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ ITEMS : "reports"
    USERS ||--o{ CLAIMS : "submits"
    USERS ||--o{ AUDIT_LOGS : "performs"
    USERS ||--o{ NOTIFICATIONS : "receives"
    CATEGORIES ||--o{ ITEMS : "categorizes"
    LOCATIONS ||--o{ ITEMS : "found_at"
    ITEMS ||--o{ ITEM_IMAGES : "contains"
    ITEMS ||--o{ CLAIMS : "receives"

    USERS {
        uuid id PK
        string email
        string fullName
        string studentId
        string role "STUDENT | SECURITY_STAFF | ADMIN"
    }

    ITEMS {
        uuid id PK
        string itemType "LOST | FOUND"
        string title
        string description
        string status "OPEN | CLAIM_PENDING | RESOLVED"
        string custodyType "WITH_FINDER | AT_SECURITY_DESK"
        string proofQuestion
        string handoverOtpHash
    }

    CLAIMS {
        uuid id PK
        string proofAnswer
        string claimStatus "PENDING | APPROVED | REJECTED | COMPLETED"
        datetime resolvedAt
    }
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) (or [pgAdmin 4](https://www.pgadmin.org/))
- npm or yarn

---

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/Campus-Find.git
cd Campus-Find
```

---

### 2. Configure the Backend Environment
Create a `.env` file in the `server/` directory:
```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your PostgreSQL credentials:
```env
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# PostgreSQL connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/campus_find?schema=public"

# Security keys
JWT_SECRET=super_secret_campus_find_key_2026_capstone
JWT_EXPIRES_IN=7d
```

---

### 3. Install Dependencies

You can install all dependencies from the root directory or inside each folder:

```bash
# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install

# Return to root
cd ..
```

---

### 4. Database Migration & Seeding
Initialize the PostgreSQL database schema and seed standard campus categories and zones:

```bash
# Run migrations to generate tables
npm run db:migrate

# Seed campus locations and categories
npm run db:seed
```

*(Optional) Launch Prisma Studio to visually inspect and manage database records:*
```bash
npm run db:studio
```

---

### 5. Run the Application

From the root directory, start both the backend API and frontend dev servers in separate terminal tabs:

**Terminal 1 (Backend Server):**
```bash
npm run server
# Express API running on http://localhost:5001
```

**Terminal 2 (Client Application):**
```bash
npm run client
# Vite SPA accessible at http://localhost:5173
```

Open your browser and navigate to **`http://localhost:5173`**.

---

## 📂 Project Structure

```plaintext
Campus-Find/
├── package.json              # Root workspace scripts (server, client, db)
├── README.md                 # Project documentation
├── docs/                     # Technical specifications & architecture
│   ├── api.md                # REST API documentation & endpoint specifications
│   ├── architecture.md       # High-level architecture & design patterns
│   └── database.md           # Database tables, relationships & schema notes
├── client/                   # Frontend React Application (Vite + Tailwind CSS)
│   ├── index.html            # Main HTML document & Google Fonts injection
│   ├── package.json          # Frontend dependencies & scripts
│   ├── vite.config.js        # Vite build tool configuration
│   ├── tailwind.config.js    # Custom sketch borders, colors & font families
│   └── src/
│       ├── App.jsx           # Root layout, modal state, filter state & routers
│       ├── main.jsx          # React DOM entrypoint
│       ├── index.css         # Notebook lined paper backgrounds, spiral binding, stamps
│       ├── components/
│       │   ├── common/       # Navbar, Footer, StatsBar, SketchLoader
│       │   ├── items/        # ItemCard, CategoryFilterBar, LocationFilterBar
│       │   └── modals/       # AuthModal, ReportModal, ItemDetailModal, ClaimModal, ActivityModal
│       ├── context/          # AuthContext (JWT management & session state)
│       ├── pages/            # HomePage (Hero, Stats, and Live Pinboard feed)
│       └── services/         # Axios services (api, authService, itemService, claimService)
└── server/                   # Backend REST API (Node.js + Express.js + Prisma)
    ├── package.json          # Backend dependencies & Prisma commands
    ├── server.js             # HTTP server listener
    ├── uploads/              # Local photo attachments directory
    ├── prisma/
    │   ├── schema.prisma     # Relational schema definition
    │   ├── migrations/       # Version-controlled SQL migration scripts
    │   └── seed.js           # Seed script for initial categories and campus zones
    └── src/
        ├── app.js            # Express app middleware setup & route mounting
        ├── config/           # Database connection client
        ├── controllers/      # Handlers (auth, item, claim, meta)
        ├── middleware/       # Authentication, authorization, file upload
        ├── routes/           # Endpoint routers (/api/auth, /api/items, /api/claims, /api/meta)
        ├── services/         # Audit log service
        └── utils/            # ApiResponse formatting & system constants
```

---

## 📡 REST API Reference

All backend endpoints are prefixed with `/api`. For complete request and response schemas, refer to [`docs/api.md`](file:///Users/akshaysisodia/Desktop/Campus-Find/docs/api.md).

| Module | Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Register a new student or staff account | No |
| | `POST` | `/api/auth/login` | Authenticate and obtain JWT token | No |
| | `GET` | `/api/auth/me` | Fetch active profile | Yes |
| **Items** | `GET` | `/api/items` | Query notices with filters (`type`, `category`, `location`, `search`) | No |
| | `POST` | `/api/items` | Post a Lost or Found notice with image upload | Yes |
| | `GET` | `/api/items/:id` | View notice details & submitted claims | Optional |
| | `PUT` | `/api/items/:id` | Update notice status or description | Yes |
| | `DELETE`| `/api/items/:id` | Delete/archive notice | Yes |
| | `GET` | `/api/items/:id/matches` | Get automated potential match suggestions | No |
| **Claims**| `POST` | `/api/claims/items/:itemId` | Submit ownership claim with proof answer | Yes |
| | `GET` | `/api/claims/items/:itemId` | List claims received for an item | Yes |
| | `PUT` | `/api/claims/:claimId/status` | Approve or reject claim (generates 6-digit OTP on approval) | Yes |
| | `POST` | `/api/claims/items/:itemId/verify-handover` | Submit 6-digit handover OTP to mark item RESOLVED | Yes |
| **Meta** | `GET` | `/api/meta/stats` | Real-time platform recovery metrics | No |
| | `GET` | `/api/meta/categories` | List all item categories | No |
| | `GET` | `/api/meta/locations` | List campus buildings & security stations | No |
| | `GET` | `/api/meta/activity` | Activity audit trail of logins, registrations, handovers | No |

---

## 🏫 Seeded Campus Locations & Categories

### Preloaded Categories
- **Electronics & Gadgets** (Phones, laptops, earphones, chargers, power banks)
- **Wallets & Money** (Wallets, purses, cash, money clips)
- **IDs, Cards & Documents** (College ID cards, driver licenses, metro cards)
- **Keys & Keychains** (Room keys, vehicle keys, cycle locks)
- **Bags & Backpacks** (Backpacks, tote bags, gym bags, laptop sleeves)
- **Books & Stationery** (Textbooks, notebooks, calculators, pencil pouches)
- **Clothing & Wearables** (Jackets, hoodies, caps, watches, jewelry)
- **Bottles & Personal Items** (Water bottles, umbrellas, glasses)
- **Others** (Miscellaneous misplaced items)

### Campus Hotspots & Handover Stations
- **Central Library**: Ground Floor / Circulation Desk *(Security Station)*, Silent Study Hall, Digital Lab
- **Academic Block A**: Ground Floor Main Lobby *(Security Station)*, 2nd Floor Computer Labs
- **Academic Block B**: 1st Floor Lecture Theatres
- **Campus Cafeteria**: Main Dining Hall
- **Sports Complex**: Gymnasium & Indoor Court *(Security Station)*
- **Admin Building**: Ground Floor Security Control Room *(Security Station)*
- **Student Centre**: Common Room & Activity Area

---

## 🔒 Security & Anti-Fraud Measures

1. **Anti-Phishing Question & Answer**: Direct contact information is protected until a claimant answers the finder's specific ownership inquiry.
2. **One-Time Passcode Handover**: 6-digit OTP verification ensures that items cannot be falsely marked as resolved without in-person confirmation.
3. **Audit Trail**: Every authentication and item handover is permanently logged with timestamps and user roles in the `audit_logs` table.
4. **JWT Expiration & Hashing**: Passwords stored using bcrypt salts; stateless token validation for authenticated requests.

---

## 📄 License & Attribution

This project was developed for educational and campus community use under the [ISC License](file:///Users/akshaysisodia/Desktop/Campus-Find/server/package.json).  
© 2026 **CampusFind** — All rights reserved.
