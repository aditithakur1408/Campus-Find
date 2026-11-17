# CampusFind REST API Specification

## Base URL
`http://localhost:5001/api`

---

## 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT | No |
| `GET` | `/api/auth/me` | Fetch active user session profile | Yes (`Bearer <token>`) |

---

## 2. Items Endpoints (`/api/items`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/items` | List notices with query filters (`type`, `categoryId`, `locationId`, `search`) | No |
| `GET` | `/api/items/:id` | View complete notice details and received claims (if owner/staff) | Optional |
| `POST` | `/api/items` | Report a Lost or Found item with image upload | Yes |
| `PUT` | `/api/items/:id` | Update notice details (creator or admin) | Yes |
| `DELETE` | `/api/items/:id` | Delete/archive notice (creator or admin) | Yes |
| `GET` | `/api/items/:id/matches` | Get potential matching notices | No |

---

## 3. Claims & Handover Endpoints (`/api/claims`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/claims/items/:itemId` | Submit ownership claim with proof answer | Yes |
| `GET` | `/api/claims/items/:itemId` | View claims submitted for this item (finder or staff) | Yes |
| `PUT` | `/api/claims/:claimId/status` | Approve or reject claim (generates 6-digit OTP on approval) | Yes |
| `POST` | `/api/claims/items/:itemId/verify-handover` | Submit 6-digit handover PIN to mark item as RESOLVED | Yes |

---

## 4. Metadata & Activity Endpoints (`/api/meta`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/meta/categories` | List all item categories | No |
| `GET` | `/api/meta/locations` | List campus buildings and floors | No |
| `GET` | `/api/meta/stats` | Platform metrics (total lost, found, returned, claims) | No |
| `GET` | `/api/meta/activity` | Activity audit trail of logins, registrations, handovers | No |
