const express = require('express');
const router = express.Router();
const verifyCache = require('../middleware/cache.middleware');
const {
    getAllTodos,
    getTodoById,
    createTodo,
    updateTodo,
    patchTodo,
    deleteTodo
} = require('../controllers/todo.controller');


// GET
router.get('/', verifyCache, getAllTodos);
router.get('/:id', verifyCache, getTodoById);

// POST
router.post('/', createTodo);

// PUT
router.put('/:id', updateTodo);

// PATCH
router.patch('/:id', patchTodo);

// DELETE
router.delete('/:id', deleteTodo);

module.exports = router;