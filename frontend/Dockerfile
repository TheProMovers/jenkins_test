# Node.js 환경에서 빌드
FROM node:18 AS builder

WORKDIR /app

# 패키지 설치
COPY package.json package-lock.json ./
RUN npm install

# 앱 코드 복사
COPY . .

# Vite 빌드 실행
RUN npm run build

# Nginx를 사용하여 정적 파일 제공
FROM nginx:latest

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 정적 파일을 Nginx의 기본 경로로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
