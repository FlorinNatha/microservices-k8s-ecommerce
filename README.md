# Microservices E-Commerce Platform

A learning-focused e-commerce platform built with React, Node.js, Express, MongoDB, Redis, RabbitMQ, Docker, and Kubernetes. The application is split into independently deployable services and can run locally with Docker Compose or on a Minikube cluster.

> **Project status:** This is a development and learning environment. Kubernetes secrets contain placeholder development values, the checkout UI currently simulates payment completion, and the package test scripts are placeholders. Review the production hardening notes before deploying outside a local cluster.

## Contents

- [What the project contains](#what-the-project-contains)
- [Architecture](#architecture)
- [Repository layout](#repository-layout)
- [Prerequisites](#prerequisites)
- [Run the infrastructure locally](#run-the-infrastructure-locally)
- [Run services directly](#run-services-directly)
- [Deploy to Minikube](#deploy-to-minikube)
- [Application routes](#application-routes)
- [Configuration and secrets](#configuration-and-secrets)
- [Observability](#observability)
- [CI pipeline](#ci-pipeline)
- [Troubleshooting](#troubleshooting)
- [Security and production checklist](#security-and-production-checklist)
- [Useful project commands](#useful-project-commands)

## What the project contains

The repository contains:

- A React 19 and Vite storefront with authentication, product browsing, cart, checkout, profile, and admin product management screens.
- An Express API gateway that proxies `/api/auth`, `/api/users`, `/api/products`, `/api/orders`, and `/api/payments`.
- Five Node.js services, each with its own `package.json`, Dockerfile, Kubernetes Deployment, Service, and database configuration.
- MongoDB persistence, Redis product caching, and RabbitMQ event communication.
- Prometheus metrics on every Node.js process and a Kubernetes-based Prometheus, Grafana, and Loki stack.
- GitHub Actions validation, Node.js verification, Docker builds, and optional Trivy scanning and Docker Hub publishing.

## Architecture

```text
Browser
  |
  +--> NGINX Ingress: /
  |        |
  |        +--> frontend:80
  |
  +--> NGINX Ingress: /api
           |
           +--> api-gateway:8080
                    |
                    +--> auth-service:5000 ----+
                    +--> user-service:5001      |
                    +--> product-service:5002 --+--> MongoDB
                    +--> order-service:5003 ----+
                    +--> payment-service:5004 -+
                                                   |
                                      Redis cache + RabbitMQ events
```

### Service matrix

| Component | Local port | Kubernetes service | Responsibility |
| --- | ---: | --- | --- |
| Frontend | 5173 in Vite, 80 in the container | `frontend:80` | Storefront UI |
| API gateway | 8000 by default, 8080 in Kubernetes | `api-gateway:8080` | CORS, logging, proxying, metrics |
| Auth service | 5000 | `auth-service:5000` | Registration, login, JWT, current user |
| User service | 5001 | `user-service:5001` | User profile read/update |
| Product service | 5002 | `product-service:5002` | Catalog, admin CRUD, Redis cache |
| Order service | 5003 | `order-service:5003` | Orders and payment event consumer |
| Payment service | 5004 | `payment-service:5004` | Payment intents and payment events |
| MongoDB | 27017 | `mongodb-service:27017` | Service data persistence |
| Redis | 6379 | `redis-service:6379` | Product list cache |
| RabbitMQ | 5672, 15672 | `rabbitmq-service` | Events and management UI |

### Event flow

1. The order service publishes `ORDER_CREATED` after an order is saved.
2. The product service consumes `ORDER_CREATED` and reduces stock for available products.
3. The payment service publishes `PAYMENT_SUCCESS` when a payment status becomes `COMPLETED`.
4. The order service consumes `PAYMENT_SUCCESS` and marks the order as paid.

## Repository layout

```text
api-gateway/                 Express reverse proxy and gateway Kubernetes manifests
frontend/                    React/Vite application and frontend Kubernetes manifests
services/                    auth, user, product, order, and payment services
infrastructure/kubernetes/   MongoDB, Redis, RabbitMQ, ingress, and monitoring manifests
scripts/                     Cluster setup, image build, deployment, and cleanup scripts
docs/                        Detailed Kubernetes and API design notes
.github/workflows/ci.yml     CI and container security pipeline
docker-compose.yml           Local MongoDB, Redis, and RabbitMQ only
update-metrics.ps1           PowerShell helper for adding metrics to services
```

## Prerequisites

For the recommended Windows workflow, install:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js 20 or newer](https://nodejs.org/)
- [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- Git and PowerShell

For the shell scripts, use Git Bash or another Bash-compatible shell. Docker Desktop must be running, and its virtualization requirements must be available to Minikube.

## Run the infrastructure locally

Docker Compose starts the local dependencies used by the services. It does not start the Node.js services or frontend.

```powershell
docker compose up -d
docker compose ps
```

The local dependency endpoints are:

| Dependency | Address |
| --- | --- |
| MongoDB | `mongodb://localhost:27017` |
| Redis | `redis://localhost:6379` |
| RabbitMQ AMQP | `amqp://localhost:5672` |
| RabbitMQ management UI | `http://localhost:15672` |

Stop the dependencies with:

```powershell
docker compose down
```

## Run services directly

Install dependencies in each application directory, then start that application. The backend services use `.env` files through `dotenv`; Kubernetes injects equivalent values through manifests.

```powershell
cd api-gateway
npm install
npm run dev
```

In separate terminals, repeat for `services/auth-service`, `services/user-service`, `services/product-service`, `services/order-service`, and `services/payment-service`. Start the frontend separately:

```powershell
cd frontend
npm install
npm run dev
```

The Vite frontend normally runs at `http://localhost:5173`. The current frontend source calls the gateway at `http://localhost:8000`, so the gateway must be running on port 8000 for direct local development. The gateway uses these defaults unless overridden:

```text
PORT=8000
AUTH_SERVICE_URL=http://localhost:5000
USER_SERVICE_URL=http://localhost:5001
PRODUCT_SERVICE_URL=http://localhost:5002
ORDER_SERVICE_URL=http://localhost:5003
PAYMENT_SERVICE_URL=http://localhost:5004
```

For a production-like frontend deployment, update the frontend API base URL to use the ingress host or a Vite environment variable before building. The current source contains several hard-coded `http://localhost:8000` calls.

## Deploy to Minikube

The repository includes scripts for the intended deployment order.

### 1. Prepare the cluster

From Git Bash:

```bash
./scripts/setup-cluster.sh
```

Equivalent PowerShell commands:

```powershell
minikube start --driver=docker
minikube addons enable ingress
```

### 2. Build and load images

```bash
./scripts/build-images.sh
```

This builds and loads these local image tags into Minikube: `auth-service:v2`, `user-service:v2`, `product-service:v2`, `order-service:v2`, `payment-service:v2`, `api-gateway:v3`, and `frontend:latest`.

### 3. Deploy the application

```bash
./scripts/deploy-all.sh
```

The deployment script applies infrastructure first, then service secrets and workloads, gateway and frontend, monitoring, and ingress. To apply the manifests manually, use the same order:

```powershell
kubectl apply -f infrastructure/kubernetes/databases/mongodb.yaml
kubectl apply -f infrastructure/kubernetes/cache/redis.yaml
kubectl apply -f infrastructure/kubernetes/messaging/rabbitmq.yaml
kubectl apply -f services/auth-service/k8s/
kubectl apply -f services/user-service/k8s/
kubectl apply -f services/product-service/k8s/
kubectl apply -f services/order-service/k8s/
kubectl apply -f services/payment-service/k8s/
kubectl apply -f api-gateway/k8s/
kubectl apply -f frontend/k8s/
kubectl apply -f infrastructure/kubernetes/monitoring/
kubectl apply -f infrastructure/kubernetes/ingress/ingress.yaml
```

### 4. Verify and access the cluster

```powershell
kubectl get pods
kubectl get services
kubectl get ingress
kubectl rollout status deployment/api-gateway
kubectl rollout status deployment/frontend
```

Keep this command running in a separate administrator terminal when using the ingress address locally:

```powershell
minikube tunnel
```

Then open `http://localhost`. An alternative for the frontend is:

```powershell
minikube service frontend --url
```

The ingress sends `/` to the frontend and `/api` to the gateway.

### Remove the deployment

```bash
./scripts/delete-all.sh
```

This removes the Kubernetes resources selected by the cleanup script. Remove the Minikube cluster itself with `minikube delete` when it is no longer needed.

## Application routes

All routes below are available through the gateway at `http://localhost:8000` during direct local development or through the ingress `/api` path in Kubernetes. Protected routes require `Authorization: Bearer <jwt>`. Admin routes additionally require a token whose role is `admin`.

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Create an account and return a JWT |
| `POST` | `/api/auth/login` | Public | Authenticate and return a JWT |
| `GET` | `/api/auth/me` | JWT | Return the authenticated user |
| `GET` | `/api/users/profile` | JWT | Read the user profile |
| `PUT` | `/api/users/profile` | JWT | Update profile fields |
| `GET` | `/api/products` | Public | List products; cached in Redis |
| `GET` | `/api/products/:id` | Public | Read one product |
| `POST` | `/api/products` | Admin | Create a product |
| `PUT` | `/api/products/:id` | Admin | Update a product |
| `DELETE` | `/api/products/:id` | Admin | Delete a product |
| `POST` | `/api/orders` | JWT | Create an order |
| `GET` | `/api/orders/myorders` | JWT | List the current user's orders |
| `GET` | `/api/orders/:id` | JWT | Read an owned order or an admin-visible order |
| `PUT` | `/api/orders/:id/pay` | JWT | Mark an order as paid in the current checkout flow |
| `GET` | `/api/orders` | Admin | List all orders |
| `POST` | `/api/payments/process` | JWT | Create a payment intent or mock payment |
| `PUT` | `/api/payments/status` | JWT | Update a payment status |

Every Node.js process also exposes `/health` and `/metrics` on its own service port. Prometheus scrapes the service pods using their Kubernetes annotations.

## Configuration and secrets

### Backend environment variables

| Service | Variables used |
| --- | --- |
| Mongo-backed services | `PORT`, `MONGO_URI`, `JWT_SECRET` where applicable |
| Auth service | `JWT_EXPIRES_IN` |
| API gateway | `PORT`, `AUTH_SERVICE_URL`, `USER_SERVICE_URL`, `PRODUCT_SERVICE_URL`, `ORDER_SERVICE_URL`, `PAYMENT_SERVICE_URL` |
| Payment service | `STRIPE_SECRET_KEY` |
| Product service | Redis and RabbitMQ connection variables in `src/utils` |
| Product and order services | RabbitMQ connection variables in `src/utils/rabbitmq` |

The exact optional connection defaults are defined in each service's `src` directory. For Kubernetes, edit the service `secret.yaml` files or create environment-specific secrets rather than committing real credentials.

The current development setup uses separate MongoDB databases: `auth-db`, `user-db`, `product-db`, `order-db`, and `payment-db`.

### Create a local admin

The auth service includes administrative helper scripts:

```powershell
cd services/auth-service
node createAdmin.js
```

Read `createAdmin.js`, `promote.js`, and `demote.js` before use because they operate directly on the configured MongoDB database and may require a username or email argument.

## Observability

The Kubernetes deployment includes:

- Prometheus on service `prometheus:9090`, scraping pods with `prometheus.io/scrape: "true"`.
- Grafana on service `grafana:80`, provisioned with Prometheus as its default data source.
- Loki on service `loki:3100` for the included log aggregation component.

Port-forward the dashboards from a running cluster:

```powershell
kubectl port-forward svc/prometheus 9090:9090
kubectl port-forward svc/grafana 3000:80
```

Open `http://localhost:9090` for Prometheus or `http://localhost:3000` for Grafana. The manifest currently sets the Grafana development admin password to `admin`; change it before any shared or production deployment.

Useful diagnostic commands:

```powershell
kubectl logs deployment/api-gateway
kubectl logs deployment/product-service
kubectl describe pod <pod-name>
kubectl get events --sort-by=.lastTimestamp
```

## CI pipeline

`.github/workflows/ci.yml` runs on pushes to `main`, `master`, `feature/**`, and `fix/**`, and on pull requests targeting `main` or `master`. It:

1. Parses Kubernetes YAML with PyYAML.
2. Installs dependencies and performs Node.js syntax checks for all seven applications.
3. Builds each Docker image with Buildx.
4. Runs Trivy scans for high and critical OS/library vulnerabilities. The workflow currently reports findings without failing because `exit-code` is `0`.
5. Pushes images to Docker Hub only when `DOCKER_USERNAME` and `DOCKER_PASSWORD` repository secrets are configured.

There are currently no implemented automated application tests; each package's `npm test` script intentionally exits with an error.

## Troubleshooting

### `ErrImagePull` or `ImagePullBackOff`

Confirm the image tag in the Deployment matches the tag loaded into Minikube:

```powershell
minikube image ls | Select-String "auth-service|api-gateway|frontend"
kubectl describe pod <pod-name>
```

Run `./scripts/build-images.sh` again after changing application code.

### A service is in `CrashLoopBackOff`

Inspect the current and previous container logs, then check that its database and message broker are ready:

```powershell
kubectl logs <pod-name>
kubectl logs <pod-name> --previous
kubectl get pods
kubectl get services
```

### The frontend cannot reach the API

For direct Vite development, confirm the gateway is listening on port 8000. For Kubernetes, remember that the frontend source currently contains hard-coded localhost gateway URLs; those calls need to be made configurable before using the frontend behind a non-local ingress host.

### MongoDB data disappears

The Kubernetes MongoDB manifest uses a 1 GiB PVC, while Prometheus and Loki use `emptyDir` storage. The latter are intentionally non-persistent in this learning setup.

### Ingress is unavailable

Confirm the addon and tunnel are running:

```powershell
minikube addons list
minikube addons enable ingress
kubectl get ingress
```

## Security and production checklist

Before treating this as production-ready:

- Replace all committed placeholder secrets and move them to a secret manager.
- Rotate `JWT_SECRET`, use a strong `STRIPE_SECRET_KEY`, and set a non-default Grafana password.
- Configure the frontend API base URL instead of hard-coded `localhost` addresses.
- Add request validation, rate limiting, structured error handling, and HTTPS/TLS at the ingress.
- Restrict CORS to known frontend origins instead of allowing all origins.
- Add real unit, integration, API contract, and end-to-end tests.
- Use pinned image versions and persistent storage for monitoring where required.
- Add resource quotas, NetworkPolicies, backups, readiness dependencies, and horizontal scaling policies.
- Make payment status updates provider-verified webhooks rather than trusting a client request.

## Useful project commands

```powershell
# Inspect the cluster
kubectl get all
kubectl get pods -o wide

# Restart one service after a new image is loaded
kubectl rollout restart deployment/product-service
kubectl rollout status deployment/product-service

# Validate YAML syntax locally when Python and PyYAML are installed
python -c "import yaml; from pathlib import Path; [list(yaml.safe_load_all(p.read_text())) for p in Path('.').rglob('*.yaml')]"

# Frontend quality checks
cd frontend
npm run lint
npm run build
```

Additional deployment detail is available in [docs/kubernetes-flow.md](docs/kubernetes-flow.md), and the API design notes are in [docs/api-design.md](docs/api-design.md).

## Contributing

1. Create a focused branch.
2. Keep service and manifest changes scoped to the affected component.
3. Run the frontend lint/build checks and validate Kubernetes YAML before opening a pull request.
4. Document new environment variables, routes, events, or deployment steps in this README and the relevant service documentation.

## License

The package metadata declares the ISC license. Add a repository `LICENSE` file before distributing the project as an open-source package.
