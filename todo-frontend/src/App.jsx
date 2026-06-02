import { useEffect, useState } from 'react';
import axios from 'axios';
import FileManager from './components/FileManager';

// Configurar axios para enviar cookies con cada petición
axios.defaults.withCredentials = true;

function App() {

  // ========== ESTADOS PARA AUTENTICACIÓN ==========
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // ========== ESTADOS ORIGINALES ==========
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [metadata, setMetadata] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('todos');

  const API_URL = 'http://localhost:3000/api/todos';
  const AUTH_URL = 'http://localhost:3000/auth';

  // =========================
  // VERIFICAR SI EL USUARIO ESTÁ LOGUEADO
  // =========================
  const checkAuth = async () => {
    try {
      const response = await axios.get(`${AUTH_URL}/current-user`, {
        withCredentials: true
      });
      if (response.data.isAuthenticated) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  // =========================
  // INICIAR SESIÓN CON GOOGLE
  // =========================
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  // =========================
  // CERRAR SESIÓN
  // =========================
  const handleLogout = async () => {
    try {
      await axios.get(`${AUTH_URL}/logout`, {
        withCredentials: true
      });
      setIsAuthenticated(false);
      setUser(null);
      setTodos([]);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // =========================
  // Obtener tareas (SOLO SI ESTÁ AUTENTICADO)
  // =========================
  const getTodos = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await axios.get(API_URL, {
        withCredentials: true  // ← IMPORTANTE
      });
      console.log(response.data);
      setTodos(response.data.data);
      setMetadata(response.data.metadata);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Crear tarea
  // =========================
  const createTodo = async () => {
    if (!title.trim()) return;
    if (!isAuthenticated) return;

    try {
      await axios.post(API_URL, {
        title,
        completed: false
      }, {
        withCredentials: true  // ← IMPORTANTE
      });
      setTitle('');
      getTodos();
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // Eliminar tarea
  // =========================
  const deleteTodo = async (id) => {
    if (!isAuthenticated) return;
    
    try {
      await axios.delete(`${API_URL}/${id}`, {
        withCredentials: true  // ← IMPORTANTE
      });
      getTodos();
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // Cargar al iniciar
  // =========================
  useEffect(() => {
    checkAuth();
  }, []);

  // Cuando cambia la autenticación, cargar tareas
  useEffect(() => {
    if (isAuthenticated) {
      getTodos();
    }
  }, [isAuthenticated]);

  // Si está cargando la autenticación, mostrar loading
  if (authLoading) {
    return (
      <div style={styles.loadingContainer}>
        <h2>Verificando sesión...</h2>
      </div>
    );
  }

  // Si NO está autenticado, mostrar pantalla de LOGIN
  if (!isAuthenticated) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <h1 style={styles.loginTitle}>📋 Todo App</h1>
          <p style={styles.loginSubtitle}>Gestiona tus tareas y archivos</p>
          <button onClick={handleGoogleLogin} style={styles.googleButton}>
            <svg style={styles.googleIcon} viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Iniciar sesión con Google
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // SI ESTÁ AUTENTICADO, MOSTRAR LA APLICACIÓN COMPLETA
  // =========================
  return (
    <div style={styles.container}>

      {/* Header con información del usuario */}
      <div style={styles.userHeader}>
        <div style={styles.userInfo}>
          {user?.photo && <img src={user.photo} alt={user.displayName} style={styles.userAvatar} />}
          <div>
            <span style={styles.userName}>👋 Hola, {user?.displayName}!</span>
            <small style={styles.userEmail}>{user?.email}</small>
          </div>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Cerrar sesión
        </button>
      </div>

      <h1>Todo List React + Express</h1>

      {/* Pestañas de navegación */}
      <div style={styles.tabs}>
        <button
          style={activeTab === 'todos' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('todos')}
        >
          📝 Mis Tareas
        </button>
        <button
          style={activeTab === 'files' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('files')}
        >
          📁 Mis Archivos
        </button>
      </div>

      {/* Contenido según pestaña activa */}
      {activeTab === 'todos' ? (
        <>
          {/* Metadata */}
          <div style={styles.metadata}>
            <p><strong>Total:</strong> {metadata.total}</p>
            <p><strong>Página:</strong> {metadata.currentPage}</p>
            <p><strong>API Version:</strong> {metadata.version}</p>
          </div>

          {/* Formulario */}
          <div style={styles.form}>
            <input
              type="text"
              placeholder="Nueva tarea"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createTodo()}
              style={styles.input}
            />
            <button onClick={createTodo} style={styles.button}>
              Crear
            </button>
          </div>

          {/* Loading */}
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <ul style={styles.list}>
              {todos.map(todo => (
                <li key={todo._id} style={styles.item}>
                  <div>
                    <h3>{todo.title}</h3>
                    <p>Estado: {todo.completed ? ' ✅' : ' ❌'}</p>
                  </div>
                  <button onClick={() => deleteTodo(todo._id)} style={styles.deleteButton}>
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <FileManager />
      )}
    </div>
  );
}

// =========================
// ESTILOS
// =========================
const styles = {
  loginContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  loginCard: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '90%'
  },
  loginTitle: {
    color: '#333',
    marginBottom: '10px',
    fontSize: '28px'
  },
  loginSubtitle: {
    color: '#666',
    marginBottom: '30px'
  },
  googleButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    backgroundColor: 'white',
    color: '#757575',
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '12px 24px',
    fontSize: '16px',
    cursor: 'pointer',
    width: '100%'
  },
  googleIcon: {
    width: '20px',
    height: '20px'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    textAlign: 'center'
  },
  userHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '15px 20px',
    backgroundColor: '#e8f0fe',
    borderRadius: '10px'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  userAvatar: {
    width: '45px',
    height: '45px',
    borderRadius: '50%'
  },
  userName: {
    fontSize: '16px',
    fontWeight: 'bold',
    display: 'block'
  },
  userEmail: {
    fontSize: '12px',
    color: '#666',
    display: 'block'
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  container: {
    maxWidth: '900px',
    margin: '40px auto',
    fontFamily: 'Arial'
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    borderBottom: '2px solid #e0e0e0',
    paddingBottom: '10px'
  },
  tab: {
    padding: '10px 20px',
    fontSize: '16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'all 0.3s'
  },
  tabActive: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px'
  },
  metadata: {
    background: '#f4f4f4',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-around'
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  input: {
    flex: 1,
    padding: '10px'
  },
  button: {
    padding: '10px 20px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px'
  },
  list: {
    listStyle: 'none',
    padding: 0
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    marginBottom: '10px'
  },
  deleteButton: {
    background: 'red',
    color: 'white',
    border: 'none',
    padding: '10px',
    cursor: 'pointer',
    borderRadius: '5px'
  }
};

export default App;