const express = require('express');
const router = express.Router();

const {
    getAllTodos,
    getTodoById,
    createTodo,
    updateTodo,
    patchTodo,
    deleteTodo
} = require('../controllers/todo.controller');


// GET
router.get('/', getAllTodos);
router.get('/:id', getTodoById);

// POST
router.post('/', createTodo);

// PUT
router.put('/:id', updateTodo);

// PATCH
router.patch('/:id', patchTodo);

// DELETE
router.delete('/:id', deleteTodo);

module.exports = router;