# Node.js 환경에서 빌드
FROM node:20 AS builder

WORKDIR /app

# NPM 레지스트리 미러 설정 및 패키지 설치
COPY package.json package-lock.json ./
RUN npm config set registry https://registry.npmmirror.com && \
    npm install --legacy-peer-deps

# 앱 코드 복사
COPY . .

# Vite 빌드 실행
RUN npx tsc -b && npm run build

# Nginx를 사용하여 정적 파일 제공
FROM nginx:latest

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 정적 파일을 Nginx의 기본 경로로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
