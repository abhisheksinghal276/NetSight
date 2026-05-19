# 🌐 NetSight

<p align="center">
  <img src="./frontend/src/assets/logo.png" width="120"/>
</p>

<h1 align="center">
NetSight
</h1>

<h3 align="center">
Real-Time Infrastructure Monitoring Platform
</h3>

<p align="center">
Monitor infrastructure health, service availability, and network latency in real time through an intuitive dashboard experience.
</p>

<p align="center">

[![React](https://img.shields.io/badge/React-19-blue)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-0.136-green)]()
[![PostgreSQL](https://img.shields.io/badge/Database-Neon-success)]()
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black)]()
[![Render](https://img.shields.io/badge/Backend-Render-purple)]()

</p>

---

# 📖 Overview

NetSight is a full-stack infrastructure monitoring platform designed to provide a modern and simplified observability experience.

Users can create accounts, add services or servers they want to monitor, and instantly visualize health metrics such as service availability and latency.

The objective behind NetSight is to build a lightweight monitoring platform that combines usability with infrastructure insights in a visually engaging interface.

Current implementation focuses on providing a Minimum Viable Product (MVP) with real-time monitoring capabilities.

---

# 🚀 Live Demo

### Application

```text
https://netsight-monitor.vercel.app
```

### Backend Swagger Documentation

```text
https://netsight-api.onrender.com/docs
```

---

# ✨ Current Functionalities

## Authentication

- User Signup
- User Login
- Persistent Sessions
- Logout functionality
- User-specific monitoring dashboard

---

## Infrastructure Monitoring

Users can:

- Add servers/services for monitoring
- Delete monitored services
- Track service availability
- Monitor latency
- View live status updates
- Access only their monitored services

---

## Dashboard Features

- Responsive design
- Animated monitoring cards
- Pulsating service indicators
- Rolling latency updates
- Apple-inspired UI design
- User profile section
- Live status refresh

---

# 🛠 Tech Stack

## Frontend

| Technology | Purpose |
|------------|----------|
| React | UI Development |
| Vite | Build Tool |
| TailwindCSS | Styling |
| Framer Motion | Animations |
| Axios | API Communication |
| Lucide React | Icons |

---

## Backend

| Technology | Purpose |
|------------|----------|
| FastAPI | REST API framework |
| SQLAlchemy | ORM |
| APScheduler | Background monitoring |
| Pydantic | Validation |
| Uvicorn | Server |

---

## Database & Authentication

| Technology | Purpose |
|------------|----------|
| Neon PostgreSQL | Database |
| Neon Auth | Authentication |

---

## Deployment

| Service | Purpose |
|----------|----------|
| Vercel | Frontend Hosting |
| Render | Backend Hosting |
| GitHub | Version Control |

---

# ⚙️ System Design

## High-Level Architecture

```text
                    ┌────────────────────┐
                    │      Frontend      │
                    │ React + Vite       │
                    │ (Hosted on Vercel) │
                    └─────────┬──────────┘
                              │
                              │ REST APIs
                              ▼
                    ┌────────────────────┐
                    │      Backend       │
                    │ FastAPI            │
                    │ (Hosted on Render) │
                    └─────────┬──────────┘
                              │
          ┌───────────────────┴──────────────────┐
          │                                      │
          ▼                                      ▼
┌────────────────────┐              ┌──────────────────┐
│ Neon PostgreSQL    │              │ Neon Auth        │
│ Database           │              │ Authentication   │
└────────────────────┘              └──────────────────┘
```

---

### Service Monitoring Flow

```text
User Login
      ↓
Dashboard Loads
      ↓
Fetch User's Monitored Services
      ↓
Monitoring Scheduler Starts
      ↓
Backend Checks Service Health
      ↓
Latency + Status Calculated
      ↓
Database Updated
      ↓
Frontend Refreshes Dashboard
```

---

### Request Lifecycle

```text
User submits service details
            ↓
Frontend sends API request
            ↓
FastAPI validates request
            ↓
Database stores service details
            ↓
Monitoring service checks server
            ↓
Latency + Health calculated
            ↓
Database updated
            ↓
Frontend refreshes UI
```

### System Flow

1. User accesses NetSight through frontend hosted on Vercel

2. React frontend sends REST API requests to FastAPI backend

3. FastAPI validates requests and performs operations

4. User authentication is managed through Neon Auth

5. User monitoring data is stored in Neon PostgreSQL

6. Monitoring workers periodically check services

7. Latency and health metrics are updated

8. Updated data is sent back to frontend for visualization

---

# 🔄 Request Lifecycle

```text
User submits service details
            ↓
Frontend sends API request
            ↓
FastAPI validates request
            ↓
Database stores service details
            ↓
Monitoring worker checks service
            ↓
Latency + Health calculated
            ↓
Database updated
            ↓
Frontend refreshes dashboard
```

---

# 🧩 API Design

Base URL:

```text
https://netsight-api.onrender.com
```

---

## Create Service

### Endpoint

```http
POST /servers/
```

Request:

```json
{
  "name":"Google DNS",
  "ip":"8.8.8.8",
  "port":53,
  "user_id":"123"
}
```

Response:

```json
{
    "id":1,
    "name":"Google DNS",
    "ip":"8.8.8.8",
    "port":53,
    "status":"UP",
    "latency":20
}
```

---

## Get Monitored Services

### Endpoint

```http
GET /servers/?user_id={id}
```

Response:

```json
[
    {
        "id":1,
        "name":"Google DNS",
        "status":"UP",
        "latency":18
    }
]
```

---

## Check Server Status

### Endpoint

```http
POST /servers/check/{server_id}
```

Response:

```json
{
    "server":"Google DNS",
    "status":"UP",
    "latency":14
}
```

---

## Delete Service

### Endpoint

```http
DELETE /servers/{server_id}
```

Response:

```json
{
    "message":"Deleted Successfully"
}
```

---

# 📱 Responsive Design

NetSight supports:

- Desktop
- Tablet
- Mobile devices

Features include:

- Adaptive layouts
- Dynamic typography
- Responsive cards
- Flexible dashboard structure

---

# 🔮 Future Enhancements

Planned features:

- Network topology tree visualization
- Historical latency graphs
- Email alerts
- Push notifications
- Service grouping
- Analytics dashboard
- Dark/Light themes
- Network maps
- Service dependency visualization

---

# 🧠 Learnings From This Project

This project involved practical implementation of:

- Full-stack application development
- Authentication systems
- API design
- Database integration
- Infrastructure monitoring
- Deployment pipelines
- System design principles
- Real-time UI updates

---

# 👨‍💻 Author

### Abhishek Singhal

GitHub:

```text
https://github.com/abhisheksinghal276
```

Project:

```text
https://netsight-monitor.vercel.app
```

API Docs:

```text
https://netsight-api.onrender.com/docs
```

---

<p align="center">
⭐ If you found this project useful, consider giving it a star.
</p>