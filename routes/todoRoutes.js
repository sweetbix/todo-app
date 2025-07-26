const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const auth = require("../middleware/auth");

router.use(auth);

// GET all todos
router.get("/", async (req, res) => {
    try {
        const query = { userId: req.user.id };

        const todos = await Todo.find(query)
            .lean();

        res.json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch todos" });
    }
});

// POST new todo
router.post("/", async (req, res) => {
    const newTodo = new Todo({ text: req.body.text, userId: req.user.id });
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
});

// PUT update todo
router.put("/:id", async (req, res) => {
    try {
        const updated = await Todo.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id},
            req.body,
            {new: true}
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error : "Update failed"})
    }
});

// DELETE a todo
router.delete("/:id", async (req, res) => {
    const deleted = await Todo.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id
        });
    res.json(deleted);
});

// DELETE all todos
router.delete("/", async (req, res) => {
    try {
        const result = await Todo.deleteMany({ userId: req.user.id });
        res.status(200).json({ message : "All tasks deleted.", deleted: result.deletedCount });
    } catch (err) {
        res.status(500).json({ message : "Error clearing tasks", error: err});
    }
})

module.exports = router;