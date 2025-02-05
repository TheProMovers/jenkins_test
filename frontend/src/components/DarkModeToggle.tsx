import useTheme  from "../stores/themeStore";
import { motion } from "framer-motion";

const DarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="absolute top-4 right-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow-md transition"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9, rotate: 15 }}
      animate={{ rotate: theme === "dark" ? 180 : 0 }}
    >
      {theme === "dark" ? "🌞" : "🌙"}
    </motion.button>
  );
};

export default DarkModeToggle;