# Node.js 최신 LTS 버전 사용
FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 매니저 파일 복사 및 패키지 설치
COPY package.json package-lock.json ./
RUN npm install

# 앱 코드 복사
COPY . .

# 환경 변수 설정
ENV PORT=5000
ENV MONGO_URI=mongodb://admin:password@mongo:27017/todoapp?authSource=admin

# 서버 실행
CMD ["npm", "run", "dev"]