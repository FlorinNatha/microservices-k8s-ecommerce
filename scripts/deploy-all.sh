#!/usr/bin/env bash
set -e

echo "=========================================="
echo "🚀 Deploying Microservices E-Commerce Application..."
echo "=========================================="

echo "1. Deploying Infrastructure (Databases, Cache, Messaging)..."
kubectl apply -f infrastructure/kubernetes/databases/mongodb.yaml
kubectl apply -f infrastructure/kubernetes/cache/redis.yaml
kubectl apply -f infrastructure/kubernetes/messaging/rabbitmq.yaml

echo "2. Deploying Microservices & Secrets..."
kubectl apply -f services/auth-service/k8s/
kubectl apply -f services/user-service/k8s/
kubectl apply -f services/product-service/k8s/
kubectl apply -f services/order-service/k8s/
kubectl apply -f services/payment-service/k8s/

echo "3. Deploying API Gateway & Frontend..."
kubectl apply -f api-gateway/k8s/
kubectl apply -f frontend/k8s/

echo "4. Deploying Monitoring Stack (Prometheus, Grafana, Loki)..."
kubectl apply -f infrastructure/kubernetes/monitoring/prometheus-k8s.yaml
kubectl apply -f infrastructure/kubernetes/monitoring/grafana.yaml
kubectl apply -f infrastructure/kubernetes/monitoring/loki.yaml

echo "5. Deploying Ingress Routing..."
kubectl apply -f infrastructure/kubernetes/ingress/ingress.yaml

echo "=========================================="
echo "✅ Deployment Complete! Current Pod Status:"
echo "=========================================="
kubectl get pods
