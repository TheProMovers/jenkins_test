const Todo = require("../models/Todo");

// 1️⃣ 모든 할 일 조회
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "서버 오류" });
  }
};

// 2️⃣ 특정 할 일 조회
const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "할 일을 찾을 수 없음" });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: "서버 오류" });
  }
};

// 3️⃣ 할 일 추가
const createTodo = async (req, res) => {
  try {
    const { title } = req.body;
    const newTodo = new Todo({ title });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: "서버 오류" });
  }
};

// 4️⃣ 할 일 수정
const updateTodo = async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTodo) return res.status(404).json({ message: "할 일을 찾을 수 없음" });
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "서버 오류" });
  }
};

// 5️⃣ 할 일 삭제
const deleteTodo = async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) return res.status(404).json({ message: "할 일을 찾을 수 없음" });
    res.json({ message: "할 일이 삭제되었습니다" });
  } catch (error) {
    res.status(500).json({ message: "서버 오류" });
  }
};

module.exports = { getTodos, getTodoById, createTodo, updateTodo, deleteTodo };
