#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HELM_DIR="${ROOT_DIR}/infrastructure/helm"
NAMESPACE="${NAMESPACE:-ecommerce}"
IMAGE_TAG="${IMAGE_TAG:-}"
IMAGE_REGISTRY="${IMAGE_REGISTRY:-}"
REPLICA_COUNT="${REPLICA_COUNT:-}"
HELM_TIMEOUT="${HELM_TIMEOUT:-10m}"

if [[ -z "${IMAGE_TAG}" ]]; then
  echo "Error: IMAGE_TAG must be set to an immutable commit tag." >&2
  exit 1
fi
if [[ "${IMAGE_TAG}" == "replace-with-git-commit-sha" ]]; then
  echo "Error: replace IMAGE_TAG with the exact tag pushed to the registry." >&2
  exit 1
fi

: "${JWT_SECRET:?JWT_SECRET must be set in the deployment environment}"
: "${STRIPE_SECRET_KEY:?STRIPE_SECRET_KEY must be set in the deployment environment}"
: "${GRAFANA_ADMIN_USER:?GRAFANA_ADMIN_USER must be set in the deployment environment}"
: "${GRAFANA_ADMIN_PASSWORD:?GRAFANA_ADMIN_PASSWORD must be set in the deployment environment}"

if [[ -z "${IMAGE_REGISTRY}" && -n "${DOCKER_USERNAME:-}" ]]; then
  IMAGE_REGISTRY="docker.io/${DOCKER_USERNAME}"
fi
if [[ "${IMAGE_REGISTRY}" == *"your-dockerhub-username"* ]]; then
  echo "Error: replace IMAGE_REGISTRY with the actual image registry path." >&2
  exit 1
fi

command -v helm >/dev/null 2>&1 || { echo "Error: Helm is required." >&2; exit 1; }

# Remove the legacy raw-manifest Ingress before installing the Helm-managed one.
# NGINX rejects duplicate host/path combinations across namespaces.
if kubectl get ingress ecom-ingress --namespace default >/dev/null 2>&1; then
  echo "Removing legacy default/ecom-ingress..."
  kubectl delete ingress ecom-ingress --namespace default --ignore-not-found
fi

# Remove cluster-scoped Prometheus RBAC left by the deleted raw-manifest path.
# Preserve resources already owned by the Helm monitoring release.
for resource in clusterrole/prometheus clusterrolebinding/prometheus; do
  if kubectl get "${resource}" >/dev/null 2>&1; then
    managed_by="$(kubectl get "${resource}" -o jsonpath='{.metadata.labels.app\.kubernetes\.io/managed-by}')"
    release_name="$(kubectl get "${resource}" -o jsonpath='{.metadata.annotations.meta\.helm\.sh/release-name}')"
    release_namespace="$(kubectl get "${resource}" -o jsonpath='{.metadata.annotations.meta\.helm\.sh/release-namespace}')"
    if [[ "${managed_by}" != "Helm" || "${release_name}" != "monitoring" || "${release_namespace}" != "${NAMESPACE}" ]]; then
      echo "Removing legacy unowned ${resource}..."
      kubectl delete "${resource}" --ignore-not-found
    fi
  fi
done

helm_args=(--namespace "${NAMESPACE}" --create-namespace)
secret_args=(
  --set-string "secrets.jwtSecret=${JWT_SECRET}"
  --set-string "secrets.stripeSecretKey=${STRIPE_SECRET_KEY}"
  --set-string "secrets.grafanaAdminUser=${GRAFANA_ADMIN_USER}"
  --set-string "secrets.grafanaAdminPassword=${GRAFANA_ADMIN_PASSWORD}"
)
image_args=()
replica_args=()

if [[ -n "${IMAGE_REGISTRY}" ]]; then
  image_args+=(--set-string "image.registry=${IMAGE_REGISTRY}")
fi
if [[ -n "${REPLICA_COUNT}" ]]; then
  replica_args+=(--set-string "replicaCount=${REPLICA_COUNT}")
fi


install_chart() {
  local release="$1"
  local chart="$2"
  shift 2
  echo "Deploying ${release}..."
  helm upgrade --install "${release}" "${HELM_DIR}/${chart}" "${helm_args[@]}" --wait --timeout "${HELM_TIMEOUT}" "$@"
}

install_chart infrastructure infrastructure
install_chart platform platform "${secret_args[@]}"
install_chart auth-service auth-service "${image_args[@]}" "${replica_args[@]}" --set-string "image.tag=${IMAGE_TAG}"
install_chart user-service user-service "${image_args[@]}" "${replica_args[@]}" --set-string "image.tag=${IMAGE_TAG}"
install_chart product-service product-service "${image_args[@]}" "${replica_args[@]}" --set-string "image.tag=${IMAGE_TAG}"
install_chart order-service order-service "${image_args[@]}" "${replica_args[@]}" --set-string "image.tag=${IMAGE_TAG}"
install_chart payment-service payment-service "${image_args[@]}" "${replica_args[@]}" --set-string "image.tag=${IMAGE_TAG}"
install_chart api-gateway api-gateway "${image_args[@]}" "${replica_args[@]}" --set-string "image.tag=${IMAGE_TAG}"
install_chart frontend frontend "${image_args[@]}" "${replica_args[@]}" --set-string "image.tag=${IMAGE_TAG}"
install_chart monitoring monitoring

kubectl get pods --namespace "${NAMESPACE}"
echo "Helm deployment completed in namespace ${NAMESPACE}."
