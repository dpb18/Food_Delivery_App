# Food Delivery App (FeastHub)

A full-stack food delivery application built with Spring Boot (backend) and React + Vite (frontend).

## Project Structure

```
Food Delivery App/
├── backend/                  # Spring Boot 3 Backend Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/feasthub/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
├── frontend/                 # React + Vite Frontend Application
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── database-schema.sql       # MySQL Database Schema
├── database-schema-viewer.html # Interactive Schema Visualizer
├── DATABASE_SCHEMA_DIAGRAM.md# Database Schema Documentation & Mermaid Diagram
├── DAY1_LEARNING_NOTES.md    # Architecture & Learning Notes Day 1
├── DAY2_LEARNING_NOTES.md    # Architecture & Learning Notes Day 2
├── backend_flow.json         # Backend flow specifications
└── orders.json               # Sample orders data
```

## Tech Stack

### Backend
- **Java 21**
- **Spring Boot 3.4.x** (Spring Web, Spring Data JPA, Spring Security, Validation)
- **MySQL** Database
- **JWT (JSON Web Token)** Authentication
- **Maven**

### Frontend
- **React 18**
- **Vite**
- **Lucide Icons**
- **Tailwind CSS / Vanilla CSS**

## Getting Started

### Prerequisites
- JDK 21+
- Node.js 18+ & npm
- MySQL Server

### 1. Database Setup
Create database and run schema:
```sql
CREATE DATABASE feasthub_db;
```
Import `database-schema.sql` into MySQL.

### 2. Backend Setup
```bash
cd backend
mvn clean spring-boot:run
```
The backend will run on `http://localhost:8080`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.
