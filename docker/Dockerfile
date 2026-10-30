FROM node:24-bookworm

WORKDIR /app

COPY package*.json ./
RUN echo "[1/2] Instalando dependencias do Node.js..." && npm ci && echo "[1/2] Dependencias instaladas com sucesso."

COPY . .

RUN echo "[2/2] Imagem da API preparada."

EXPOSE 3333

CMD ["npm", "run", "dev"]
