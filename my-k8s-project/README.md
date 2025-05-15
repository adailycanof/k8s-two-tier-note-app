## K8s Two-Tier Notes Application

A beginner-friendly Kubernetes project implementing a two-tier architecture with a frontend web UI and backend API service.

# Project Structure

```
.
├── README.md
├── k8s/
│   ├── frontend/
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   ├── backend/
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   └── config/
│       └── configmap.yaml
├── src/
│   ├── frontend/
│   │   ├── Dockerfile
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── app.js
│   └── backend/
│       ├── Dockerfile
│       ├── package.json
│       ├── server.js
│       └── routes/
│           └── notes.js
├── docs/
│   ├── architecture.md
│   └── screenshots/
│       ├── frontend.png
│       └── api-response.png
└── scripts/
    ├── deploy.sh
    └── cleanup.sh
```

# Setup Instructions

# Prerequisites

- Docker
- Kubernetes cluster (Minikube, kind, or cloud provider)
- kubectl configured

# Running Locally

1. Clone it to your local machine
2. Ensure Docker and kubectl are installed and configured
3. Run the deployment script:

bash

chmod +x scripts/deploy.sh
./scripts/deploy.sh

Access your application using the URL provided at the end of deployment


# Architecture

This application follows a two-tier architecture pattern:

1. **Frontend**: Nginx-based web UI that makes API calls to the backend
2. **Backend**: Node.js REST API service


Kubernetes Two-Tier Application Architecture
This document outlines the architecture and design decisions for the K8s Notes Application.
Architecture Overview
The Notes Application follows a two-tier architecture with the following components:
┌──────────────────┐      ┌──────────────────┐
│                  │      │                  │
│  Frontend        │      │  Backend API     │
│  (Nginx)         │──────▶  (Node.js)       │
│                  │      │                  │
└──────────────────┘      └──────────────────┘
Components
Frontend

Technology: HTML, CSS, JavaScript served by Nginx
Purpose: Provides the user interface for creating, viewing, and managing notes
Kubernetes Resources:

Deployment with 3 replicas
NodePort Service for external access
ConfigMap for configuration parameters



Backend API

Technology: Node.js Express server
Purpose: Provides REST API endpoints for note management
Kubernetes Resources:

Deployment with 2 replicas
ClusterIP Service for internal access
ConfigMap for environment variables



Service Communication

The frontend communicates with the backend using Kubernetes Service Discovery
API URL is passed to the frontend via environment variables
CORS is configured to allow only specified origins

Scaling Considerations
Both frontend and backend components can be scaled independently based on load:

Frontend: Scales horizontally by increasing replicas
Backend: Scales horizontally by increasing replicas

Persistence
In this demo application, the data is stored in-memory within the API pods. In a production environment, you would:

Add a Database tier (e.g., MongoDB, PostgreSQL)
Use StatefulSets for the database deployment
Configure Persistent Volumes for data storage

Security Considerations
The application implements basic security practices:

Services exposed with appropriate visibility (internal/external)
Resource limits to prevent resource exhaustion
Health checks to ensure service availability

Network Flow

User accesses the NodePort service (notes-frontend-service)
Request is routed to one of the frontend pods
Frontend makes API calls to the backend service (notes-api-service)
Backend service routes requests to available backend pods

Future Improvements

Add database tier for persistent storage
Implement authentication and authorization
Add Ingress controller for better external access
Set up horizontal pod autoscaling based on metrics
Implement proper logging and monitoring


# Learning Opportunities
This project helps you learn:

Kubernetes pod communication
Service discovery patterns
ConfigMap usage for configuration
Multi-container application deployment
Docker image building and management
Kubernetes deployment automation