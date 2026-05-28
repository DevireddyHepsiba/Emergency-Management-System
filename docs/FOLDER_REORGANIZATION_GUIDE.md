# 🏗️ Project Folder Reorganization Guide

## Current (Messy) Structure ❌

```
sentinelos/
├── backend files scattered everywhere:
│   ├── sentinelos/ (actual backend)
│   ├── config/, controller/, dto/, entity/, etc. (confused root level)
│   ├── service/, util/, security/, exception/
│   ├── repository/, target/
│
├── frontend in subdirectory:
│   └── crisis/frontend/
│
└── Documentation mixed with code:
    ├── README.md
    ├── COMPLETE_API_DOCUMENTATION.md
    ├── TEST_CASES_AND_FLOWS.md
    ├── FRONTEND_SETUP_GUIDE.md
    └── (other docs)
```

**Problem:** 👎
- Backend files scattered in root AND in sentinelos/ subfolder
- Frontend buried deep in crisis/frontend
- Documentation mixed with source code
- Unclear project structure
- Hard to navigate and maintain

---

## Target (Clean) Structure ✅

```
sentinelos/
├── backend/
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── .mvn/
│   ├── .gitignore
│   ├── src/
│   ├── target/
│   ├── .idea/
│   └── HELP.md
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── .env.local
│   ├── tailwind.config.js
│   └── .gitignore
│
├── docs/
│   ├── README.md
│   ├── COMPLETE_API_DOCUMENTATION.md
│   ├── FRONTEND_SETUP_GUIDE.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   ├── TEST_CASES_AND_FLOWS.md
│   ├── QUICK_START.md
│   ├── RESUME_BULLETS_COPY_PASTE.md
│   ├── RESUME_PORTFOLIO_GUIDE.md
│   ├── FRONTEND_COMPONENTS_CHECKLIST.md
│   └── POSTMAN_HOSPITAL_VOLUNTEER_API.md
│
├── .gitignore (root)
├── package-lock.json (from crisis)
└── PROJECT_STRUCTURE.md (this guide)
```

**Benefits:** 👍
- Clear separation: backend/ vs frontend/
- Documentation organized in docs/
- Easy to navigate
- Clear for CI/CD pipelines
- Professional structure
- Easy for team collaboration

---

## 🔄 Reorganization Steps

### **Step 1: Create Folder Structure**

Open PowerShell and navigate to project root:

```powershell
cd C:\Users\hepsi\OneDrive\Desktop\sentinelos

# Create new folders
mkdir backend -Force
mkdir frontend -Force
mkdir docs -Force

echo "Folders created successfully"
```

---

### **Step 2: Move Backend Files**

```powershell
# Copy the entire sentinelos backend to backend/ folder
Copy-Item -Path "sentinelos\*" -Destination "backend\" -Recurse -Force

echo "Backend files copied"
```

---

### **Step 3: Move Frontend Files**

```powershell
# Copy frontend from crisis/frontend to frontend/
Copy-Item -Path "crisis\frontend\*" -Destination "frontend\" -Recurse -Force
Copy-Item -Path "crisis\package-lock.json" -Destination "frontend\" -Force

echo "Frontend files copied"
```

---

### **Step 4: Move Documentation**

```powershell
# Move all markdown documentation to docs/
Move-Item -Path "COMPLETE_API_DOCUMENTATION.md" -Destination "docs\"
Move-Item -Path "FRONTEND_COMPONENTS_CHECKLIST.md" -Destination "docs\"
Move-Item -Path "FRONTEND_SETUP_GUIDE.md" -Destination "docs\"
Move-Item -Path "IMPLEMENTATION_SUMMARY.md" -Destination "docs\"
Move-Item -Path "POSTMAN_HOSPITAL_VOLUNTEER_API.md" -Destination "docs\"
Move-Item -Path "QUICK_START.md" -Destination "docs\"
Move-Item -Path "RESCUE_HOSPITAL_DASHBOARD_API.md" -Destination "docs\"
Move-Item -Path "RESUME_BULLETS_COPY_PASTE.md" -Destination "docs\"
Move-Item -Path "RESUME_PORTFOLIO_GUIDE.md" -Destination "docs\"
Move-Item -Path "TEST_CASES_AND_FLOWS.md" -Destination "docs\"

echo "Documentation moved to docs/"
```

---

### **Step 5: Clean Up Old Folders**

