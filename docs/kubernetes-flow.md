# Kubernetes Minikube Deployment Guide

This guide provides the exact commands you need to deploy your microservices e-commerce application to a local Minikube cluster.

## 1. Prerequisites
Ensure you have Docker, Minikube, and `kubectl` installed on your Windows machine.

## 2. Start Minikube
First, start your Minikube cluster:
```powershell
minikube start --driver=docker
```

## 3. Configure Docker to use Minikube's Daemon
To ensure Minikube can find your locally built Docker images (without needing to push them to Docker Hub), point your Docker CLI to Minikube's Docker daemon.

Run this in your **PowerShell**:
```powershell
& minikube -p minikube docker-env --shell powershell | Invoke-Expression
```

> **Alternative for Windows Users:** 
> If the above command fails or `minikube` isn't globally recognized in your terminal, you can build images normally with Docker Desktop and then load them directly into Minikube's internal daemon:
> ```powershell
> # Build normally
> docker build -t api-gateway:v2 .
> # Save and load into minikube
> cmd.exe /c "docker save api-gateway:v2 | docker exec -i minikube docker load"
> ```

## 4. Build Docker Images
You need to build the Docker images for all your services directly inside the Minikube Docker environment. Run the following commands from the root directory of your project:

```powershell
# Build API Gateway
cd api-gateway
docker build -t api-gateway:latest .
cd ..

# Build Services
cd services/auth-service
docker build -t auth-service:latest .
cd ../order-service
docker build -t order-service:latest .
cd ../payment-service
docker build -t payment-service:latest .
cd ../product-service
docker build -t product-service:latest .
cd ../user-service
docker build -t user-service:latest .
cd ../..

# Build Frontend
cd frontend
docker build -t frontend:latest .
cd ..
```

## 5. Deploy Infrastructure (Databases & Messaging)
Apply the infrastructure configurations first so they are ready when your microservices start.
```powershell
kubectl apply -f infrastructure/kubernetes/databases/mongodb.yaml
kubectl apply -f infrastructure/kubernetes/databases/mysql.yaml
kubectl apply -f infrastructure/kubernetes/cache/redis.yaml
kubectl apply -f infrastructure/kubernetes/messaging/rabbitmq.yaml
```

## 6. Apply Secrets and ConfigMaps
Next, apply your Kubernetes secrets and ConfigMaps.
```powershell
kubectl apply -f services/auth-service/k8s/secret.yaml
kubectl apply -f services/order-service/k8s/secret.yaml
kubectl apply -f services/payment-service/k8s/secret.yaml
kubectl apply -f services/product-service/k8s/secret.yaml
kubectl apply -f services/user-service/k8s/secret.yaml
kubectl apply -f api-gateway/k8s/configmap.yaml
```

## 7. Deploy Microservices & Frontend
Now, apply the deployments and services for all components.
```powershell
# API Gateway
kubectl apply -f api-gateway/k8s/deployment.yaml
kubectl apply -f api-gateway/k8s/service.yaml

# Microservices
kubectl apply -f services/auth-service/k8s/deployment.yaml
kubectl apply -f services/auth-service/k8s/service.yaml

kubectl apply -f services/order-service/k8s/deployment.yaml
kubectl apply -f services/order-service/k8s/service.yaml

kubectl apply -f services/payment-service/k8s/deployment.yaml
kubectl apply -f services/payment-service/k8s/service.yaml

kubectl apply -f services/product-service/k8s/deployment.yaml
kubectl apply -f services/product-service/k8s/service.yaml

kubectl apply -f services/user-service/k8s/deployment.yaml
kubectl apply -f services/user-service/k8s/service.yaml

# Frontend
kubectl apply -f frontend/k8s/deployment.yaml
kubectl apply -f frontend/k8s/service.yaml
```

## 8. Verify the Deployment
Check if all pods are running (it might take a few minutes for image pulling and database initialization):
```powershell
kubectl get pods -w
```

Check the services:
```powershell
kubectl get svc
```

## 9. Access the Application
Since we're using Minikube, you can expose the frontend and API Gateway LoadBalancer services.

Run this in a separate terminal to expose LoadBalancer services on Minikube:
```powershell
minikube tunnel
```
After running the tunnel, your frontend should be accessible at `http://localhost:80` (or `http://127.0.0.1`).

Alternatively, you can get the direct URL to the frontend using:
```powershell
minikube service frontend
```

## 10. Troubleshooting
* **CrashLoopBackOff**: If pods crash, check their logs via `kubectl logs <pod-name>`. 
* **Database Connections**: If microservices crash, it is usually because they are trying to connect to a database (`mongodb`, `redis`, etc.) that is still starting up. Wait for the databases to reach `Running` state and the services will reconnect.
* **Image Pull Errors**: If Kubernetes says `ErrImagePull`, it means Minikube can't find your local image. Ensure you either used the `docker-env` command or pushed the image to Minikube via `docker load`.
