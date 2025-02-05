import { create } from "zustand";
import { Todo } from "../types/todo";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "../apis/todoApi";

interface TodoStore {
  todos: Todo[];
  filter: "all" | "active" | "completed";
  sortOrder: "newest" | "oldest"; // ✅ 정렬 추가
  setFilter: (filter: "all" | "active" | "completed") => void;
  setSortOrder: (order: "newest" | "oldest") => void; // ✅ 정렬 변경 함수 추가
  loadTodos: () => Promise<void>;
  createTodo: (title: string) => Promise<void>;
  toggleTodo: (id: string, completed: boolean) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
  editTodo: (id: string, title: string) => Promise<void>;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  filter: "all",
  sortOrder: "newest", // ✅ 기본 정렬은 최신순

  setFilter: (filter) => set({ filter }),
  setSortOrder: (order) => set({ sortOrder: order }), // ✅ 정렬 변경 로직 추가

  loadTodos: async () => {
    const todos = await fetchTodos();
    set({ todos });
  },

  createTodo: async (title) => {
    const newTodo = await addTodo(title);
    set((state) => ({ todos: [...state.todos, newTodo] }));
  },

  toggleTodo: async (id, completed) => {
    const updatedTodo = await updateTodo(id, { completed });
    set((state) => ({
      todos: state.todos.map((todo) => (todo._id === id ? updatedTodo : todo)),
    }));
  },

  removeTodo: async (id) => {
    await deleteTodo(id);
    set((state) => ({ todos: state.todos.filter((todo) => todo._id !== id) }));
  },

  editTodo: async (id, title) => {
    const updatedTodo = await updateTodo(id, { title });
    set((state) => ({
      todos: state.todos.map((todo) => (todo._id === id ? updatedTodo : todo)),
    }));
  },
}));
