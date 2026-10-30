#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "=============================================="
echo " Minha Escala - ambiente de desenvolvimento"
echo "=============================================="
echo "[1/4] Verificando o Docker..."
if ! command -v docker >/dev/null 2>&1; then
  echo "[ERRO] Docker não foi encontrado no PATH."
  exit 1
fi

if ! timeout 15 docker info --format '{{.ServerVersion}}' >/dev/null 2>&1; then
  echo "[ERRO] Não foi possível conectar ao Docker em até 15 segundos."
  echo "[ERRO] Abra o Docker Desktop, aguarde ele iniciar e tente novamente."
  exit 1
fi

echo "[1/4] Docker está disponível."
echo "[2/4] Construindo a imagem da API e instalando dependências..."
echo "[3/4] Iniciando MySQL e aguardando o banco ficar saudável..."
echo "[4/4] Iniciando a API Node.js..."
echo ""

docker compose -f "$ROOT_DIR/docker/compose.yml" up --build "$@"
