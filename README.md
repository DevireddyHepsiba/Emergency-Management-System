# Sentinelos — Hospital Emergency Management System

Sentinelos is a learning project for coordinating emergency reports and response work. A person can submit an incident with a location; hospital, rescue, volunteer, and administrator views support related operational tasks. The repository contains a Spring Boot API and a React/TypeScript web app.

> **Project status:** Development prototype for demonstrating an incident-to-response workflow. It is not connected to real dispatch centers, ambulance radios, hospital systems, or verified live operational feeds. Do not use it for real emergency response or patient care; call your local emergency number.

## What is currently in the repository

- Account registration and email/password login with JWTs
- Emergency reporting and incident status endpoints
- Dispatcher triage for priority, required clinical services, bed type, ambulance need, and capability
- Hospital matching by active status, listed service, requested bed category, recently updated capacity, and straight-line distance
- Ambulance matching by availability, capability, and recently refreshed GPS location
- Response offers with separately recorded team and receiving-hospital acceptance, then mission status history linked to the original report
- Hospital directory, resource/status endpoints, and ambulance fleet/location controls
- Volunteer task endpoints
- Admin dashboard endpoints for volunteers, supplies, AI metrics, and health records
- A React interface for login, registration, emergency reporting, hospitals, rescue missions, volunteer tasks, and dashboard views
- Rule-based emergency priority, duplicate checking, volunteer assignment, and response recommendation services. These are heuristics, not a connected AI model.

Matching distances are straight-line estimates, not road routes or travel times. Capacity freshness depends on hospital staff updating counts; acceptance is recorded by a user and does not send a real notification. Ambulance GPS is refreshed from a browser device when a fleet user requests it; this is not continuous tracking. The current app does **not** provide automatic dispatch, verified real-time service monitoring, predictive analytics, or a complete donation/inventory workflow. Do not rely on dashboard values as operational measurements.

## Incident-to-response demonstration flow

1. A citizen submits an emergency report and receives a tracking ID. Submission records the report; it does not dispatch help.
2. An administrator acting as dispatcher reviews the report and saves triage: priority, services, bed type, ambulance need/capability, and notes.
3. The dispatcher requests recommendations. The system filters hospitals and ambulances against the triage needs and available data, then sorts eligible options by straight-line distance.
4. The dispatcher creates a response offer linked to the incident. The rescue team and hospital accounts record their decisions; a decline leaves the incident triaged for a new selection.
5. Once all required parties accept, the mission can progress through en route, on scene, transporting, arrived, and completed. The reporter can follow incident status and history in My Reports.
6. Hospital and fleet users maintain service lists, bed counts, unit capabilities, availability, and GPS location. Stale or missing data is excluded from recommendations.

This workflow is a coordination prototype. User role is not yet bound to a specific hospital or ambulance organization, notifications are not delivered externally, and human dispatchers must independently verify all details.

## Technology

- Backend: Java 17, Spring Boot, Maven, MongoDB, Spring Security, JWT
- Frontend: React, TypeScript, Vite
- No external AI provider is connected. Emergency classification and related recommendations use basic rules and should be treated as suggestions only.

## Repository layout

```text
backend/   Spring Boot REST API and MongoDB persistence
frontend/  React and TypeScript web application
docs/      API, setup, and project notes
README.md  Project overview and setup
```

## Requirements

- JDK 17 or newer
- Node.js 18 or newer and npm
- MongoDB local instance or MongoDB Atlas URI
- Maven 3.6+ (or use the included Maven wrapper from `backend`)

## Configure and run

### 1. Configure the backend

Set the MongoDB URI and a private JWT signing secret in the environment. The secret must contain at least 32 bytes. Do not commit credentials to source control.

PowerShell example (keep this terminal open):

```powershell
$env:MONGODB_URI = "mongodb://localhost:27017/sentinelos"
$env:JWT_SECRET = "replace-this-with-a-random-secret-of-at-least-32-bytes"
$env:APP_ADMIN_EMAIL = "admin@example.com"
$env:APP_ADMIN_PASSWORD = "use-a-private-password-of-at-least-12-characters"
```

For MongoDB Atlas, set `MONGODB_URI` to your Atlas connection string instead. When both admin variables are set, the backend creates or promotes that account to `ADMIN` on startup. Keep the password private; it must be at least 12 characters. Admins can assign operational roles to accounts from the dashboard. Public registration offers only citizen and volunteer roles.

### 2. Start the backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The API listens on `http://localhost:8081`. The frontend calls that URL by default. To use another API address, create `frontend/.env.local` with:

```text
VITE_API_URL=http://localhost:8081/api
```

### 3. Start the frontend in a second terminal

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). Register a citizen or volunteer account and sign in using its email and password. The seeded administrator can use the User Access panel to assign hospital, rescue team, NGO, or admin roles.

## Main API routes

Routes are rooted at `http://localhost:8081/api`.

| Area | Routes present in the backend |
| --- | --- |
| Authentication | `POST /auth/register`, `POST /auth/login` |
| Emergencies | `POST /emergency/report`, `GET /emergency/{id}`, `GET /emergency/all`, `GET /emergency/user/my-reports`, status and priority routes |
| Hospitals | See `HospitalController` and `HospitalOperationsDashboardController` |
| Volunteer tasks | See `VolunteerTaskController` |
| Rescue missions | See `RescueMissionController` |
| Admin data | `GET /admin/dashboard/stats`, `/users`, `/volunteers`, `/supplies`, `/ai/metrics`, `/health`; `PUT /admin/dashboard/users/{id}/role` |

For request and response details, see [Complete API Documentation](docs/COMPLETE_API_DOCUMENTATION.md). Some older docs may describe endpoints that have changed; confirm routes against the controller source.

## Security and deployment notes

- Set `JWT_SECRET` and `MONGODB_URI` through your environment or deployment secret manager.
- Change the current permissive CORS configuration and review endpoint authorization before exposing the API publicly.
- Do not put real patient or emergency data into this prototype.
- The system has not been validated for production, high availability, throughput, or clinical use.

## Project docs

- [Quick Start](docs/QUICK_START.md)
- [Complete API Documentation](docs/COMPLETE_API_DOCUMENTATION.md)
- [Test Cases and Flows](docs/TEST_CASES_AND_FLOWS.md)
- [Frontend Setup Guide](docs/FRONTEND_SETUP_GUIDE.md)
- [Folder Reorganization Guide](docs/FOLDER_REORGANIZATION_GUIDE.md)

## License

No license file is currently included. Add a `LICENSE` file before describing the repository as open source under a specific license.
