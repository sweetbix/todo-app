const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");

// GET all todos
router.get("/", async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

// POST new todo
router.post("/", async (req, res) => {
    const newTodo = new Todo({ text: req.body.text });
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
})

// PUT update todo
router.put("/:id", async (req, res) => {
    const updated = await Todo.findByIdAndUpdate(
        req.params.id,
        {completed: true},
        {new: true}
    );
    res.json(updated);
});

// DELETE a todo
router.delete("/:id", async (req, res) => {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    res.json(deleted);
});

module.exports = router;