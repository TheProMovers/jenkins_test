const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Todo API is running...");
});

// 라우터 추가
const todoRoutes = require("./routes/todoRoutes");
app.use("/api/todos", todoRoutes);

module.exports = app;