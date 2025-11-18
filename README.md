 Características
Gestión de Casos: Crear, editar y eliminar casos legales

Dashboard Interactivo: Vista general con métricas y casos recientes

Interfaz Responsive: Diseño adaptable a dispositivos móviles y desktop

Modo Oscuro: Tema oscuro para mejor experiencia visual

Búsqueda y Filtros: Encontrar casos rápidamente

Estados de Casos: Seguimiento del progreso de cada caso

--------------------------------------------------------------

Tecnologías Utilizadas

Frontend: Next.js 14, React 18, TypeScript

Estilos: Tailwind CSS

Iconos: Lucide React

Despliegue: Vercel

Control de Versiones: Git & GitHub
--------------------------------------------------------------------
ESTRUCTURA DEL PROYECTO

legal-tech/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── CaseForm.tsx
│   │   ├── CaseList.tsx
│   │   ├── RecentCases.tsx
│   │   └── StatsCard.tsx
│   └── types/
│       └── index.ts
├── public/
├── package.json
├── next.config.js
└── tailwind.config.js


---------------------------------------------------------------



LINK DEL FRONTEND DESPLEGADO

https://gestion-casos.vercel.app/login

--------------------------------------------------------------

Dashboard
-Métricas generales de casos
-Casos recientes
-Gráficos de distribución

CaseForm
-Formulario para crear/editar casos
-Validación de datos
-Estados de envío

CaseList
-Lista completa de casos
-Búsqueda y filtrado
-Acciones rápidas

RecentCases
-Vista de casos recientes
-Acciones rápidas (editar/eliminar)


---------------------------------------------------------------------


LINK DE REPOSITORIO 


https://github.com/Alcardro/GestionDeCasos

---------------------------------------------------------------------

Para pruebas en Local donde el proyecto funciona de manera completa:

1. Ejecutra "npm run dev" desde la carpeta principal para ejecutar el fronted
2. Para ejecutar el backend, abrir otra terminal y colocarse en la carpeta backend y ejecutar "npm run dev"
3. Finalmente accediento a las rutas de fronted se puede seguir y ver todo la aplicación.

   Nota: el usuario y contraseña se encuentran en la pantalla del login en la parte inferior
