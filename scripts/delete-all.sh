#!/usr/bin/env bash
set -e

echo "=========================================="
echo "🧹 Cleaning up all Kubernetes Resources..."
echo "=========================================="

echo "Removing Ingress..."
kubectl delete -f infrastructure/kubernetes/ingress/ingress.yaml --ignore-not-found

echo "Removing Monitoring Stack..."
kubectl delete -f infrastructure/kubernetes/monitoring/prometheus.yaml --ignore-not-found
kubectl delete -f infrastructure/kubernetes/monitoring/grafana.yaml --ignore-not-found

echo "Removing API Gateway & Frontend..."
kubectl delete -f api-gateway/k8s/ --ignore-not-found
kubectl delete -f frontend/k8s/ --ignore-not-found

echo "Removing Microservices..."
kubectl delete -f services/auth-service/k8s/ --ignore-not-found
kubectl delete -f services/user-service/k8s/ --ignore-not-found
kubectl delete -f services/product-service/k8s/ --ignore-not-found
kubectl delete -f services/order-service/k8s/ --ignore-not-found
kubectl delete -f services/payment-service/k8s/ --ignore-not-found

echo "Removing Infrastructure..."
kubectl delete -f infrastructure/kubernetes/databases/mongodb.yaml --ignore-not-found
kubectl delete -f infrastructure/kubernetes/cache/redis.yaml --ignore-not-found
kubectl delete -f infrastructure/kubernetes/messaging/rabbitmq.yaml --ignore-not-found

echo "=========================================="
echo "✅ Cleaned up all application resources from Minikube!"
echo "=========================================="
