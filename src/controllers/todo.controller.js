const Todo = require('../models/todo.model');
const { cache } = require('../middleware/cache.middleware');


// GET /api/todos
const getAllTodos = async (req, res) => {

    try {

        // Página actual
        const page = parseInt(req.query.page) || 1;

        // Cantidad por página
        const limit = parseInt(req.query.limit) || 5;

        // Cuántos documentos saltar
        const skip = (page - 1) * limit;

        // Obtener tareas paginadas
        const todos = await Todo.find()
            .skip(skip)
            .limit(limit);

        // Total de tareas
        const total = await Todo.countDocuments();

        // Total de páginas
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({

            metadata: {
                total,
                totalPages,
                currentPage: page,
                limit
            },

            data: todos,

            links: {

                self: `/api/todos?page=${page}&limit=${limit}`,

                next:
                    page < totalPages
                        ? `/api/todos?page=${page + 1}&limit=${limit}`
                        : null,

                prev:
                    page > 1
                        ? `/api/todos?page=${page - 1}&limit=${limit}`
                        : null
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
        cache.flushAll();

        res.status(201).json({

            metadata: {
                message: 'Tarea creada correctamente',
                createdAt: newTodo.createdAt
            },

            data: newTodo,

            links: {

                self: `/api/todos/${newTodo._id}`,

                all: '/api/todos',

                update: `/api/todos/${newTodo._id}`,

                patch: `/api/todos/${newTodo._id}`,

                delete: `/api/todos/${newTodo._id}`

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

        cache.flushAll();

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

        cache.flushAll();

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
        cache.flushAll();

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