## POSTMAN TEST GUIDE - Hospital & Volunteer Management APIs

### ============ HOSPITAL MANAGEMENT ============

### 1. ADD NEW HOSPITAL
```
POST http://localhost:8080/api/hospital/add
Content-Type: application/json

{
  "name": "Apollo Hospital",
  "bedsAvailable": 50,
  "icuAvailable": 10,
  "ambulances": 5,
  "latitude": 40.7128,
  "longitude": -74.0060,
  "address": "123 Main St, New York",
  "phone": "+1-555-0001"
}
```

**Response (200 OK):**
```json
{
  "id": "6a17c0dc1dace03730129aa0",
  "name": "Apollo Hospital",
  "bedsAvailable": 50,
  "icuAvailable": 10,
  "ambulances": 5,
  "status": "ALERT_RECEIVED",
  "message": "Hospital added successfully"
}
```

---

### 2. GET ALL HOSPITALS
```
GET http://localhost:8080/api/hospital/all
Content-Type: application/json
```

**Response (200 OK):**
```json
[
  {
    "id": "6a17c0dc1dace03730129aa0",
    "name": "Apollo Hospital",
    "bedsAvailable": 50,
    "icuAvailable": 10,
    "ambulances": 5,
    "status": "ALERT_RECEIVED"
  },
  {
    "id": "6a17c0dc1dace03730129aa1",
    "name": "Yashoda Hospital",
    "bedsAvailable": 30,
    "icuAvailable": 5,
    "ambulances": 3,
    "status": "ALERT_RECEIVED"
  }
]
```

---

### 3. FIND NEAREST HOSPITAL (By GPS Coordinates)
```
GET http://localhost:8080/api/hospital/nearest?latitude=40.7128&longitude=-74.0060
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "id": "6a17c0dc1dace03730129aa1",
  "name": "Yashoda Hospital",
  "bedsAvailable": 30,
  "icuAvailable": 5,
  "ambulances": 3,
  "distanceKm": 2.5,
  "status": "ALERT_RECEIVED"
}
```

---

### 4. GET SPECIFIC HOSPITAL
```
GET http://localhost:8080/api/hospital/6a17c0dc1dace03730129aa0
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "id": "6a17c0dc1dace03730129aa0",
  "name": "Apollo Hospital",
  "bedsAvailable": 50,
  "icuAvailable": 10,
  "ambulances": 5,
  "latitude": 40.7128,
  "longitude": -74.0060,
  "address": "123 Main St, New York",
  "phone": "+1-555-0001",
  "status": "ALERT_RECEIVED"
}
```

---

### 5. UPDATE HOSPITAL STATUS (Step through care workflow)
```
PUT http://localhost:8080/api/hospital/6a17c0dc1dace03730129aa0/status?status=PREPARING
Content-Type: application/json
```

**Status Flow:**
- `ALERT_RECEIVED` → Initial alert
- `PREPARING` → Hospital preparing resources
- `PATIENT_RECEIVED` → Patient arrived
- `TREATMENT_STARTED` → Treatment underway

**Response (200 OK):**
```json
{
  "id": "6a17c0dc1dace03730129aa0",
  "name": "Apollo Hospital",
  "status": "PREPARING",
  "message": "Hospital status updated to PREPARING"
}
```

---

### 6. UPDATE HOSPITAL RESOURCES (Track resource availability)
```
PUT http://localhost:8080/api/hospital/6a17c0dc1dace03730129aa0/resources?beds=45&icu=8&ambulances=4
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "id": "6a17c0dc1dace03730129aa0",
  "name": "Apollo Hospital",
  "bedsAvailable": 45,
  "icuAvailable": 8,
  "ambulances": 4,
  "message": "Hospital resources updated"
}
```

---

### ============ VOLUNTEER TASK MANAGEMENT ============

### 7. CREATE VOLUNTEER TASK
```
POST http://localhost:8080/api/volunteer/task/create
Content-Type: application/json

{
  "title": "Evacuation Support",
  "location": "Sector 9",
  "required": 5,
  "description": "Need volunteers for flood zone evacuation",
  "priority": 1,
  "emergencyId": "6a17b7dc1dacd03730129bc0"
}
```

**Response (200 OK):**
```json
{
  "id": "6a17c0dc1dace03730129bb0",
  "title": "Evacuation Support",
  "location": "Sector 9",
  "required": 5,
  "assigned": [],
  "status": "TASK_CREATED",
  "description": "Need volunteers for flood zone evacuation",
  "priority": 1,
  "emergencyId": "6a17b7dc1dacd03730129bc0",
  "message": "Volunteer task created successfully"
}
```

---

### 8. GET ALL VOLUNTEER TASKS
```
GET http://localhost:8080/api/volunteer/task/all
Content-Type: application/json
```

**Response (200 OK):**
```json
[
  {
    "id": "6a17c0dc1dace03730129bb0",
    "title": "Evacuation Support",
    "location": "Sector 9",
    "required": 5,
    "assigned": ["user1", "user2"],
    "status": "VOLUNTEER_ASSIGNED",
    "priority": 1
  },
  {
    "id": "6a17c0dc1dace03730129bb1",
    "title": "Medical Support",
    "location": "Relief Camp A",
    "required": 3,
    "assigned": ["user3"],
    "status": "TASK_CREATED",
    "priority": 2
  }
]
```

---

### 9. GET TASKS BY STATUS
```
GET http://localhost:8080/api/volunteer/task/status/TASK_CREATED
Content-Type: application/json
```