```powershell
# Remove old scattered backend folders (keep backup first!)
# IMPORTANT: These should now be in backend/ folder

Remove-Item -Path "config" -Recurse -Force
Remove-Item -Path "controller" -Recurse -Force
Remove-Item -Path "dto" -Recurse -Force
Remove-Item -Path "entity" -Recurse -Force
Remove-Item -Path "exception" -Recurse -Force
Remove-Item -Path "repository" -Recurse -Force
Remove-Item -Path "security" -Recurse -Force
Remove-Item -Path "service" -Recurse -Force
Remove-Item -Path "util" -Recurse -Force
Remove-Item -Path "target" -Recurse -Force

# Remove old sentinelos subfolder (now in backend/)
Remove-Item -Path "sentinelos" -Recurse -Force

# Remove old crisis folder (now in frontend/)
Remove-Item -Path "crisis" -Recurse -Force

echo "Old folders cleaned up"
```

---

### **Step 6: Create Root-level README**

```powershell
# Create a new root README pointing to backend/frontend
# Content shown below
```

---

### **Step 7: Update .gitignore**

```powershell
# Create comprehensive .gitignore at root
# Content shown below
```

---

### **Step 8: Verify New Structure**

```powershell
# List the new clean structure
Get-ChildItem -Path "." -Directory | ForEach-Object { Write-Host "📁 $_" }
Get-ChildItem -Path ".\backend\" -Directory | ForEach-Object { Write-Host "  📁 backend\$_" }
Get-ChildItem -Path ".\frontend\" -Directory | ForEach-Object { Write-Host "  📁 frontend\$_" }
Get-ChildItem -Path ".\docs\" -Directory | ForEach-Object { Write-Host "  📁 docs\$_" }
```

---

### **Step 9: Git Commit**

```powershell
git add .
git commit -m "Reorganize project structure: separate backend and frontend into dedicated folders"
git push -u origin main
```

---

## 📝 New Root-level README

Create: `c:\Users\hepsi\OneDrive\Desktop\sentinelos\README.md`

```markdown
# 🚑 Sentinelos - Emergency Management System

Complete full-stack application for hospital emergency response coordination.

## 📁 Project Structure

```
sentinelos/
├── backend/          # Spring Boot Java backend (REST APIs)
├── frontend/         # React TypeScript UI (Vite)
├── docs/            # Complete documentation
└── README.md        # This file
```

## 🚀 Quick Start

### Backend
```bash
cd backend
mvn spring-boot:run
```
Backend runs at: `http://localhost:8080`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

## 📖 Documentation

- [Setup Guide](docs/FRONTEND_SETUP_GUIDE.md)
- [API Documentation](docs/COMPLETE_API_DOCUMENTATION.md)
- [Test Cases](docs/TEST_CASES_AND_FLOWS.md)
- [Implementation Summary](docs/IMPLEMENTATION_SUMMARY.md)

## 🏗️ Architecture

- **Backend:** Spring Boot 4.0.6, Spring Security, Spring AI, MongoDB
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Radix UI
- **Database:** MongoDB Atlas (Cloud)
- **AI:** OpenAI GPT-4-turbo, Embeddings API

## ✨ Features

✅ Emergency Reporting with GPS
✅ AI-powered Classification & Duplicate Detection
✅ Hospital Resource Management
✅ Volunteer Task Coordination
✅ Real-time Dashboard
✅ Smart Volunteer Assignment

## 📚 More Info

See [docs/](docs/) folder for detailed documentation.
```

---

## 📋 New Root-level .gitignore

Create: `c:\Users\hepsi\OneDrive\Desktop\sentinelos\.gitignore`

```
# Frontend
frontend/node_modules/
frontend/dist/
frontend/.env.local
frontend/.env
frontend/npm-debug.log

