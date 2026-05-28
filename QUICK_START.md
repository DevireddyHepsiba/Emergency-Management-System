# 🚀 QUICK START - Get Your App Running in 5 Minutes

## ⚡ Ultra-Quick Setup

### **1. Start Backend (Terminal 1)**
```bash
cd c:\Users\hepsi\OneDrive\Desktop\sentinelos
mvn spring-boot:run
```
Wait for: `Started SentinelosApplication in X seconds`

### **2. Start Frontend (Terminal 2)**
```bash
cd c:\Users\hepsi\OneDrive\Desktop\sentinelos\crisis\frontend
npm install
npm run dev
```
Open browser: `http://localhost:5173`

---

## 🎯 Test the App

1. **Click "Register here"** on login page
2. **Fill form:**
   - Full Name: Your Name
   - Username: testuser
   - Email: test@example.com
   - Mobile: 9876543210
   - Role: Volunteer
   - Password: Password123

3. **Login with credentials**
4. **Try features:**
   - 📊 Dashboard - See stats
   - 🆘 Report Emergency - Submit SOS
   - 🏥 Hospitals - Find nearest
   - 👥 Volunteer Tasks - View tasks
   - 🚑 Rescue Missions - Coordinate

---

## 📤 Push to GitHub

### **Step 1: Create GitHub Account & Repository**
1. Go to github.com
2. Sign up or login
3. Create new repository: `sentinelos`
4. Copy repository URL

### **Step 2: Configure Git**
```bash
cd c:\Users\hepsi\OneDrive\Desktop\sentinelos

git config --global user.name "Your Full Name"
git config --global user.email "your.email@gmail.com"
```

### **Step 3: Push Code**
```bash
git add .
git commit -m "Initial commit: Complete Emergency Management System with Spring AI and React"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/sentinelos.git
git push -u origin main
```

**Replace `YOUR-USERNAME` with your GitHub username!**

---

## ✅ Verification Checklist

- [ ] Backend running without errors
- [ ] Frontend accessible at http://localhost:5173
- [ ] Can register new account
- [ ] Can login successfully
- [ ] Dashboard loads with stats
- [ ] Can report emergency with location
- [ ] Hospital list loads
- [ ] Volunteer tasks visible
- [ ] Code pushed to GitHub

---

## 🆘 Troubleshooting

### **Backend won't start:**
```bash
# Check if port 8080 is in use
netstat -ano | findstr :8080
# If in use, kill the process
taskkill /PID <PID> /F
```

### **Frontend shows blank page:**
1. Clear browser cache: `Ctrl+Shift+Delete`
2. Hard refresh: `Ctrl+Shift+R`
3. Check `.env.local` has correct API URL

### **Git push fails:**
```bash
# Verify remote is correct
git remote -v

# Re-add if needed
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/sentinelos.git
```

### **API not connecting:**
1. Verify backend is running: `http://localhost:8080/api/status`
2. Check CORS headers in browser DevTools (F12 → Network)
3. Ensure port 8080 is accessible

---

## 📱 Features to Show

**For Portfolio:**
- Report emergency with real GPS coordinates
- See AI classification automatically
- View nearest hospitals (distance calculated)
- Assign volunteers based on skills
- Track rescue mission status
- Real-time dashboard statistics

**For Resume:**
- Full-stack Java/React application
- Spring AI integration (GPT-4-turbo)
- MongoDB cloud database
- JWT authentication with role-based access
- 30+ REST API endpoints
- Responsive TypeScript UI
- Production-ready architecture

---

## 🎓 Interview Talking Points

### **Technical:**
"I built a full-stack emergency management system using Spring Boot with Spring AI integration. The backend processes 30+ REST endpoints with MongoDB, while the React frontend provides real-time updates. I implemented AI-powered duplicate detection and smart volunteer assignment using embeddings."

### **Architecture:**
"The system uses JWT authentication, role-based access control, and follows clean architecture patterns. The frontend is fully typed with TypeScript and uses Vite for optimal development experience."

### **Deployment:**
"The application is cloud-ready with MongoDB Atlas, containerized for Docker deployment, and designed to scale horizontally using microservices (Phase 2)."

---

## 🌟 Next After This

1. **Deploy Frontend:** Vercel/Netlify (free tier)
2. **Deploy Backend:** Azure App Service/Heroku (free tier)
3. **Enable CI/CD:** GitHub Actions
4. **Monitor:** Add logging & alerts
5. **Scale:** Implement microservices

---

**Status: ✅ Ready to Launch**

Your application is fully functional and production-ready!

---

## 📞 Quick Reference Commands

```bash
# Backend
cd sentinelos && mvn spring-boot:run

# Frontend (separate terminal)
cd crisis/frontend && npm run dev

# Git push
git add . && git commit -m "message" && git push

# Build for production
npm run build

# Run tests
mvn test
npm run test
```

---

**Start now! 🎉**

Good luck with your portfolio and interviews!
