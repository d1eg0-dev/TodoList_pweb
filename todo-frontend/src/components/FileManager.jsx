import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/files';

const FileManager = () => {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        try {
            const response = await axios.get(`${API_URL}/files`);
            setFiles(response.data);
        } catch (error) {
            console.error('Error al cargar archivos:', error);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Selecciona un archivo primero');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('description', description);

        setLoading(true);
        try {
            await axios.post(`${API_URL}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Archivo subido exitosamente');
            setSelectedFile(null);
            setDescription('');
            loadFiles();
            // Resetear el input file
            document.getElementById('fileInput').value = '';
        } catch (error) {
            console.error('Error al subir:', error);
            alert('Error al subir el archivo');
        }
        setLoading(false);
    };

    const handleDownload = async (fileId, fileName) => {
        try {
            const response = await axios.get(`${API_URL}/download/${fileId}`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al descargar:', error);
            alert('Error al descargar el archivo');
        }
    };

    const handleDelete = async (fileId) => {
        if (window.confirm('¿Estás seguro de eliminar este archivo?')) {
            try {
                await axios.delete(`${API_URL}/files/${fileId}`);
                alert('Archivo eliminado');
                loadFiles();
            } catch (error) {
                console.error('Error al eliminar:', error);
                alert('Error al eliminar el archivo');
            }
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const styles = {
        container: {
            padding: '20px'
        },
        uploadArea: {
            marginBottom: '30px',
            padding: '20px',
            border: '2px dashed #ccc',
            borderRadius: '10px',
            backgroundColor: '#f9f9f9'
        },
        title: {
            marginBottom: '15px',
            color: '#333'
        },
        input: {
            padding: '10px',
            marginRight: '10px',
            marginBottom: '10px'
        },
        textarea: {
            width: '100%',
            maxWidth: '400px',
            padding: '10px',
            marginTop: '10px',
            marginBottom: '10px'
        },
        button: {
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
        },
        buttonDisabled: {
            padding: '10px 20px',
            backgroundColor: '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'not-allowed'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px'
        },
        th: {
            textAlign: 'left',
            padding: '12px',
            backgroundColor: '#f2f2f2',
            borderBottom: '2px solid #ddd'
        },
        td: {
            textAlign: 'left',
            padding: '12px',
            borderBottom: '1px solid #ddd'
        },
        downloadBtn: {
            padding: '5px 10px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            marginRight: '5px'
        },
        deleteBtn: {
            padding: '5px 10px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
        },
        emptyMessage: {
            textAlign: 'center',
            padding: '40px',
            color: '#666'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.uploadArea}>
                <h3 style={styles.title}>📤 Subir archivo</h3>
                <input
                    id="fileInput"
                    type="file"
                    onChange={handleFileChange}
                    disabled={loading}
                    style={styles.input}
                />
                <br />
                <textarea
                    placeholder="Descripción (opcional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={styles.textarea}
                    rows="3"
                    disabled={loading}
                />
                <br />
                <button
                    onClick={handleUpload}
                    disabled={loading}
                    style={loading ? styles.buttonDisabled : styles.button}
                >
                    {loading ? 'Subiendo...' : 'Subir archivo'}
                </button>
            </div>

            <h3 style={styles.title}>📁 Mis archivos ({files.length})</h3>
            
            {files.length === 0 ? (
                <div style={styles.emptyMessage}>
                    <p>No hay archivos subidos</p>
                    <p>Sube tu primer archivo usando el formulario de arriba</p>
                </div>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Nombre</th>
                            <th style={styles.th}>Tamaño</th>
                            <th style={styles.th}>Descargas</th>
                            <th style={styles.th}>Fecha</th>
                            <th style={styles.th}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map(file => (
                            <tr key={file._id}>
                                <td style={styles.td}>
                                    <strong>{file.originalName}</strong>
                                    {file.description && (
                                        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                            📝 {file.description}
                                        </div>
                                    )}
                                </td>
                                <td style={styles.td}>{formatFileSize(file.fileSize)}</td>
                                <td style={styles.td}>⬇️ {file.downloads}</td>
                                <td style={styles.td}>{formatDate(file.createdAt)}</td>
                                <td style={styles.td}>
                                    <button
                                        onClick={() => handleDownload(file._id, file.originalName)}
                                        style={styles.downloadBtn}
                                    >
                                        Descargar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(file._id)}
                                        style={styles.deleteBtn}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default FileManager;