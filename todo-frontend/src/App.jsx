import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {

  const [todos, setTodos] = useState([]);

  const [title, setTitle] = useState('');

  const [metadata, setMetadata] = useState({});

  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:3000/api/todos';


  // =========================
  // Obtener tareas
  // =========================
  const getTodos = async () => {

    try {

      setLoading(true);

      const response = await axios.get(API_URL);

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

    try {

      await axios.post(API_URL, {
        title,
        completed: false
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

    try {

      await axios.delete(`${API_URL}/${id}`);

      getTodos();

    } catch (error) {

      console.log(error);

    }

  };


  // =========================
  // Cargar al iniciar
  // =========================
  useEffect(() => {

    getTodos();

  }, []);


  return (

    <div style={styles.container}>

      <h1>Todo List React + Express</h1>

      {/* Metadata */}
      <div style={styles.metadata}>

        <p>
          <strong>Total:</strong> {metadata.total}
        </p>

        <p>
          <strong>Página:</strong> {metadata.currentPage}
        </p>

        <p>
          <strong>API Version:</strong> {metadata.version}
        </p>

      </div>


      {/* Formulario */}
      <div style={styles.form}>

        <input
          type="text"
          placeholder="Nueva tarea"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={createTodo}
          style={styles.button}
        >
          Crear
        </button>

      </div>


      {/* Loading */}
      {
        loading
          ? <p>Cargando...</p>
          : (
            <ul style={styles.list}>
              {
                todos.map(todo => (
                  <li
                    key={todo._id}
                    style={styles.item}
                  >

                    <div>

                      <h3>{todo.title}</h3>

                      <p>
                        Estado:
                        {
                          todo.completed
                            ? ' ✅'
                            : ' ❌'
                        }
                      </p>

                    </div>

                    <button
                      onClick={() => deleteTodo(todo._id)}
                      style={styles.deleteButton}
                    >
                      Eliminar
                    </button>

                  </li>
                ))
              }
            </ul>
          )
      }

    </div>

  );

}


// =========================
// Estilos
// =========================
const styles = {

  container: {
    maxWidth: '700px',
    margin: '40px auto',
    fontFamily: 'Arial'
  },

  metadata: {
    background: '#f4f4f4',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '20px'
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
    cursor: 'pointer'
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
    cursor: 'pointer'
  }

};


export default App;