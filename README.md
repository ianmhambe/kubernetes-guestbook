# Kubernetes Guestbook App

A web-based Guestbook application deployed on Kubernetes with a Node.js frontend, PostgreSQL backend, and persistent storage. Users can submit messages via a web form, which are stored in PostgreSQL and persist across pod restarts.

## Project Overview
This project demonstrates a full-stack application deployed on a local Kubernetes cluster (Minikube). It showcases containerization with Docker, orchestration with Kubernetes, and persistent storage using Persistent Volumes. The app allows users to:
- Submit messages through a web form.
- View all messages, which are stored persistently in PostgreSQL.
- Scale the application to multiple replicas for high availability.

## Architecture
- **Frontend**: Node.js with Express, serving a static HTML form and handling API requests (`/message` and `/messages`).
- **Backend**: PostgreSQL database with a Persistent Volume (PV) and Persistent Volume Claim (PVC) for data persistence.
- **Kubernetes**:
  - **Minikube**: Local Kubernetes cluster.
  - **Deployments**: `guestbook-deployment` (Node.js app) and `postgres` (PostgreSQL).
  - **Services**: `guestbook-service` (LoadBalancer) and `postgres-service` (ClusterIP).
  - **Persistent Storage**: `postgres-pv` and `postgres-pvc` for PostgreSQL data.
- **Docker**: Custom `guestbook-app` image built from Node.js code.

## Setup Instructions
1. **Prerequisites**:
   - Install Docker, Minikube, and kubectl on Ubuntu 24.04.
   - Start Minikube: `minikube start --driver=docker`.
   - Enable storage provisioner: `minikube addons enable storage-provisioner`.

