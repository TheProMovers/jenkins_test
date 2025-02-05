db = db.getSiblingDB("todoapp"); // 사용할 데이터베이스

db.createCollection("todos");
db.todos.insertMany([
  { title: "쿠버네티스 배포 준비", completed: false, createdAt: new Date() },
  { title: "Docker 설정 마무리", completed: false, createdAt: new Date() }
]);

print("✅ 초기 데이터 삽입 완료!");