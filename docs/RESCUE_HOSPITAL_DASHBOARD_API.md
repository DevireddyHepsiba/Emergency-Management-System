# RESCUE TEAM & HOSPITAL OPERATIONS - Backend API Documentation

## 🚨 RESCUE TEAM DASHBOARD ENDPOINTS

### 1. Get Rescue Team Metrics (Overview)
```
GET http://localhost:8081/api/dashboard/rescue/metrics
```

**Response (200 OK):**
```json
{
  "activeMissions": 42,
  "averageETA": "6.4m",
  "completedToday": 128,
  "unitsAvailable": 312,
  "missions": [
    {
      "id": "6a17d83d700f30f7d9a1ad0a",
      "missionCode": "M-8291",
      "title": "Flash Flood Extraction",
      "location": "Sector G-9 · Bridge St",
      "victims": 12,
      "status": "EN_ROUTE",
      "priority": "CRITICAL",
      "eta": 4,
      "distance": 2.1
    },
    {
      "id": "6a17d83d700f30f7d9a1ad0b",
      "missionCode": "M-8290",
      "title": "Building Collapse Search",
      "location": "Sector B-2 · 14th Ave",
      "victims": 5,
      "status": "ASSIGNED",
      "priority": "CRITICAL",
      "eta": 9,
      "distance": 3.2
    },
    {
      "id": "6a17d83d700f30f7d9a1ad0c",
      "missionCode": "M-8278",
      "title": "Wildfire Perimeter",
      "location": "North Ridge · Sector R-4",
      "victims": 0,
      "status": "REACHED",
      "priority": "CRITICAL",
      "eta": null,
      "distance": 5.8
    }
  ]
}
```

---

### 2. Get Missions by Status
```
GET http://localhost:8081/api/dashboard/rescue/missions/status/EN_ROUTE
```

**Possible Statuses:**
- `ASSIGNED` - Newly assigned
- `EN_ROUTE` - Team on the way
- `REACHED` - Team at location
- `IN_PROGRESS` - Active rescue
- `COMPLETED` - Mission finished

**Response (200 OK):**
```json
{
  "status": "EN_ROUTE",
  "count": 15,
  "missions": [
    {
      "missionCode": "M-8291",
      "title": "Flash Flood Extraction",
      "eta": 4,
      "victims": 12,
      "distance": 2.1
    }
  ]
}
```

---

### 3. Get Missions by Priority
```
GET http://localhost:8081/api/dashboard/rescue/missions/priority/CRITICAL
```

**Priorities:** `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`

**Response (200 OK):**
```json
{
  "priority": "CRITICAL",
  "count": 22,
  "missions": [...]
}
```

---

### 4. Get All Active Missions
```
GET http://localhost:8081/api/dashboard/rescue/missions/active
```

**Response (200 OK):**
```json
{
  "activeCount": 42,
  "missions": [...]
}
```

---

### 5. Get Rescue Analytics
```
GET http://localhost:8081/api/dashboard/rescue/analytics
```

**Response (200 OK):**
```json
{
  "statusBreakdown": {
    "EN_ROUTE": 15,
    "ASSIGNED": 12,
    "REACHED": 10,
    "COMPLETED": 200
  },
  "typeBreakdown": {
    "FLOOD": 42,
    "FIRE": 28,
    "ACCIDENT": 35,
    "OTHER": 15
  },
  "averageVictims": 8.5
}
```

---

## 🏥 HOSPITAL OPERATIONS DASHBOARD ENDPOINTS

### 1. Get Hospital Metrics (Overview)
```
GET http://localhost:8081/api/dashboard/hospital/metrics/{hospitalId}
```

