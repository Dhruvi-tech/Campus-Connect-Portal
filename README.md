<div align="center">

<!-- Local SVG Animated Institutional Showcase Banner -->
<img src="./assets/banner.svg" alt="Campus Connect Portal Banner" width="100%" />

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=16&duration=3000&pause=1000&color=10B981&center=true&vCenter=true&width=550&height=32&lines=Modern+Full-Stack+Campus+Operating+System;Next-Gen+Role-Adaptive+Academic+Workspaces;High-Throughput+RESTful+Express+API+Pipeline" height="32" alt="Typing SVG" />
</p>

<p align="center">
  <a href="https://github.com/Dhruvi-tech/Campus-Connect-Portal"><img src="https://img.shields.io/badge/Course-CS3301%20Full%20Stack-07182f?style=flat-square&logo=bookstack&logoColor=86efac" alt="Course" /></a>
  <a href="https://github.com/Dhruvi-tech"><img src="https://img.shields.io/badge/Architect-Dhruvi%20Mittal-0d5c3a?style=flat-square&logo=github&logoColor=white" alt="Architect" /></a>
  <a href="https://rvu.edu.in"><img src="https://img.shields.io/badge/Institution-RV%20University-a61c1c?style=flat-square&logo=google-classroom&logoColor=white" alt="Institution" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19.2-06B6D4?style=flat-square&logo=react&logoColor=white" alt="React" /></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express-4.21-10B981?style=flat-square&logo=express&logoColor=white" alt="Express" /></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-24.x-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node" /></a>
</p>

<!-- Navigation Bar -->
<p align="center">
  <a href="#-live-portal-showcase"><b>Showcase</b></a> &nbsp;•&nbsp;
  <a href="#-role-workspaces--visual-walkthrough"><b>Workspaces</b></a> &nbsp;•&nbsp;
  <a href="#-system-architecture"><b>Architecture</b></a> &nbsp;•&nbsp;
  <a href="#-rest-api-endpoints"><b>REST API</b></a> &nbsp;•&nbsp;
  <a href="#-quickstart"><b>Quickstart</b></a> &nbsp;•&nbsp;
  <a href="#-author"><b>Author</b></a>
</p>

</div>

---

### 🌟 Live Portal Showcase

<div align="center">
  <img src="./assets/showcase/hero_carousel.png" alt="Campus Connect Hero & Carousel" width="100%" style="border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.35);" />
  <p><i>Institutional Landing View • Interactive Campus Carousel Slider • Role Jump Navigation</i></p>
</div>

---

### 📸 Role Workspaces & Visual Walkthrough

#### 1. Role Selection Grid & Authentication Suite

<table>
  <tr>
    <td width="50%" align="center">
      <b>🎭 Modular Role Selection</b><br/><br/>
      <img src="./assets/showcase/role_portals.png" alt="Role Selection Grid" width="100%" style="border-radius: 8px;" /><br/>
      <sub>Interactive role selection for Student, Faculty & Admin personas</sub>
    </td>
    <td width="50%" align="center">
      <b>🔐 Student Auth & Registration</b><br/><br/>
      <img src="./assets/showcase/auth_module.png" alt="Auth Module" width="100%" style="border-radius: 8px;" /><br/>
      <sub>Instant dual toggle between Student Login & New Registration</sub>
    </td>
  </tr>
</table>

#### 2. Student Portal: Notices & Interactive Modal Dialogs

<table>
  <tr>
    <td width="50%" align="center">
      <b>📢 Campus Circulars & Notice Board</b><br/><br/>
      <img src="./assets/showcase/student_notices.png" alt="Student Notices" width="100%" style="border-radius: 8px;" /><br/>
      <sub>Real-time university announcements with category tags</sub>
    </td>
    <td width="50%" align="center">
      <b>🔍 Circular Detail Modal</b><br/><br/>
      <img src="./assets/showcase/notice_modal.png" alt="Notice Modal Dialog" width="100%" style="border-radius: 8px;" /><br/>
      <sub>Popup dialog displaying detailed bulletin guidelines</sub>
    </td>
  </tr>
</table>

#### 3. Academic Management: Assignments & Live Attendance

<table>
  <tr>
    <td width="50%" align="center">
      <b>📝 Interactive Assignment Workflow</b><br/><br/>
      <img src="./assets/showcase/assignments_tracker.png" alt="Assignments Tracker" width="100%" style="border-radius: 8px;" /><br/>
      <sub>Dynamic task submission cycle with real-time UI state sync</sub>
    </td>
    <td width="50%" align="center">
      <b>📊 Real-Time Attendance Tracker</b><br/><br/>
      <img src="./assets/showcase/attendance_tracker.png" alt="Attendance Tracker" width="100%" style="border-radius: 8px;" /><br/>
      <sub>Live percentage calculator with interactive <code>+ Check In</code> simulator</sub>
    </td>
  </tr>