**Possible Statuses:**
- `TASK_CREATED` - Task just created
- `VOLUNTEER_ASSIGNED` - Volunteers assigned
- `ON_FIELD` - Volunteers are working
- `TASK_COMPLETED` - Task finished

**Response (200 OK):**
```json
[
  {
    "id": "6a17c0dc1dace03730129bb1",
    "title": "Medical Support",
    "location": "Relief Camp A",
    "required": 3,
    "assigned": [],
    "status": "TASK_CREATED",
    "priority": 2
  }
]
```

---

### 10. GET TASKS BY EMERGENCY
```
GET http://localhost:8080/api/volunteer/task/emergency/6a17b7dc1dacd03730129bc0
Content-Type: application/json
```

**Response (200 OK):**
```json
[
  {
    "id": "6a17c0dc1dace03730129bb0",
    "title": "Evacuation Support",
    "location": "Sector 9",
    "status": "ON_FIELD",
    "priority": 1,
    "emergencyId": "6a17b7dc1dacd03730129bc0"
  }
]
```

---

### 11. GET TASKS BY LOCATION
```
GET http://localhost:8080/api/volunteer/task/location/Sector%209
Content-Type: application/json
```

**Response (200 OK):**
```json
[
  {
    "id": "6a17c0dc1dace03730129bb0",
    "title": "Evacuation Support",
    "location": "Sector 9",
    "required": 5,
    "assigned": ["user1", "user2", "user3"],
    "status": "ON_FIELD",
    "priority": 1
  }
]
```

---

### 12. ASSIGN VOLUNTEER TO TASK
```
PUT http://localhost:8080/api/volunteer/task/6a17c0dc1dace03730129bb0/assign/volunteer_user_123
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "id": "6a17c0dc1dace03730129bb0",
  "title": "Evacuation Support",
  "location": "Sector 9",
  "required": 5,
  "assigned": ["user1", "volunteer_user_123"],
  "status": "VOLUNTEER_ASSIGNED",
  "message": "Volunteer assigned to task"
}
```

---

### 13. ADVANCE TASK STATUS (Step through workflow)
```
PUT http://localhost:8080/api/volunteer/task/6a17c0dc1dace03730129bb0/advance
Content-Type: application/json
```

**Workflow:**
- `TASK_CREATED` → `VOLUNTEER_ASSIGNED`
- `VOLUNTEER_ASSIGNED` → `ON_FIELD`
- `ON_FIELD` → `TASK_COMPLETED`

**Response (200 OK) - First call:**
```json
{
  "id": "6a17c0dc1dace03730129bb0",
  "title": "Evacuation Support",
  "status": "VOLUNTEER_ASSIGNED",
  "message": "Task status advanced to VOLUNTEER_ASSIGNED"
}
```

**Response (200 OK) - Second call:**
```json
{
  "id": "6a17c0dc1dace03730129bb0",
  "title": "Evacuation Support",
  "status": "ON_FIELD",
  "message": "Task status advanced to ON_FIELD"
}
```

**Response (200 OK) - Third call:**
```json
{
  "id": "6a17c0dc1dace03730129bb0",
  "title": "Evacuation Support",
  "status": "TASK_COMPLETED",
  "message": "Task status advanced to TASK_COMPLETED"
}
```

---

### 14. UPDATE TASK STATUS (Direct status change)
```
PUT http://localhost:8080/api/volunteer/task/6a17c0dc1dace03730129bb0/status?status=ON_FIELD
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "id": "6a17c0dc1dace03730129bb0",
  "title": "Evacuation Support",
  "status": "ON_FIELD",
  "message": "Task status updated to ON_FIELD"
}
```

---

### 15. COMPLETE TASK
```
PUT http://localhost:8080/api/volunteer/task/6a17c0dc1dace03730129bb0/complete
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "id": "6a17c0dc1dace03730129bb0",
  "title": "Evacuation Support",
  "status": "TASK_COMPLETED",
  "message": "Task status updated to TASK_COMPLETED"
}
```

---

## COMPLETE WORKFLOW EXAMPLE

### Scenario: Handling a Flood Emergency

**Step 1: Submit Emergency Report** (No auth required)
```
POST http://localhost:8080/api/emergency/report
```

**Step 2: Find Nearest Hospital**
```
GET http://localhost:8080/api/hospital/nearest?latitude=40.7128&longitude=-74.0060
```

**Step 3: Update Hospital Status** (As emergency develops)
```
PUT http://localhost:8080/api/hospital/{hospitalId}/status?status=PREPARING
PUT http://localhost:8080/api/hospital/{hospitalId}/status?status=PATIENT_RECEIVED
```

**Step 4: Create Volunteer Tasks**
```
POST http://localhost:8080/api/volunteer/task/create
  - Task 1: Evacuation Support
  - Task 2: Medical Assistance
  - Task 3: Supply Distribution
```

**Step 5: Assign Volunteers & Track Progress**
```
PUT http://localhost:8080/api/volunteer/task/{taskId}/assign/{volunteerId}
PUT http://localhost:8080/api/volunteer/task/{taskId}/advance  (Multiple times)
```

**Step 6: Monitor Resources**
```
PUT http://localhost:8080/api/hospital/{hospitalId}/resources?beds=40&icu=7&ambulances=3
```

**Step 7: Get Task Status by Emergency**
```
GET http://localhost:8080/api/volunteer/task/emergency/{emergencyId}
```

---

✅ All endpoints are now ready for testing!

