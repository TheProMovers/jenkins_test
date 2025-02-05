import { Todo } from "../types/todo";
import { useTodoStore } from "../stores/todoStore";
import { motion } from "framer-motion";

interface Props {
  todo: Todo;
}

const TodoItem: React.FC<Props> = ({ todo }) => {
  const { toggleTodo, removeTodo } = useTodoStore();

  return (
    <motion.li
      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md transition hover:bg-gray-100 dark:hover:bg-gray-700"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      layout
    >
      <div className="flex items-center space-x-3">
        <motion.input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo._id, !todo.completed)}
          className="w-6 h-6 text-primary border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
          whileTap={{ scale: 0.9 }}
        />
        <motion.span
          className={`text-lg font-medium ${
            todo.completed ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-darkText"
          }`}
          whileHover={{ scale: 1.05 }}
        >
          {todo.title}
        </motion.span>
      </div>
      <motion.button
        onClick={() => removeTodo(todo._id)}
        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
        whileTap={{ scale: 0.9 }}
      >
        삭제
      </motion.button>
    </motion.li>
  );
};

export default TodoItem;
