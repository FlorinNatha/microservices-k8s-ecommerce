# Microservices E-commerce Platform with Kubernetes

A highly scalable, containerized e-commerce application built using a microservices architecture. This project leverages Node.js, React, and several databases/message brokers, all orchestrated and managed via Kubernetes (Minikube).

## 🏗 Architecture & Services

The application is broken down into modular, independently deployable services:

*   **API Gateway**: Acts as the single entry point for the frontend, routing traffic to the appropriate backend microservices using `http-proxy-middleware`.
*   **Auth Service**: Handles user authentication, registration, and JWT token generation.
*   **User Service**: Manages user profiles and accounts.
*   **Product Service**: Manages the product catalog, inventory, and details.
*   **Order Service**: Processes user orders and interacts with payment & product services.
*   **Payment Service**: Handles transaction processing and checkout functionality.
*   **Frontend**: A modern, responsive user interface built with React & Vite.

### Infrastructure Components
*   **MongoDB**: Primary NoSQL database used by the microservices for data persistence.
*   **Redis**: In-memory data structure store used for caching and session management.
*   **RabbitMQ**: Message broker used for asynchronous communication and event-driven architecture between the microservices.

## 🚀 Technologies Used

*   **Frontend**: React.js, Vite, Node.js (v20+)
*   **Backend**: Node.js, Express.js
*   **Databases & Messaging**: MongoDB, Redis, RabbitMQ
*   **Containerization**: Docker, Docker Compose
*   **Orchestration**: Kubernetes, Minikube
*   **Version Control**: Git, GitHub

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your local machine:
*   [Docker Desktop](https://www.docker.com/products/docker-desktop)
*   [Minikube](https://minikube.sigs.k8s.io/docs/start/)
*   [kubectl](https://kubernetes.io/docs/tasks/tools/)
*   [Node.js](https://nodejs.org/en/) (v20 or higher)

## 🛠 Installation & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/FlorinNatha/microservices-k8s-ecommerce.git
cd microservices-k8s-ecommerce
```

### 2. Start Minikube
Start your local Kubernetes cluster using the Docker driver:
```bash
minikube start --driver=docker
```

### 3. Build Docker Images Locally
Since this project uses custom local images, build them pointing directly to Minikube's Docker daemon (or load them after building):

```bash
# Example for api-gateway
cd api-gateway
docker build -t api-gateway:v2 .

# Push image to Minikube
minikube image load api-gateway:v2
```
*(Repeat this process for the frontend and all other services as needed).*

### 4. Deploy to Kubernetes
Apply all the Kubernetes manifests (Deployments, Services, ConfigMaps, Secrets, PVCs) located in the respective `k8s` directories for each service.

```bash
kubectl apply -f services/auth-service/k8s/
kubectl apply -f api-gateway/k8s/
kubectl apply -f frontend/k8s/
# Apply infrastructure components (MongoDB, Redis, RabbitMQ)
```

### 5. Verify the Deployment
Check that all pods are up and running:
```bash
kubectl get pods
kubectl get svc
```

### 6. Access the Application
The frontend is exposed via a Kubernetes `LoadBalancer`. To access it locally on Windows/Mac, start the Minikube tunnel in a separate terminal:
```bash
minikube tunnel
```
Once the tunnel is running, open your browser and navigate to:
**http://127.0.0.1** (or `http://localhost`)

The API Gateway is exposed via a NodePort and can be accessed at `http://localhost:30080`.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is open-source and available under the [ISC License](LICENSE).
