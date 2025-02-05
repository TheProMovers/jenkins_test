import useTheme from "./stores/themeStore";
import TodoList from "./components/TodoList";
import AddTodo from "./components/AddTodo";
import DarkModeToggle from "./components/DarkModeToggle";
import { useEffect } from "react";

function App() {
  const { theme } = useTheme();

  // 다크 모드 상태를 body 태그에 적용
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-100 dark:bg-gray-900">
      <div className="relative w-full max-w-md p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
        <DarkModeToggle />
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">📌 Todo List</h1>
        <AddTodo />
        <TodoList />
      </div>
    </div>
  );
}

export default App;
