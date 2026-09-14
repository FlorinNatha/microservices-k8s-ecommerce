#!/usr/bin/env bash
set -e

echo "=========================================="
echo "🚀 Setting up Minikube Kubernetes Cluster..."
echo "=========================================="

# Check if minikube is running
if ! minikube status | grep -q "Running"; then
    echo "Starting Minikube..."
    minikube start --driver=docker
else
    echo "Minikube is already running."
fi

echo "Enabling Ingress addon..."
minikube addons enable ingress

echo "✅ Minikube Cluster environment ready!"