**Response (200 OK):**
```json
{
  "hospitalName": "Apollo Hospital",
  "availableBeds": 1042,
  "totalBeds": 1500,
  "icuFree": 38,
  "icuTotal": 120,
  "icuOccupancy": 84.0,
  "incomingPatients": 12,
  "incomingTimeframe": "15a",
  "surgeryCapacity": "68%",
  "departmentOccupancy": {
    "Emergency Room": 92.0,
    "ICU": 84.0,
    "Trauma Bay": 76.0,
    "Surgery": 68.0,
    "General Ward": 54.0,
    "Pediatrics": 32.0
  },
  "departments": [
    {
      "id": "dept_001",
      "departmentName": "Emergency Room",
      "beds": 50,
      "occupiedBeds": 46,
      "occupancyPercentage": 92.0,
      "surgeryCapacity": 100
    }
  ]
}
```

---

### 2. Get Department Details
```
GET http://localhost:8081/api/dashboard/hospital/departments/{hospitalId}
```

**Response (200 OK):**
```json
{
  "hospitalId": "hospital_001",
  "totalDepartments": 6,
  "occupancyOverview": {
    "Emergency Room": {
      "occupancy": 92.0,
      "beds": 50,
      "occupied": 46
    },
    "ICU": {
      "occupancy": 84.0,
      "beds": 120,
      "occupied": 101
    },
    "Trauma Bay": {
      "occupancy": 76.0,
      "beds": 30,
      "occupied": 23
    },
    "Surgery": {
      "occupancy": 68.0,
      "beds": 25,
      "occupied": 17
    },
    "General Ward": {
      "occupancy": 54.0,
      "beds": 400,
      "occupied": 216
    },
    "Pediatrics": {
      "occupancy": 32.0,
      "beds": 80,
      "occupied": 26
    }
  }
}
```

---

### 3. Get Incoming Patients
```
GET http://localhost:8081/api/dashboard/hospital/incoming-patients/{hospitalId}
```

**Response (200 OK):**
```json
{
  "incoming": [
    {
      "id": "P-4812",
      "condition": "Trauma — Crush Injury",
      "eta": "2 MIN"
    },
    {
      "id": "P-4811",
      "condition": "Respiratory",
      "eta": "4 MIN"
    },
    {
      "id": "P-4810",
      "condition": "Pediatric Burn",
      "eta": "6 MIN"
    },
    {
      "id": "P-4809",
      "condition": "Cardiac Arrest",
      "eta": "8 MIN"
    },
    {
      "id": "P-4808",
      "condition": "Fracture",
      "eta": "12 MIN"
    }
  ]
}
```

---

### 4. Get Patient Queue (Last 24h)
```
GET http://localhost:8081/api/dashboard/hospital/patient-queue/{hospitalId}
```

**Response (200 OK):**
```json
{
  "queueStats": {
    "TRAUMA": 84,
    "RESP": 52,
    "CARDIAC": 38,
    "BURN": 22,
    "OTHER": 64
  },
  "totalInQueue": 260,
  "timeframe": "Last 24h"
}
```

---

### 5. Get Occupancy Alerts
```
GET http://localhost:8081/api/dashboard/hospital/occupancy-alert/{hospitalId}
```

**Response (200 OK):**
```json
{
  "criticalAlerts": 2,
  "departments": [
    {
      "id": "dept_001",
      "departmentName": "Emergency Room",
      "occupancyPercentage": 92.0,
      "occupiedBeds": 46,
      "beds": 50
    },
    {
      "id": "dept_002",
      "departmentName": "ICU",
      "occupancyPercentage": 84.0,
      "occupiedBeds": 101,
      "beds": 120
    }
  ]
}
```

---

### 6. Get Hospital Analytics
```
GET http://localhost:8081/api/dashboard/hospital/analytics/{hospitalId}
```

**Response (200 OK):**
```json
{
  "patientDistribution": {
    "TRAUMA": 256,
    "RESPIRATORY": 180,
    "CARDIAC": 95,
    "BURNS": 68
  },
  "averageOccupancy": 68.17
}
```

---

## 📊 PAGE LAYOUT MAPPING

