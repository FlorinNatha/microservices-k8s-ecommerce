# Kubernetes Deployment Flow

Helm is the single Kubernetes deployment source for this project. It owns infrastructure, application services, ingress, secrets, and monitoring through the charts under `infrastructure/helm`.

## Prerequisites

Install Docker Desktop, Minikube, kubectl, Helm, Git, and Git Bash. Start Minikube with ingress enabled:

```bash
minikube start --driver=docker
minikube addons enable ingress
```

## Deploy

Images must already exist in the configured registry with the exact immutable tag:

```bash
export IMAGE_REGISTRY='docker.io/your-dockerhub-username'
export IMAGE_TAG="$(git rev-parse --short HEAD)"
export JWT_SECRET='set-a-development-secret'
export STRIPE_SECRET_KEY='set-a-test-key'
export GRAFANA_ADMIN_USER='admin'
export GRAFANA_ADMIN_PASSWORD='change-this-password'

./scripts/deploy-helm.sh
```

The script installs these Helm releases into the `ecommerce` namespace:

1. `infrastructure`: MongoDB, Redis, and RabbitMQ.
2. `platform`: secrets and ingress.
3. Application charts: auth, user, product, order, payment, gateway, and frontend.
4. `monitoring`: Prometheus, Grafana, and Loki.

Verify the deployment:

```bash
kubectl get pods --namespace ecommerce
kubectl get services --namespace ecommerce
kubectl get ingress --namespace ecommerce
kubectl rollout status deployment/api-gateway --namespace ecommerce
kubectl rollout status deployment/frontend --namespace ecommerce
minikube tunnel
```

The ingress sends `/` to the frontend and `/api` to the gateway.

## Remove

```bash
./scripts/delete-helm.sh
```

Do not apply old raw Kubernetes files or run raw deployment scripts. They were removed to prevent two independent sources of truth from drifting.

## Argo CD

The GitHub Actions workflow builds and scans immutable commit-tagged images. Argo CD should later deploy these Helm charts using environment-specific values and an external secret solution such as External Secrets, Sealed Secrets, or SOPS.
