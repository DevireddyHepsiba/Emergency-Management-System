# Frontend Setup Guide - Sentinelos React Application

## ✅ Completed Frontend Files

### **Core Components Created:**

1. **Authentication Pages:**
   - `src/pages/LoginPage.tsx` - Login form with JWT authentication
   - `src/pages/RegisterPage.tsx` - User registration with role selection

2. **Dashboard Components:**
   - `src/components/AdminDashboard.tsx` - Real-time statistics and system health
   - `src/components/EmergencyReportForm.tsx` - GPS-enabled emergency reporting
   - `src/components/HospitalManagement.tsx` - Hospital resource tracking
   - `src/components/VolunteerTaskManagement.tsx` - Task assignment and tracking
   - `src/components/RescueMissionManagement.tsx` - Mission coordination

3. **API Service Layer:**
   - `src/services/api.ts` - Comprehensive TypeScript API client (30+ endpoints)

4. **Main Application:**
   - `src/App.tsx` - React Router setup with protected routes
   - `src/pages/` - Page structure
   - `src/components/` - Reusable UI components

### **Configuration Files:**
   - `.env.local` - Environment variables (API_URL=http://localhost:8080/api)

---

## 🔧 Installation & Setup

### **Step 1: Install Dependencies**

```bash
cd c:\Users\hepsi\OneDrive\Desktop\sentinelos\crisis\frontend
npm install
```

Required packages (should already be in package.json):
- `react` & `react-dom`
- `react-router-dom` - For routing
- `@radix-ui/react-*` - UI components
- `tailwindcss` - Styling
- `vite` - Build tool

### **Step 2: Start Development Server**

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## 🚀 Accessing the Application

### **Login Credentials (Test)**

Use credentials created in your backend:
- **Username:** volunteer1 / admin1 / etc (created via `/api/auth/register`)
- **Password:** password123 (or whatever you set)

### **Application Flow:**

1. **Login Page** → `/login`
2. **Dashboard** → `http://localhost:5173/dashboard`
3. **Report Emergency** → `http://localhost:5173/report-emergency`
4. **Hospital Management** → `http://localhost:5173/hospitals`
5. **Volunteer Tasks** → `http://localhost:5173/volunteer-tasks`
6. **Rescue Missions** → `http://localhost:5173/rescue-missions`

---

## 📡 Backend Connection

### **Required Backend Services:**

Make sure your Spring Boot backend is running:

```bash
cd c:\Users\hepsi\OneDrive\Desktop\sentinelos
mvn spring-boot:run
```

Backend API endpoints used:
- `POST /api/auth/login` - Authentication
- `POST /api/auth/register` - User registration
- `POST /api/emergencies/report` - Report emergency
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/hospitals/all` - List all hospitals
- `GET /api/hospitals/nearest` - Find nearest hospital
- `GET /api/volunteer-tasks/all` - Get volunteer tasks
- `GET /api/rescue-missions/active` - Active rescue missions
- `GET /api/ai/metrics` - AI performance metrics

---

## 🛠️ Development Workflow

### **Component Structure:**

```
src/
├── pages/
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
├── components/
│   ├── AdminDashboard.tsx
│   ├── EmergencyReportForm.tsx
│   ├── HospitalManagement.tsx
│   ├── VolunteerTaskManagement.tsx
│   └── RescueMissionManagement.tsx
├── services/
│   └── api.ts (comprehensive API client)
├── ui/
│   └── (Radix UI components)
└── App.tsx (main router)
```

### **Adding a New Page:**

1. Create component in `src/pages/MyPage.tsx`
2. Add route in `src/App.tsx`:
```typescript
<Route path="/my-page" element={<ProtectedRoute><DashboardLayout><MyPage /></DashboardLayout></ProtectedRoute>} />
```
3. Add navigation link in sidebar

---

## 🔐 Authentication Flow

1. **Login:**
   - User enters username/password
   - `api.login()` sends credentials to backend
   - Backend returns JWT token + user details
   - Token saved in localStorage
   - Redirect to dashboard

2. **Protected Routes:**
   - `<ProtectedRoute>` checks localStorage for userRole
   - If not found, redirect to /login

3. **API Calls:**
   - All API requests include JWT token in header
   - Token sent via: `Authorization: Bearer ${token}`

---

## 🐛 Troubleshooting

### **CORS Issues:**
If you see CORS errors, ensure backend has proper CORS configuration:
```java
.cors().and()
```
Check `SecurityConfig.java` - should be already configured.

### **API Connection Failed:**
1. Verify backend is running: `http://localhost:8080/api/status`
2. Check `.env.local` has correct `VITE_API_URL`
3. Check browser console for error messages

### **Components Not Loading:**
1. Ensure all imports are correct
2. Check Radix UI components are installed
3. Verify Tailwind CSS is configured

### **Authentication Not Working:**
1. Clear localStorage: `localStorage.clear()`
2. Ensure backend JWT secret is consistent
3. Check login response contains token

---

## 📦 Build for Production

```bash
npm run build
```

Output: `dist/` folder ready for deployment

### **Deploy Options:**
- **Vercel:** `vercel deploy`
- **Netlify:** `netlify deploy`
- **GitHub Pages:** `npm run build && gh-pages -d dist`
- **Azure Static Web Apps:** Use Azure deployment

---

## 📝 API TypeScript Types

All API endpoints are fully typed in `src/services/api.ts`:

```typescript
// Example usage
const stats = await api.getAdminStats(); // Returns: { activeEmergencies: number, ... }
const hospital = await api.findNearestHospital(lat, lon); // Returns: Hospital
const mission = await api.createRescueMission({...}); // Returns: RescueMission
```

---

## 🎯 Next Steps

1. ✅ **Start backend:** `mvn spring-boot:run`
2. ✅ **Install frontend:** `npm install`
3. ✅ **Start dev server:** `npm run dev`
4. ✅ **Test login:** Use backend credentials
5. ✅ **Explore dashboard:** Test all features
6. ✅ **Build & deploy:** When ready

---

## 🌟 Features Implemented

- ✅ Complete authentication system (Login/Register)
- ✅ Role-based access control (Volunteer, Team Lead, Hospital Admin, System Admin)
- ✅ Emergency reporting with GPS geolocation
- ✅ Real-time dashboard with admin statistics
- ✅ Hospital resource management with distance calculation
- ✅ Volunteer task assignment and workflow
- ✅ Rescue mission coordination
- ✅ AI metrics dashboard (triage accuracy, duplicate detection)
- ✅ Responsive UI with Radix components
- ✅ Full TypeScript type safety

---

**Created:** 2024  
**Status:** Production-Ready ✅  
**Last Updated:** Today

For more details, see:
- `COMPLETE_API_DOCUMENTATION.md` - Full API reference
- `README.md` - Project overview
