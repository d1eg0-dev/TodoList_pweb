const Todo = require('../models/todo.model');


// GET /todos
const getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// GET /todos/:id
const getTodoById = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({
                message: 'Tarea no encontrada'
            });
        }

        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// POST /todos
const createTodo = async (req, res) => {
    try {
        const { title, completed } = req.body;

        if (!title) {
            return res.status(400).json({
                message: 'El título es obligatorio'
            });
        }

        const newTodo = new Todo({
            title,
            completed: completed || false
        });

        await newTodo.save();

        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// PUT /todos/:id
const updateTodo = async (req, res) => {
    try {
        const { title, completed } = req.body;

        const todo = await Todo.findByIdAndUpdate(
            req.params.id,
            { title, completed },
            { new: true }
        );

        if (!todo) {
            return res.status(404).json({
                message: 'No existe'
            });
        }

        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// PATCH /todos/:id
const patchTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!todo) {
            return res.status(404).json({
                message: 'No existe'
            });
        }

        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// DELETE /todos/:id
const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);

        if (!todo) {
            return res.status(404).json({
                message: 'No encontrado'
            });
        }

        res.json({
            message: 'Tarea eliminada'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getAllTodos,
    getTodoById,
    createTodo,
    updateTodo,
    patchTodo,
    deleteTodo
};