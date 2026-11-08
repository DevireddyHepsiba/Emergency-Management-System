# Sentinelos microservices migration status

## Current state

The repository now includes a Maven reactor for domain services and a Spring Cloud Gateway. The frontend uses the gateway on port 8080; the existing Spring Boot API stays on 8081 as a fallback for APIs not yet migrated. Domain services are independently packaged, but they still share MongoDB and retain copied user records/repositories for authorization and cross-domain reads. This is an incremental migration, not yet database-isolated microservices.

The repository already has local uncommitted changes. This migration is designed to be additive and must not reset or overwrite those changes.

## Target service boundaries

| Service | Owns | Data it owns |
| --- | --- | --- |
| API Gateway | Public HTTP entry point and routing | None |
| Identity | Registration, login, users, roles, JWT signing | Users |
| Emergency | Emergency reports, triage, report status/history | Emergencies and status events |
| Hospital | Hospital directory, departments, beds, ambulance fleet | Hospitals, departments, ambulances |
| Dispatch | Recommendations, response offers, rescue missions | Missions and dispatch decisions |
| Volunteer | Volunteer task creation, assignment, and status | Volunteers and tasks |
| Admin / reporting | Cross-service dashboard aggregation | Read models only; no writes to other services' data |

Each service owns its MongoDB database and its own Java request/response types. Services exchange IDs and JSON APIs; they do not import one another's persistence entities or repositories. The frontend calls only the gateway.

## Dependency map from the current code

- `AuthService`, `UserRepository`, and the JWT code belong to Identity.
- `EmergencyController`, `EmergencyService`, emergency entities, duplicate detection, and classification belong to Emergency.
- `HospitalController`, `HospitalOperationsDashboardController`, hospital department code, and ambulance fleet code belong to Hospital.
- `RescueMissionController`, `RescueMissionService`, and resource matching belong to Dispatch. Dispatch queries Emergency and Hospital through APIs rather than Mongo repositories.
- `VolunteerTaskController` and volunteer task/assignment code belong to Volunteer.
- `AdminDashboardController` currently reads multiple repositories directly. It must become an API aggregator or reporting read model; it must not keep direct database access after extraction.

## Migration order

1. **Identity contract:** issue JWTs containing `sub`, `role`, and, when applicable, `hospitalId`; validate those claims consistently in each service. The current JWT contains only an email, while authorization currently reads the shared users collection. Extracting any protected API before this is resolved would either break authorization or keep a hidden dependency on Identity's database.
2. **Create the gateway and local service runtime:** route the existing frontend API paths through one local gateway. Keep the existing API as a fallback during the strangler migration.
3. **Extract Hospital:** move hospital, department, and ambulance endpoints and persistence into Hospital with its own database. Preserve endpoint paths at the gateway so the frontend does not need a broad rewrite.
4. **Extract Volunteer:** move volunteer task persistence and APIs; replace direct references to emergencies with IDs and API lookups where required.
5. **Extract Emergency:** move report persistence and triage; publish status changes for downstream coordination.
6. **Extract Dispatch:** move matching and missions. Call Emergency and Hospital APIs for current state; later use events/read models where request-time calls become too coupled.
7. **Move dashboard aggregation and remove the legacy backend** only after endpoint ownership and data migration are complete.

## Important implementation constraints

- Do not point multiple services at the same MongoDB database and claim they own separate data. During a migration, legacy reads may remain temporarily, but writes should have one owner and a documented cutover.
- Do not put a MongoDB URI or JWT signing secret in source-controlled configuration. Supply `MONGODB_URI` and `JWT_SECRET` through the environment or a secret manager. Credentials previously committed or pasted into project files should be rotated, even after removing them from active configuration.
- The current dashboard includes placeholder patient queue values. Moving those endpoints into a service does not make those figures live operational data.
- This is a coordination prototype, not a validated emergency dispatch or patient-care system.

## Local ports (target)

| Component | Port |
| --- | ---: |
| API Gateway | 8080 |
| Auth | 8082 |
| Emergency | 8083 |
| Hospital | 8084 |
| Dispatch | 8085 |
| Volunteer | 8086 |
| AI scaffold | 8087 |
| Legacy API | 8081 |

The existing monolith currently uses port 8081, so it must be moved to a temporary legacy port when Identity takes 8081. Do this as part of the gateway/runtime change, not as an isolated port edit.

## Completion criteria

The conversion is complete when every domain has a separately runnable service, each service has exclusive write ownership of its database, the gateway routes the frontend's API paths, service-to-service calls use API contracts rather than shared repositories, authentication works without cross-service database reads, and the legacy API can be removed without losing an endpoint.
