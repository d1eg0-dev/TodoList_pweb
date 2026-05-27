const express = require('express');

const router = express.Router();


// Importar cache middleware
const { cacheMiddleware } = require('../middleware/cache.middleware');


// Importar controllers
const {
    getAllTodos,
    getTodoById,
    createTodo,
    updateTodo,
    patchTodo,
    deleteTodo
} = require('../controllers/todo.controller');


// =========================
// GET
// =========================

// Lista con cache
router.get(
    '/',
    cacheMiddleware,
    getAllTodos
);

// Buscar por id con cache
router.get(
    '/:id',
    cacheMiddleware,
    getTodoById
);


// =========================
// POST
// =========================

router.post(
    '/',
    createTodo
);


// =========================
// PUT
// =========================

router.put(
    '/:id',
    updateTodo
);


// =========================
// PATCH
// =========================

router.patch(
    '/:id',
    patchTodo
);


// =========================
// DELETE
// =========================

router.delete(
    '/:id',
    deleteTodo
);


module.exports = router;