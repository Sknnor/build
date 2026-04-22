# DataSprint Board 🚀
Tablero Scrum/Kanban para Analistas de Datos

---

## Estructura del proyecto
```
datasprint-board/
├── public/
│   └── index.html
├── src/
│   ├── index.js
│   └── App.jsx
├── package.json
└── README.md
```

---

## Opción A — Correr en StackBlitz (más fácil, sin instalar nada)

1. Ve a **https://stackblitz.com**
2. Haz clic en **"Start a new project"** → elige **React**
3. Borra todo el contenido de `src/App.js`
4. Pega el contenido de `src/App.jsx` de este proyecto
5. Reemplaza `src/index.js` con el contenido de este proyecto
6. ¡Listo! StackBlitz te da una URL para compartir

---

## Opción B — Publicar en GitHub Pages (link permanente)

### Paso 1: Subir a GitHub
1. Crea un repositorio en https://github.com → nombre: `datasprint-board`
2. Sube todos estos archivos (arrastra la carpeta o usa GitHub Desktop)

### Paso 2: Agregar tu usuario en package.json
Edita `package.json` y agrega esta línea debajo de `"name"`:
```json
"homepage": "https://TU-USUARIO.github.io/datasprint-board",
```

### Paso 3: Publicar
En la terminal de StackBlitz o Firebase Studio:
```bash
npm install
npm run deploy
```

### Paso 4: Activar GitHub Pages
- En tu repo de GitHub → **Settings** → **Pages**
- Source: branch `gh-pages` → carpeta `/root`
- Tu link será: `https://TU-USUARIO.github.io/datasprint-board`

---

## Opción C — Vercel (más fácil para link permanente)
1. Sube el proyecto a GitHub (Paso 1 de arriba)
2. Ve a **https://vercel.com** → "New Project"
3. Conecta tu GitHub y selecciona el repo
4. Clic en **Deploy** — ¡sin configuración adicional!
5. Tu link: `https://datasprint-board.vercel.app`