### Rescue Missions Page (Picture 1)
Shows:
- **Active Missions**: 42 (from `/api/dashboard/rescue/metrics`)
- **Avg ETA**: 6.4m (calculated from active missions)
- **Completed Today**: 128 (from `/api/dashboard/rescue/metrics`)
- **Units Available**: 312 (system metric)
- **Mission Cards** with status (EN_ROUTE, ASSIGNED, REACHED)
- **ROUTE** button → calls route optimization API
- **UPDATE** button → updates mission status

### Route Map Page (Picture 2)
Shows:
- **Optimized Route** for Mission M-8291
- **ETA**: 4 min
- **Distance**: 2.1 km
- **Traffic-aware routing engaged**
- **Route visualization** (blue dashed line)
- Start point (green), End point (red)

### Hospital Operations Page (Picture 3)
Shows:
- **Available Beds**: 1,042 (from `/api/dashboard/hospital/metrics`)
- **ICU Free**: 38 of 120 (from `/api/dashboard/hospital/metrics`)
- **Incoming**: 12 next 15a (from `/api/dashboard/hospital/incoming-patients`)
- **Surgery Cap**: 68% (from `/api/dashboard/hospital/metrics`)
- **Department Occupancy Bars** (from `/api/dashboard/hospital/departments`)
- **Incoming Patients List** (from `/api/dashboard/hospital/incoming-patients`)
- **Patient Queue Last 24h** (from `/api/dashboard/hospital/patient-queue`)

---

## 🔄 DATA FLOW DIAGRAM

```
Frontend (Rescue Page)
    ↓
GET /api/dashboard/rescue/metrics
    ↓
RescueTeamDashboardController
    ↓
RescueMissionService + RescueMissionRepository
    ↓
MongoDB (rescue_missions collection)
    ↓
Response with metrics & missions data
```

```
Frontend (Hospital Page)
    ↓
GET /api/dashboard/hospital/metrics/{hospitalId}
    ↓
HospitalOperationsDashboardController
    ↓
HospitalDepartmentService + HospitalDepartmentRepository
    ↓
MongoDB (hospital_departments collection)
    ↓
Response with occupancy & patient data
```

---

## ✅ OPTIMIZATION FEATURES

### Performance Optimizations:
1. **Database Indexing** - Queries on status, priority, hospitalId
2. **Stream API** - Efficient data aggregation
3. **Caching Ready** - Can add @Cacheable for frequently accessed data
4. **Lazy Loading** - Only fetch required fields
5. **Pagination Ready** - Can add page/size parameters

### Response Optimization:
- Minimal data in lists (show only essential fields)
- Aggregate metrics at service layer
- Efficient calculations (averages, counts)

---

## 🚀 SAMPLE POSTMAN REQUESTS

### Test 1: Get Rescue Metrics
```bash
curl -X GET http://localhost:8081/api/dashboard/rescue/metrics \
  -H "Content-Type: application/json"
```

### Test 2: Get Hospital Metrics
```bash
curl -X GET http://localhost:8081/api/dashboard/hospital/metrics/hospital_001 \
  -H "Content-Type: application/json"
```

### Test 3: Get Critical Occupancy Alerts
```bash
curl -X GET http://localhost:8081/api/dashboard/hospital/occupancy-alert/hospital_001 \
  -H "Content-Type: application/json"
```

### Test 4: Get Active Rescue Missions
```bash
curl -X GET http://localhost:8081/api/dashboard/rescue/missions/active \
  -H "Content-Type: application/json"
```

---

## ✨ STATUS

### ✅ Backend Complete:
- RescueTeamDashboardController - READY
- HospitalOperationsDashboardController - READY
- All endpoints optimized
- SecurityConfig updated

### ✅ Ready for Frontend Integration:
- All APIs documented
- Response formats standardized
- Real-time data available

---

**Last Updated**: May 28, 2026  
**Status**: PRODUCTION READY ✅

