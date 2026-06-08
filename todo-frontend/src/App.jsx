import { useEffect, useState } from 'react';
import axios from 'axios';
import FileManager from './components/FileManager';

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('todos');

  // URLs con HTTPS
  const API_URL = 'https://localhost:3000/api/todos';
  const AUTH_URL = 'https://localhost:3000/auth';

  // =========================
  // VERIFICAR SI EL USUARIO ESTÁ LOGUEADO
  // =========================
  const checkAuth = async () => {

    try {

      // Primero revisa login local
      let response = await axios.get(
        'https://localhost:3000/demo/current-user',
        {
          withCredentials: true
        }
      );

      if (response.data.isAuthenticated) {

        setUser(response.data.user);
        setIsAuthenticated(true);
        return;

      }

      // Si no hay login local, revisa Google
      response = await axios.get(
        `${AUTH_URL}/current-user`,
        {
          withCredentials: true
        }
      );

      if (response.data.isAuthenticated) {

        setUser(response.data.user);
        setIsAuthenticated(true);

      } else {

        setUser(null);
        setIsAuthenticated(false);

      }

    } catch (error) {

      console.error(error);
      setUser(null);
      setIsAuthenticated(false);

    } finally {

      setAuthLoading(false);

    }

  };

  // =========================
  // INICIAR SESIÓN CON GOOGLE
  // =========================
  const handleGoogleLogin = () => {
    window.location.href = 'https://localhost:3000/auth/google';
  };
  const handleDocenteLogin = async () => {

    try {

      await axios.get(
        'https://localhost:3000/auth/logout',
        {
          withCredentials: true
        }
      );

      await axios.post(
        'https://localhost:3000/demo/login',
        {
          username: 'docente',
          password: 'docente123'
        },
        {
          withCredentials: true
        }
      );

      await checkAuth();

    } catch (error) {

      console.error('Error login docente:', error);

    }

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
  // Obtener tareas
  // =========================
  const getTodos = async (currentPage = page) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}?page=${currentPage}&limit=5`,
        {
          withCredentials: true
        }
      );

      setTodos(response.data.data || []);
      setMetadata(response.data.metadata || {});

      setPage(response.data.metadata.currentPage || 1);
      setTotalPages(response.data.metadata.totalPages || 1);

    } catch (error) {
      console.log('Error al obtener tareas:', error);
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
        withCredentials: true
      });
      setTitle('');
      getTodos(page);
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
        withCredentials: true
      });
      getTodos(page);
    } catch (error) {
      console.log(error);
    }
  };

  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };



  // =========================
  // Cargar al iniciar
  // =========================
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getTodos(page);
    }
  }, [isAuthenticated, page]);

  if (authLoading) {
    return (
      <div style={styles.loadingContainer}>
        <h2>Verificando sesión...</h2>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <h1 style={styles.loginTitle}>📋 Todo App</h1>
          <p style={styles.loginSubtitle}>Gestiona tus tareas y archivos</p>
          <button onClick={handleDocenteLogin} style={styles.demoButton}>
            👨‍🏫 Entrar como Docente
          </button>

          <button onClick={handleGoogleLogin} style={styles.googleButton}>
            <svg style={styles.googleIcon} viewBox="0 0 24 24" width="20" height="20">
              ...
            </svg>
            Iniciar sesión con Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.userHeader}>
        <div style={styles.userInfo}>
          {user?.photo && <img src={user.photo} alt={user.displayName} style={styles.userAvatar} />}
          <div>
            <span style={styles.userName}>👋 Hola, {user?.displayName || user?.username}! </span>
            <small style={styles.userEmail}>{user?.email || user?.role}</small>
          </div>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Cerrar sesión
        </button>
      </div>

      <h1>Todo List React + Express</h1>

      <div style={styles.tabs}>
        <button style={activeTab === 'todos' ? styles.tabActive : styles.tab} onClick={() => setActiveTab('todos')}>
          📝 Mis Tareas
        </button>
        <button style={activeTab === 'files' ? styles.tabActive : styles.tab} onClick={() => setActiveTab('files')}>
          📁 Mis Archivos
        </button>
      </div>

      {activeTab === 'todos' ? (
        <>
          <div style={styles.metadata}>
            <p><strong>Total:</strong> {metadata.total || 0}</p>
            <p><strong>Página:</strong> {page}</p>
            <p><strong>Total páginas:</strong> {totalPages}</p>
          </div>

          <div style={styles.form}>
            <input
              type="text"
              placeholder="Nueva tarea"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createTodo()}
              style={styles.input}
            />
            <button onClick={createTodo} style={styles.button}>Crear</button>
          </div>

          {loading ? (
            <p>Cargando...</p>
          ) : (
            <>
              <ul style={styles.list}>
                {todos.map(todo => (
                  <li key={todo._id} style={styles.item}>
                    <div>
                      <h3>{todo.title}</h3>
                      <p>Estado: {todo.completed ? ' ✅' : ' ❌'}</p>
                    </div>

                    <button
                      onClick={() => deleteTodo(todo._id)}
                      style={styles.deleteButton}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>

              <div style={styles.pagination}>
                <button
                  onClick={prevPage}
                  disabled={page === 1}
                  style={styles.pageButton}
                >
                  ← Anterior
                </button>

                <span style={styles.pageInfo}>
                  Página {page} de {totalPages}
                </span>

                <button
                  onClick={nextPage}
                  disabled={page === totalPages}
                  style={styles.pageButton}
                >
                  Siguiente →
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <FileManager />
      )}
    </div>
  );
}

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
  demoButton: {
    marginTop: '10px',
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#4CAF50',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px'
  },
  googleIcon: {
    width: '20px',
    height: '20px'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh'
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
    fontFamily: 'Arial',
    padding: '20px'
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
    borderRadius: '5px'
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
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px'
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
    background: '#f44336',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    cursor: 'pointer',
    borderRadius: '5px'
  }
};

export default App;