# Backend
backend/target/
backend/.mvn/
backend/.idea/
backend/*.class
backend/*.jar
backend/app.log
backend/app_error.log

# IDE
.idea/
.vscode/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
.qodo/

# Environment
.env
.env.local

# Logs
logs/
*.log

# Misc
.gitattributes
```

---

## ✅ Before & After Comparison

### BEFORE ❌
```
sentinelos/
├── sentinelos/
├── crisis/frontend/
├── config/
├── controller/
├── dto/
├── entity/
├── ... (10+ scattered folders)
├── README.md
├── COMPLETE_API_DOCUMENTATION.md
├── TEST_CASES_AND_FLOWS.md
└── ... (more docs scattered)
```

**Problems:**
- 15+ top-level items
- Unclear what's backend/frontend
- Docs mixed with code
- Hard to understand structure

---

### AFTER ✅
```
sentinelos/
├── backend/
├── frontend/
├── docs/
├── .gitignore
└── README.md
```

**Benefits:**
- Only 5 top-level items
- Crystal clear organization
- Easy to navigate
- Professional structure
- Ready for production

---

## 🔧 Complete One-Command Reorganization

If you want to do it all at once, save this as `reorganize.ps1` and run it:

```powershell
# Save as: reorganize.ps1
# Run with: .\reorganize.ps1

Write-Host "🔄 Starting Sentinelos project reorganization..." -ForegroundColor Green

# Step 1: Create folders
Write-Host "📁 Creating folder structure..."
mkdir backend -Force | Out-Null
mkdir frontend -Force | Out-Null
mkdir docs -Force | Out-Null

# Step 2: Copy backend
Write-Host "📦 Copying backend files..."
Copy-Item -Path "sentinelos\*" -Destination "backend\" -Recurse -Force -ErrorAction SilentlyContinue

# Step 3: Copy frontend
Write-Host "📦 Copying frontend files..."
Copy-Item -Path "crisis\frontend\*" -Destination "frontend\" -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item -Path "crisis\package-lock.json" -Destination "frontend\" -Force -ErrorAction SilentlyContinue

# Step 4: Move docs
Write-Host "📚 Moving documentation..."
$docs = @(
    "COMPLETE_API_DOCUMENTATION.md",
    "FRONTEND_COMPONENTS_CHECKLIST.md",
    "FRONTEND_SETUP_GUIDE.md",
    "IMPLEMENTATION_SUMMARY.md",
    "POSTMAN_HOSPITAL_VOLUNTEER_API.md",
    "QUICK_START.md",
    "RESCUE_HOSPITAL_DASHBOARD_API.md",
    "RESUME_BULLETS_COPY_PASTE.md",
    "RESUME_PORTFOLIO_GUIDE.md",
    "TEST_CASES_AND_FLOWS.md"
)

$docs | ForEach-Object {
    if (Test-Path $_) {
        Move-Item -Path $_ -Destination "docs\" -Force -ErrorAction SilentlyContinue
    }
}

# Step 5: Clean old folders
Write-Host "🗑️  Cleaning up old folders..."
$oldFolders = @(
    "config", "controller", "dto", "entity", "exception",
    "repository", "security", "service", "util", "target",
    "sentinelos", "crisis"
)

$oldFolders | ForEach-Object {
    if (Test-Path $_) {
        Remove-Item -Path $_ -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  ✓ Removed $_"
    }
}

Write-Host ""
Write-Host "✅ Reorganization complete!" -ForegroundColor Green
Write-Host ""
Write-Host "New structure:" -ForegroundColor Cyan
Write-Host "  📁 backend/" -ForegroundColor Yellow
Write-Host "  📁 frontend/" -ForegroundColor Yellow
Write-Host "  📁 docs/" -ForegroundColor Yellow
Write-Host ""
```

Save as: `c:\Users\hepsi\OneDrive\Desktop\sentinelos\reorganize.ps1`

Run it:
```powershell
cd c:\Users\hepsi\OneDrive\Desktop\sentinelos
.\reorganize.ps1
```

---

## 📱 After Reorganization: Running the App

### **Terminal 1 - Backend**
```powershell
cd C:\Users\hepsi\OneDrive\Desktop\sentinelos\backend
mvn spring-boot:run
```

### **Terminal 2 - Frontend**
```powershell
cd C:\Users\hepsi\OneDrive\Desktop\sentinelos\frontend
npm run dev
```

### **Access**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080/api`

---

## 🎯 Project Clarity Checklist

After reorganization, verify:

- ✅ `backend/` contains: pom.xml, src/, target/, mvnw
- ✅ `frontend/` contains: src/, package.json, vite.config.ts
- ✅ `docs/` contains: All markdown files
- ✅ Root level has: README.md, .gitignore
- ✅ Backend runs from `backend/` folder: `mvn spring-boot:run`
- ✅ Frontend runs from `frontend/` folder: `npm run dev`
- ✅ Git push shows clean folder structure
- ✅ No scattered backend folders at root level
- ✅ No frontend buried in subdirectories

---

## 🚀 Next Steps

1. Run reorganization script
2. Verify new structure
3. Test backend: `mvn spring-boot:run`
4. Test frontend: `npm run dev`
5. Commit: `git add . && git commit -m "Clean project structure"`
6. Push: `git push`

**Status:** Crystal Clear Organization ✅

---

**Last Updated:** May 28, 2026
