#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "[Docker] Parando os containers do ambiente de desenvolvimento..."
docker compose -f "$ROOT_DIR/docker/compose.yml" down
echo "[Docker] Ambiente finalizado."
