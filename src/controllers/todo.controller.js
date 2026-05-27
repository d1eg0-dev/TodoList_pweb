const Todo = require('../models/todo.model');


// GET /api/todos
const getAllTodos = async (req, res) => {

    try {

        const todos = await Todo.find();

        // Header personalizado
        res.header('API-Version', '1.0');

        res.status(200).json({

            metadata: {
                total: todos.length,
                version: '1.0',
                author: 'Diego'
            },

            data: todos,

            links: {
                self: '/api/todos'
            }

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// GET /api/todos/:id
const getTodoById = async (req, res) => {

    try {

        const todo = await Todo.findById(req.params.id);

        if (!todo) {

            return res.status(404).json({
                message: 'Tarea no encontrada'
            });

        }

        res.status(200).json({

            metadata: {
                version: '1.0'
            },

            data: todo,

            links: {
                self: `/api/todos/${todo._id}`,
                all: '/api/todos'
            }

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// POST /api/todos
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

        res.status(201).json({

            metadata: {
                message: 'Tarea creada correctamente'
            },

            data: newTodo,

            links: {
                self: `/api/todos/${newTodo._id}`,
                all: '/api/todos'
            }

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// PUT /api/todos/:id
const updateTodo = async (req, res) => {

    try {

        const { title, completed } = req.body;

        const todo = await Todo.findByIdAndUpdate(
            req.params.id,
            {
                title,
                completed
            },
            {
                new: true
            }
        );

        if (!todo) {

            return res.status(404).json({
                message: 'No existe'
            });

        }

        res.status(200).json({

            metadata: {
                message: 'Tarea actualizada'
            },

            data: todo,

            links: {
                self: `/api/todos/${todo._id}`
            }

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// PATCH /api/todos/:id
const patchTodo = async (req, res) => {

    try {

        const todo = await Todo.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            }
        );

        if (!todo) {

            return res.status(404).json({
                message: 'No existe'
            });

        }

        res.status(200).json({

            metadata: {
                message: 'Tarea modificada'
            },

            data: todo,

            links: {
                self: `/api/todos/${todo._id}`
            }

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// DELETE /api/todos/:id
const deleteTodo = async (req, res) => {

    try {

        const todo = await Todo.findByIdAndDelete(req.params.id);

        if (!todo) {

            return res.status(404).json({
                message: 'No encontrado'
            });

        }

        res.status(200).json({

            metadata: {
                message: 'Tarea eliminada'
            },

            links: {
                all: '/api/todos'
            }

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

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