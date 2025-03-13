import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false }
});

const todo = mongoose.model("todo", todoSchema);

export default todo;

