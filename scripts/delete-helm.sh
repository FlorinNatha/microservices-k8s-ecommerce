#!/usr/bin/env bash
set -euo pipefail

NAMESPACE="${NAMESPACE:-ecommerce}"

command -v helm >/dev/null 2>&1 || { echo "Error: Helm is required." >&2; exit 1; }

for release in monitoring frontend api-gateway payment-service order-service product-service user-service auth-service platform infrastructure; do
  echo "Removing ${release}..."
  helm uninstall "${release}" --namespace "${NAMESPACE}" --ignore-not-found
 done

echo "Helm releases removed from namespace ${NAMESPACE}."
