import express from "express";
import mongoose from "mongoose";
import todo from "./models/todoSchema.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const connectingString = process.env.connectingString;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(connectingString)
  .then(() => console.log("Database connected successfully!"))
  .catch((err) => console.log("error: ", err.message));

app.get("/", (req, res) => {
  res.send("A simple todo app using Node.js, Express, and MongoDB");
});

// create todo
app.post("/addtodo", async (req, res) => {
  console.log("Request Body: ", req.body);
  try {
    const newTodo = await todo.create(req.body);
    console.log("New Todo: ", newTodo);
    res.json({
      message: "Todo added successfully!",
      data: newTodo,
    });
  } catch (error) {
    console.log("Error: ", error.message);
    res.json({
      message: error.message || "something went wrong!",
      data: null,
    });
  }
});

// get all todos
app.get("/alltodos", async (req, res) => {
  try {
    const userResponse = await todo.find();
    console.log("All todos: ", userResponse);

    res.json({
      message: "All todos fetched successfully!",
      data: userResponse,
    });
  } catch (error) {
    res.json({
      message: error.message || "something went wrong!",
      data: null,
    });
  }
});

//update todo
app.post("/updatetodo/:id", async (req, res) => {
  try {
    const updatedtodo = await todo.findByIdAndUpdate(req.params.id, req.body);
    console.log("Updated Todo: ", updatedtodo);
    res.json({
      message: "Todo updated successfully!",
      data: updatedtodo,
    });
  } catch (error) {
    res.json({
      message: error.message || "something went wrong!",
      data: null,
    });
  }
});

//delete todo
app.post("/deletetodo/:id", async (req, res) => {
  try {
    const deletedtodo = await todo.findByIdAndDelete(req.params.id);
    console.log("Deleted Todo: ", deletedtodo);
    res.json({
      message: "Todo deleted successfully!",
      data: deletedtodo,
    });
  } catch (error) {
    res.json({
      message: error.message || "something went wrong!",
      data: null,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
