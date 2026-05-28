const File = require('../models/file.model');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configurar directorio de uploads
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Subir archivo - VERSIÓN DEFINITIVA
const uploadFile = async (req, res) => {
    try {
        console.log('=== INICIO SUBIDA DE ARCHIVO ===');
        console.log('Files recibidos:', req.files);
        
        // Verificar si hay archivos
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: 'No se subió ningún archivo' });
        }

        // Obtener el primer archivo (cualquiera sea su key)
        const fileKey = Object.keys(req.files)[0];
        const file = req.files[fileKey];
        
        // Manejar description de forma segura (req.body podría ser undefined)
        let description = '';
        if (req.body && typeof req.body === 'object') {
            description = req.body.description || req.body.descripcion || '';
        }
        
        console.log('Descripción obtenida:', description);
        console.log('Archivo:', {
            key: fileKey,
            name: file.name,
            size: file.size,
            mimetype: file.mimetype
        });
        
        // Validar tamaño máximo (50MB)
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            return res.status(400).json({ error: 'El archivo excede 50MB' });
        }

        // Verificar que existe el directorio uploads
        const uploadDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generar nombre único
        const fileExtension = path.extname(file.name);
        const uniqueFileName = `${uuidv4()}${fileExtension}`;
        const uploadPath = path.join(uploadDir, uniqueFileName);

        // Mover archivo
        await file.mv(uploadPath);
        console.log('Archivo movido exitosamente');

        // Guardar en MongoDB
        const newFile = new File({
            filename: uniqueFileName,
            originalName: file.name,
            fileType: file.mimetype,
            fileSize: file.size,
            filePath: uploadPath,
            description: description
        });

        await newFile.save();
        console.log('Archivo guardado en MongoDB con ID:', newFile._id);

        res.status(201).json({
            message: 'Archivo subido exitosamente',
            file: {
                id: newFile._id,
                name: newFile.originalName,
                type: newFile.fileType,
                size: newFile.fileSize,
                description: newFile.description
            }
        });
    } catch (error) {
        console.error('ERROR DETALLADO:', error);
        res.status(500).json({ 
            error: 'Error al subir el archivo',
            details: error.message 
        });
    }
};

// Obtener todos los archivos
const getFiles = async (req, res) => {
    try {
        const files = await File.find().sort({ createdAt: -1 });
        res.json(files);
    } catch (error) {
        console.error('Error al obtener archivos:', error);
        res.status(500).json({ error: 'Error al obtener los archivos' });
    }
};

// Descargar archivo
const downloadFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        
        if (!file) {
            return res.status(404).json({ error: 'Archivo no encontrado' });
        }

        // Incrementar contador de descargas
        file.downloads += 1;
        await file.save();

        // Verificar si el archivo existe físicamente
        if (!fs.existsSync(file.filePath)) {
            return res.status(404).json({ error: 'Archivo físico no encontrado' });
        }

        // Enviar archivo
        res.download(file.filePath, file.originalName);
    } catch (error) {
        console.error('Error al descargar archivo:', error);
        res.status(500).json({ error: 'Error al descargar el archivo' });
    }
};

// Eliminar archivo
const deleteFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        
        if (!file) {
            return res.status(404).json({ error: 'Archivo no encontrado' });
        }

        // Eliminar archivo físico
        if (fs.existsSync(file.filePath)) {
            fs.unlinkSync(file.filePath);
        }

        // Eliminar registro de MongoDB
        await file.deleteOne();

        res.json({ message: 'Archivo eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar archivo:', error);
        res.status(500).json({ error: 'Error al eliminar el archivo' });
    }
};

// Obtener información de un archivo
const getFileInfo = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        
        if (!file) {
            return res.status(404).json({ error: 'Archivo no encontrado' });
        }

        res.json(file);
    } catch (error) {
        console.error('Error al obtener información:', error);
        res.status(500).json({ error: 'Error al obtener información del archivo' });
    }
};

module.exports = {
    uploadFile,
    getFiles,
    downloadFile,
    deleteFile,
    getFileInfo
};