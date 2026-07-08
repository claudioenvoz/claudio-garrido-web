# Claudio Garrido — Sitio Web (Piano Funcional)

Proyecto base generado para el ecosistema digital de Claudio Garrido.
Stack: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Sanity CMS + Vercel.

## Sprint 1 — Fundaciones

### Nota sobre esta verificación
Mi entorno de trabajo no tiene acceso a internet, así que no puedo ejecutar `npm install` ni `npm run build` para confirmar la compilación desde aquí. Sí revisé manualmente todos los archivos de configuración (`package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `app/layout.tsx`) y están completos y consistentes entre sí. El paso 3 de abajo es el que confirma el Sprint como terminado — cuando lo corras y `npm run build` termine sin errores, este Sprint queda cerrado.

### 1. Requisitos previos
- [Node.js](https://nodejs.org) versión 18 o superior
- Cuenta de [GitHub](https://github.com)
- Cuenta de [Vercel](https://vercel.com) (puedes entrar con tu GitHub)

### 2. Descomprime este proyecto y entra a la carpeta
```bash
cd claudio-garrido-web
```

### 3. Instala las dependencias y verifica el build
```bash
npm install
npm run build
```
Si termina sin errores, el Sprint 1 está confirmado como terminado.

### 4. Prueba que corre localmente
```bash
npm run dev
```
Abre http://localhost:3000 — deberías ver una página placeholder con tu nombre.

### 5. Crea el repositorio en GitHub
1. Ve a github.com → botón "New repository"
2. Nómbralo, por ejemplo, `claudio-garrido-web`
3. NO inicialices con README (ya tenemos uno)
4. Copia los comandos que GitHub te muestra, algo como:
```bash
git init
git add .
git commit -m "Sprint 1: fundaciones del proyecto"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/claudio-garrido-web.git
git push -u origin main
```

### 6. Conecta el repo a Vercel (deploy automático)
1. En vercel.com → "Add New Project"
2. Importa el repositorio `claudio-garrido-web` desde GitHub
3. Vercel detecta Next.js automáticamente — dale "Deploy"
4. Cada vez que hagas `git push` a `main`, Vercel actualizará el sitio solo

---

## Próximos Sprints
Ver el roadmap de desarrollo para el detalle completo de cada fase (Sanity CMS, diseño de las 5 áreas, Cal.com Atoms, pagos, Panel de Administración, QA y lanzamiento).

