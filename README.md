Se realizo el trabajo con integracion de mongo db, y crud de mongoose, con ayuda de inteligencia artificial para la conexion y archivos js mas que todo el controller.js


Se realizo el trabajo con integracion de mongo db, y crud de mongoose, con ayuda de inteligencia artificial para la conexion y archivos js mas que todo el controller.js

# 📋 Todo App Fullstack

Aplicación completa de lista de tareas con gestor de archivos (similar a Google Drive).
con ayuda de deepseek y chatgpt mas que todo en backend y base de datos

## 🚀 Tecnologías utilizadas

| Tecnología | Versión | Para qué sirve |
|------------|---------|----------------|
| **React** | 18.x | Interfaz de usuario (frontend) |
| **Vite** | 8.x | Servidor de desarrollo rápido para React |
| **Node.js** | 18+ | Servidor backend |
| **Express** | 4.x | Framework para el servidor |
| **MongoDB Atlas** | - | Base de datos en la nube |
| **Mongoose** | 8.x | Conexión entre Node.js y MongoDB |
| **HTTPS** | - | Conexión segura con certificados SSL |
| **Axios** | 1.6.x | Peticiones HTTP desde el frontend |

---

## 📋 Requisitos previos

| Programa | Versión | ¿Dónde descargar? |
|----------|---------|-------------------|
| **Node.js** | v18 o superior | [https://nodejs.org/](https://nodejs.org/) |
| **Git** | Cualquiera | [https://git-scm.com/](https://git-scm.com/) |
| **Cuenta MongoDB Atlas** | - | [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) (gratis) |
| **mkcert** | - | Para certificados SSL locales (ver paso 4) |

---

## 🔧 Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/todolistpweb.git
cd todolistpweb
2. Configurar MongoDB Atlas
2.1 Crear una cuenta gratis
Ve a MongoDB Atlas

Regístrate con tu correo (gratis)

2.2 Crear un cluster
Haz clic en "Build a Database"

Selecciona el plan gratuito M0 (FREE)

Elige tu región

Haz clic en "Create Cluster" (tarda 1-3 minutos)

2.3 Crear un usuario de base de datos
Ve a Database Access → Add New Database User

Username: todouser

Password: (elige una contraseña)

Privilegios: Read and write to any database

2.4 Configurar acceso IP
Ve a Network Access → Add IP Address

Agrega 0.0.0.0/0 (permite todas las IPs para pruebas)

2.5 Obtener la URI de conexión
Ve a tu cluster → Connect → Connect your application

Copia la URI, se ve así:

text
mongodb+srv://todouser:CONTRASEÑA@cluster0.xxxxx.mongodb.net/todolist
3. Instalar mkcert (para certificados SSL locales)
Windows (PowerShell como administrador):

bash
choco install mkcert -y
mkcert -install
Mac:

bash
brew install mkcert
mkcert -install
Linux:

bash
sudo apt install libnss3-tools
wget -O mkcert https://github.com/FiloSottile/mkcert/releases/latest/download/mkcert-linux-amd64
chmod +x mkcert
sudo mv mkcert /usr/local/bin/
mkcert -install
4. Generar certificados SSL
bash
cd todo-backend
mkdir certs
cd certs
mkcert -key-file key.pem -cert-file cert.pem localhost 127.0.0.1 ::1
5. Copiar certificados al frontend
bash
cd ../../
copy todo-backend\certs\key.pem todo-frontend\certs\key.pem
copy todo-backend\certs\cert.pem todo-frontend\certs\cert.pem
6. Configurar variables de entorno
6.1 Crear archivo .env en todo-backend/
bash
cd todo-backend
copy .env.example .env   # En Windows
# o
cp .env.example .env      # En Mac/Linux
6.2 Editar el archivo .env
env
PORT=3000
MONGO_URI=mongodb+srv://todouser:TU_CONTRASEÑA@cluster0.xxxxx.mongodb.net/todolist
SESSION_SECRET=una_frase_secreta_cualquiera
7. Instalar dependencias del Backend
bash
cd todo-backend
npm install
8. Cargar datos de prueba
bash
npm run seed-docente
Verás:

text
📦 Conectando a MongoDB Atlas...
✅ Conectado a MongoDB Atlas
👨‍🏫 Creando usuario docente...
   ✅ Usuario docente creado: docente@todolist.com
📋 Importando tareas para el docente...
   ✅ 5 tareas importadas

🎉 Seed completado exitosamente!
📊 DATOS PARA EL DOCENTE:
   ┌─────────────────────────────────────────────┐
   │  👨‍🏫 Usuario: docente@todolist.com           │
   │  🔑 Contraseña: (no necesita)               │
   │  📋 Tareas cargadas: 5  o las que haya                    │
   │  💡 INSTRUCCIONES:                          │
   │  Haz clic en "Ingresar como Docente"        │
   │  en la pantalla de login.                   │
   └─────────────────────────────────────────────┘
9. Ejecutar el Backend (HTTPS)
bash
npm run https
Deberías ver:

text
✅ Servidor HTTPS corriendo en https://localhost:3000
MongoDB conectado correctamente
10. Instalar dependencias del Frontend
Abre una nueva terminal (no cierres la del backend):

bash
cd todo-frontend
npm install
11. Ejecutar el Frontend (HTTPS)
bash
npm run dev
Deberías ver:

text
VITE ready
➜  Local:   https://localhost:5173/
12. Aceptar certificados en el navegador
IMPORTANTE: Antes de usar la app, abre cada URL y acepta la advertencia de seguridad:

Abre https://localhost:3000/ → Haz clic en "Avanzado" → "Continuar"

Abre https://localhost:5173/ → Haz clic en "Avanzado" → "Continuar"

13. Abrir la aplicación
Ve a: https://localhost:5173
🔐 Iniciar sesión con Google (Opcional)
Si deseas usar tu cuenta de Google en lugar del acceso de docente:

Configurar Google OAuth (solo si quieres usar Google)
1. Crear proyecto en Google Cloud
Ve a Google Cloud Console

Crear nuevo proyecto: "Todo App"

2. Habilitar People API
APIs y Servicios → Biblioteca

Buscar: People API → Habilitar

3. Configurar pantalla de consentimiento OAuth
APIs y Servicios → Pantalla de consentimiento OAuth

Tipo: Externo

Nombre de la aplicación: Todo App

Correo de asistencia: tu correo

En Usuarios de prueba, agrega tu correo

URIs de redireccionamiento: https://localhost:3000/auth/google/callback

4. Crear credenciales OAuth
Credenciales → + Crear credenciales → ID de cliente OAuth

Tipo: Aplicación web

Nombre: Todo App Client

Copiar Client ID y Client Secret

5. Agregar al .env
env
GOOGLE_CLIENT_ID=TU_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=TU_CLIENT_SECRET
GOOGLE_CALLBACK_URL=https://localhost:3000/auth/google/callback
6. Reiniciar el backend
bash
npm run https
7. Iniciar sesión
Haz clic en "Iniciar sesión con Google"

Selecciona tu cuenta

Autoriza el acceso

📱 Funcionalidades de la aplicación
📝 Mis Tareas (Todo List)
Acción	¿Cómo hacerlo?
Crear tarea	Escribe el título y presiona "Crear"
Ver tareas	Se muestran en la lista principal
Marcar completada	Haz clic en el checkbox ✅
Eliminar tarea	Presiona el botón rojo "Eliminar"
📁 Mis Archivos (File Manager)
Acción	¿Cómo hacerlo?
Subir archivo	Ve a "Mis Archivos" → Selecciona archivo → "Subir"
Descargar archivo	Presiona "Descargar"
Eliminar archivo	Presiona "Eliminar" y confirma
📡 Endpoints de la API (para referencia)
Método	Endpoint	Descripción	Autenticación
POST	/auth/docente-login	Login como docente	No
GET	/auth/current-user	Obtener usuario actual	No
GET	/auth/logout	Cerrar sesión	Sí
GET	/api/todos	Listar todas las tareas	Sí
POST	/api/todos	Crear una tarea	Sí
DELETE	/api/todos/:id	Eliminar una tarea	Sí
GET	/api/files/files	Listar archivos subidos	Sí
POST	/api/files/upload	Subir un archivo	Sí
GET	/api/files/download/:id	Descargar un archivo	Sí
DELETE	/api/files/files/:id	Eliminar un archivo	Sí



COMANDOS RAPIDOS PARA USO

# 1. Clonar repositorio
git clone https://github.com/TU_USUARIO/todolistpweb.git
cd todolistpweb

# 2. Generar certificados SSL
cd todo-backend
mkdir certs && cd certs
mkcert -key-file key.pem -cert-file cert.pem localhost 127.0.0.1 ::1
cd ../..

# 3. Copiar certificados al frontend
copy todo-backend\certs\key.pem todo-frontend\certs\key.pem
copy todo-backend\certs\cert.pem todo-frontend\certs\cert.pem

# 4. Configurar .env
cd todo-backend
copy .env.example .env
# Editar .env con MONGO_URI y SESSION_SECRET

# 5. Instalar y ejecutar backend
npm install
npm run seed-docente
npm run https

# 6. Instalar y ejecutar frontend (otra terminal)
cd ../todo-frontend
npm install
npm run dev

# 7. Abrir navegador
# https://localhost:5173
# Click en "Ingresar como Docente"
