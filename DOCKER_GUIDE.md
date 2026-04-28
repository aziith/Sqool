# Docker Setup Guide for Education Track

I have set up the Docker environment for your project. Follow these steps to get everything running smoothly.

## 📂 New Files Created
- `docker/backend.Dockerfile`: Configuration for the Backend service.
- `docker/frontend.Dockerfile`: Configuration for the Frontend (using Nginx).
- `docker-compose.yml`: Orchestrates Backend, Frontend, and PostgreSQL Database.
- `.dockerignore` (in both folders): Keeps Docker images lightweight by excluding unnecessary files.

---

## 🚀 Setup & Execution Process

### 1. Prerequisite
Ensure you have **Docker Desktop** installed and running on your system.

### 2. Build and Start the Containers
Open your terminal in the project root directory (`d:\Education Track`) and run:
```bash
docker-compose up --build
```
This command will:
- Build the Backend and Frontend images.
- Download the PostgreSQL image.
- Start all three services together.

### 3. Initialize the Database (First-time only)
Since the Docker database starts fresh, you need to push your Prisma schema to it. Open a **new terminal** and run:
```bash
docker exec -it education-backend npx prisma db push
```
*Optional: If you want to seed data, run:*
```bash
docker exec -it education-backend npx prisma db seed
```

### 4. Access the Application
Once the containers are up:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🛠️ Common Docker Commands

| Action | Command |
| :--- | :--- |
| **Stop All Services** | `docker-compose down` |
| **Start Services (Background)** | `docker-compose up -d` |
| **View Logs** | `docker-compose logs -f` |
| **Restart a specific service** | `docker-compose restart backend` |

---

> [!TIP]
> Your local files in `backend/` and `frontend/` are mapped to the containers. Any changes you make to the code will reflect inside the Docker environment immediately (Hot Reloading).
