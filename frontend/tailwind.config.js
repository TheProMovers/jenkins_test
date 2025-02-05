/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6", // 기본 블루 컬러
        darkBg: "#1e293b",
        darkText: "#e2e8f0"
      }
    }
  },
  darkMode: "class", // 다크 모드 지원
  plugins: []
};

