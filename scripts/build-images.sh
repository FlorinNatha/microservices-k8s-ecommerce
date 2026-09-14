#!/usr/bin/env bash
set -e

echo "=========================================="
echo "📦 Building & Loading Docker Images into Minikube..."
echo "=========================================="

# Service list with folder paths and image tags
SERVICES=(
  "services/auth-service:auth-service:v2"
  "services/user-service:user-service:v2"
  "services/product-service:product-service:v2"
  "services/order-service:order-service:v2"
  "services/payment-service:payment-service:v2"
  "api-gateway:api-gateway:v3"
  "frontend:frontend:latest"
)

for ITEM in "${SERVICES[@]}"; do
  IFS=":" read -r DIR TAG <<< "${ITEM}"
  echo "--> Building ${TAG} from ./${DIR}..."
  docker build -t "${TAG}" "./${DIR}"
  echo "--> Loading ${TAG} into Minikube..."
  minikube image load "${TAG}"
done

echo "✅ All Docker images successfully built and loaded into Minikube!"