</table>

#### 4. Faculty & Administration Command Centers

<table>
  <tr>
    <td width="50%" align="center">
      <b>👨‍🏫 Faculty Departmental Portal</b><br/><br/>
      <img src="./assets/showcase/faculty_portal.png" alt="Faculty Portal" width="100%" style="border-radius: 8px;" /><br/>
      <sub>Lecture notes, classroom attendance logging & student marks entry</sub>
    </td>
    <td width="50%" align="center">
      <b>🛡️ Admin Central Control Portal</b><br/><br/>
      <img src="./assets/showcase/admin_portal.png" alt="Admin Portal" width="100%" style="border-radius: 8px;" /><br/>
      <sub>Student registry oversight, broadcast circulars & system health monitoring</sub>
    </td>
  </tr>
</table>

---

### 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Client["🖥️ React 19 Frontend Client (Port 5173)"]
        UI["Campus View & Hero Banner"]
        Portals["Role Workspaces (Student / Faculty / Admin)"]
        Trackers["Attendance & Assignment Trackers"]
    end

    subgraph Server["⚡ Express 4 RESTful Backend (Port 5000)"]
        Middleware["🛡️ CORS • JSON Parser • ISO Telemetry Logger"]
        HealthAPI["🩺 GET /health"]
        StudentAPI["🧑‍🎓 /api/students (CRUD)"]
        AssignAPI["📑 /api/assignments (CRUD)"]
        Store[("💾 In-Memory Transient State Store")]
    end

    UI --> Portals --> Trackers
    Client -->|HTTP / JSON Requests| Middleware
    Middleware --> HealthAPI & StudentAPI & AssignAPI
    StudentAPI & AssignAPI <--> Store
    HealthAPI & StudentAPI & AssignAPI -.->|JSON Envelopes| Client

    style Client fill:#07182f,stroke:#06b6d4,stroke-width:2px,color:#fff
    style Server fill:#0a2240,stroke:#10b981,stroke-width:2px,color:#fff
```

---

### 🔌 REST API Endpoints

The Express server listens on `http://localhost:5000` with standard JSON envelopes:

| Method | Endpoint | Status | Purpose | Sample Body |
|:---:|:---|:---:|:---|:---|
| `GET` | `/api/students` | `200 OK` | Fetch all enrolled students | *None* |
| `GET` | `/api/students/:id` | `200` / `404` | Retrieve student by ID | *None* |
| `POST` | `/api/students` | `201` / `400` | Register new student | `{"name","email","course"}` |
| `PUT` | `/api/students/:id` | `200` / `404` | Update student profile | `{"name"?, "course"?}` |
| `DELETE` | `/api/students/:id` | `200` / `404` | Remove student from registry | *None* |
| `GET` | `/api/assignments` | `200 OK` | Fetch all course assignments | *None* |
| `GET` | `/health` | `200 OK` | Server health & uptime telemetry | *None* |

---

### 🚀 Quickstart

```bash
# 1. Clone & Enter Project
git clone https://github.com/Dhruvi-tech/Campus-Connect-Portal.git
cd Campus-Connect-Portal

# 2. Launch Backend (Terminal 1)
cd server
npm install && npm run dev     # 📡 Listens on http://localhost:5000

# 3. Launch Frontend (Terminal 2)
cd client
npm install && npm run dev     # 🚀 Opens on http://localhost:5173
```

---

### 👤 Author

<div align="center">

<img src="https://github.com/Dhruvi-tech.png" width="90" style="border-radius: 50%; border: 3px solid #107c41; box-shadow: 0 4px 14px rgba(0,0,0,0.3);" alt="Dhruvi Mittal Avatar" />

### **Dhruvi Mittal**
**RV University** — School of Computer Science & Engineering  
*CS3301 - Full Stack Development*

[![GitHub Profile](https://img.shields.io/badge/GitHub-Dhruvi--tech-181717?style=flat-square&logo=github)](https://github.com/Dhruvi-tech)
[![Email](https://img.shields.io/badge/Email-dhruvimittalbsc24%40rvu.edu.in-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:dhruvimittalbsc24@rvu.edu.in)

<br/>

<!-- Local SVG Wave Footer -->
<img src="./assets/footer.svg" alt="Footer Wave Divider" width="100%" />

<sub>&copy; 2026 RV University • Campus Connect Portal • Engineered by Dhruvi Mittal</sub>

</div>