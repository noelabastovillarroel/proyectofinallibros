# Proyecto final – Módulo 5 · Diplomado Univalle

Autor: **Noel Abasto Villarroel**

---

## Descripción general

Aplicación **React Native (Expo)** que permite al usuario registrarse, explorar una biblioteca de libros, crear reseñas y mantener una biblioteca personal.  
Se apoya en **Firebase** para la autenticación y persistencia de datos. El consumo de información de libros se realiza a través de la **Udacity Books API**.

Tecnologías utilizadas: **React Native (Expo)** · **npm** · **Firebase** · **VS Code**

---

## 0 · Instalación

```bash
# 1 · Clonar el proyecto
git clone https://github.com/noelabastovillarroel/proyectofinallibros.git
cd proyectofinallibros

# 2 · Instalar dependencias
npm install

# 3 · Ejecutar en Expo
npx expo start
```

---

## 1 · Objetivo del proyecto

- Permitir el registro y mantenimiento de un perfil de usuario.  
- Explorar una biblioteca de libros y aplicar búsquedas con filtros.  
- Crear, editar y eliminar reseñas.  
- Gestionar una biblioteca personal.

---

## 2 · Tecnologías disponibles

- **Front‑end:** React Native + Expo  
- **Back‑end:** Firebase (Authentication, Firestore)  
- **API externa:** Udacity Books API

---

## 3 · Estructura base del proyecto

- Navegación principal configurada.  
- Pantallas iniciales creadas.  
- Estructura de carpetas organizada.  
- Configuración inicial de Firebase incluida.

---

### 4 · Módulos principales

#### 4.1 · Autenticación
- Registro mediante email y contraseña.  
- Inicio de sesión.

#### 4.2 · Biblioteca
- Listado general de libros.  
- Función de búsqueda y filtrado.

#### 4.3 · Usuario
- Biblioteca personal con los libros del usuario.

---

## 5 · API de Libros (Udacity)

Base URL: **https://reactnd-books-api.udacity.com**

Autenticación y uso de la API configurados en el proyecto.

---

## 6 · Firebase

Servicios habilitados:

- Authentication  
- Firestore  

Aspectos críticos cubiertos:

- Manejo de estados.  
- Gestión de errores.  
- Validaciones.  
- Experiencia de usuario.

---

## 7 · Testing y verificación

Se incluyen pruebas manuales y verificación de flujos críticos para garantizar la estabilidad de la aplicación en escenarios de uso comunes.

---

## 8 · Recursos

| Carpeta               | Descripción                    |
|-----------------------|--------------------------------|
| `capturas_pantalla/`  | Capturas de pantalla y ejemplos |
| `video/`              | Demo de la aplicación           |

---

¡Gracias por revisar el proyecto!
