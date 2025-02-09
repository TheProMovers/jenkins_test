# Node.js 환경에서 빌드
FROM node:20 AS builder

# 작업 디렉토리 설정
WORKDIR /app

# npm 레지스트리를 미러로 설정 (네트워크 최적화)
RUN npm config set registry https://registry.npmmirror.com

# 패키지 파일 복사 및 의존성 설치
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps || (echo "Retrying npm install" && sleep 5 && npm install --legacy-peer-deps)

# TypeScript 글로벌 설치
RUN npm install -g typescript || (echo "Retrying TypeScript installation" && sleep 5 && npm install -g typescript)

# 앱 코드 복사
COPY . .

# Vite 빌드 실행
RUN npm run build

# Nginx를 사용하여 정적 파일 제공
FROM nginx:latest

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 정적 파일을 Nginx 기본 경로로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
