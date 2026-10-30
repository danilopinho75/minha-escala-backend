#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "[Prisma] Aplicando migrations no banco de dados..."
docker compose -f "$ROOT_DIR/docker/compose.yml" exec api npx prisma migrate dev
echo "[Prisma] Migrations concluídas."
