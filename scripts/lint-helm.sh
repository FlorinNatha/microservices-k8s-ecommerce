#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HELM_DIR="${ROOT_DIR}/infrastructure/helm"

command -v helm >/dev/null 2>&1 || { echo "Error: Helm is required." >&2; exit 1; }

for chart in "${HELM_DIR}"/*; do
  if [[ -f "${chart}/Chart.yaml" ]]; then
    echo "Linting ${chart}..."
    helm lint "${chart}" --set-string image.tag=ci-validation --set-string secrets.jwtSecret=ci-validation --set-string secrets.stripeSecretKey=ci-validation --set-string secrets.grafanaAdminUser=ci-validation --set-string secrets.grafanaAdminPassword=ci-validation
    helm template "$(basename "${chart}")" "${chart}" --namespace ecommerce --set-string image.tag=ci-validation --set-string secrets.jwtSecret=ci-validation --set-string secrets.stripeSecretKey=ci-validation --set-string secrets.grafanaAdminUser=ci-validation --set-string secrets.grafanaAdminPassword=ci-validation >/dev/null
  fi
done

echo "All Helm charts passed lint and render validation."
