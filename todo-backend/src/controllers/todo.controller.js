const Todo = require('../models/todo.model');
const { cache } = require('../middleware/cache.middleware');


// GET /api/todos
const getAllTodos = async (req, res, next) => {

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

        // Headers personalizados
        res.header('API-Version', '1.0');
        res.header('Author', 'Diego Mirabal');
        res.header('Cache-Control', 'no-cache');

        res.status(200).json({

            metadata: {

                version: '1.0',

                status: 200,

                author: 'Diego Mirabal',

                method: req.method,

                endpoint: req.originalUrl,

                timestamp: new Date(),

                total,

                totalPages,

                currentPage: page,

                limit

            },

            data: todos,

            links: {

                self: `/api/todos?page=${page}&limit=${limit}`,

                create: '/api/todos',

                docs: '/api/docs',

                home: '/',

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

        next(error);

    }

};


// GET /api/todos/:id
const getTodoById = async (req, res, next) => {

    try {

        const todo = await Todo.findById(req.params.id);

        if (!todo) {

            const err = new Error('Tarea no encontrada');

            err.status = 404;

            return next(err);

        }

        res.header('API-Version', '1.0');
        res.header('Author', 'Diego Mirabal');

        res.status(200).json({

            metadata: {

                version: '1.0',

                status: 200,

                author: 'Diego Mirabal',

                method: req.method,

                endpoint: req.originalUrl,

                timestamp: new Date()

            },

            data: todo,

            links: {

                self: `/api/todos/${todo._id}`,

                all: '/api/todos',

                update: `/api/todos/${todo._id}`,

                patch: `/api/todos/${todo._id}`,

                delete: `/api/todos/${todo._id}`,

                home: '/',

                docs: '/api/docs'

            }

        });

    } catch (error) {

        next(error);

    }

};


// POST /api/todos
const createTodo = async (req, res, next) => {

    try {

        const { title, completed } = req.body;

        if (!title) {

            const err = new Error('El título es obligatorio');

            err.status = 400;

            return next(err);

        }

        const newTodo = new Todo({
            title,
            completed: completed || false
        });

        await newTodo.save();

        // Limpiar cache
        cache.flushAll();

        res.header('API-Version', '1.0');
        res.header('Author', 'Diego Mirabal');

        res.status(201).json({

            metadata: {

                version: '1.0',

                status: 201,

                author: 'Diego Mirabal',

                method: req.method,

                endpoint: req.originalUrl,

                timestamp: new Date(),

                message: 'Tarea creada correctamente',

                createdAt: newTodo.createdAt

            },

            data: newTodo,

            links: {

                self: `/api/todos/${newTodo._id}`,

                all: '/api/todos',

                update: `/api/todos/${newTodo._id}`,

                patch: `/api/todos/${newTodo._id}`,

                delete: `/api/todos/${newTodo._id}`,

                home: '/',

                docs: '/api/docs'

            }

        });

    } catch (error) {

        next(error);

    }

};


// PUT /api/todos/:id
const updateTodo = async (req, res, next) => {

    try {

        const { title, completed } = req.body;

        // Validar PUT completo
        if (title === undefined || completed === undefined) {

            const err = new Error('PUT requiere title y completed');

            err.status = 400;

            return next(err);

        }

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

        // Limpiar cache
        cache.flushAll();

        if (!todo) {

            const err = new Error('Tarea no encontrada');

            err.status = 404;

            return next(err);

        }

        res.header('API-Version', '1.0');
        res.header('Author', 'Diego Mirabal');

        res.status(200).json({

            metadata: {

                version: '1.0',

                status: 200,

                author: 'Diego Mirabal',

                method: req.method,

                endpoint: req.originalUrl,

                timestamp: new Date(),

                message: 'Tarea actualizada'

            },

            data: todo,

            links: {

                self: `/api/todos/${todo._id}`,

                all: '/api/todos',

                patch: `/api/todos/${todo._id}`,

                delete: `/api/todos/${todo._id}`,

                home: '/'

            }

        });

    } catch (error) {

        next(error);

    }

};


// PATCH /api/todos/:id
const patchTodo = async (req, res, next) => {

    try {

        const todo = await Todo.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            }
        );

        // Limpiar cache
        cache.flushAll();

        if (!todo) {

            const err = new Error('Tarea no encontrada');

            err.status = 404;

            return next(err);

        }

        res.header('API-Version', '1.0');
        res.header('Author', 'Diego Mirabal');

        res.status(200).json({

            metadata: {

                version: '1.0',

                status: 200,

                author: 'Diego Mirabal',

                method: req.method,

                endpoint: req.originalUrl,

                timestamp: new Date(),

                message: 'Tarea modificada'

            },

            data: todo,

            links: {

                self: `/api/todos/${todo._id}`,

                all: '/api/todos',

                update: `/api/todos/${todo._id}`,

                delete: `/api/todos/${todo._id}`,

                home: '/'

            }

        });

    } catch (error) {

        next(error);

    }

};


// DELETE /api/todos/:id
const deleteTodo = async (req, res, next) => {

    try {

        const todo = await Todo.findByIdAndDelete(req.params.id);

        // Limpiar cache
        cache.flushAll();

        if (!todo) {

            const err = new Error('Tarea no encontrada');

            err.status = 404;

            return next(err);

        }

        res.header('API-Version', '1.0');
        res.header('Author', 'Diego Mirabal');

        res.status(200).json({

            metadata: {

                version: '1.0',

                status: 200,

                author: 'Diego Mirabal',

                method: req.method,

                endpoint: req.originalUrl,

                timestamp: new Date(),

                message: 'Tarea eliminada'

            },

            links: {

                all: '/api/todos',

                create: '/api/todos',

                home: '/'

            }

        });

    } catch (error) {

        next(error);

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