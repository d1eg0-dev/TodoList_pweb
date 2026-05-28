const express = require('express');
const router = express.Router();
const fileController = require('../controllers/file.controller');

// Rutas para archivos
router.post('/upload', fileController.uploadFile);
router.get('/files', fileController.getFiles);
router.get('/download/:id', fileController.downloadFile);
router.delete('/files/:id', fileController.deleteFile);
router.get('/files/:id', fileController.getFileInfo);

module.exports = router;