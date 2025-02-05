import { useState } from "react";
import { useTodoStore } from "../stores/todoStore";
import { motion } from "framer-motion";

const AddTodo = () => {
  const [title, setTitle] = useState("");
  const { createTodo } = useTodoStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createTodo(title);
    setTitle("");
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-900 shadow-lg rounded-xl"
    >
      <motion.input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="할 일을 입력하세요..."
        className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 
                   text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
        whileFocus={{ scale: 1.05, borderColor: "#3b82f6" }} // 포커스 시 커짐
      />
      <motion.button
        type="submit"
        className="px-5 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        추가
      </motion.button>
    </motion.form>
  );
};

export default AddTodo;
