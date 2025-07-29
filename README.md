# Sistema de Gestión de Tutorías Académicas - ULEAM

## 📋 Descripción

Sistema web integral para la gestión de tutorías académicas en la Universidad Laica Eloy Alfaro de Manabí (ULEAM). Permite la administración completa del proceso de tutorías entre estudiantes, tutores, coordinadores y administradores.

## 🚀 Características Principales

- **Gestión Multi-Rol**: Estudiantes, Tutores, Coordinadores y Administradores
- **Interfaz Responsive**: Adaptable a dispositivos móviles y desktop
- **Gestión de Archivos**: Subida, descarga y eliminación de documentos
- **Sistema de Notificaciones**: Comunicación en tiempo real
- **Reportes Automáticos**: Generación de reportes por facultad
- **Seguridad**: Autenticación y autorización por roles

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18, Next.js 14, TypeScript
- **Estilos**: Tailwind CSS, Shadcn/ui
- **Estado**: React Context API
- **Almacenamiento**: LocalStorage
- **Iconos**: Lucide React

## 📦 Instalación

1. **Clonar el repositorio**
\`\`\`bash
git clone https://gitlab.com/[usuario]/sistema-tutorias-uleam.git
cd sistema-tutorias-uleam
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
npm install
\`\`\`

3. **Ejecutar en modo desarrollo**
\`\`\`bash
npm run dev
\`\`\`

4. **Abrir en el navegador**
\`\`\`
http://localhost:3000
\`\`\`

## 🔐 Credenciales de Prueba

### Estudiante
- **Email**: `maria.gonzalez@live.uleam.edu.ec`
- **Contraseña**: `estudiante123`

### Tutor
- **Email**: `carlos.rodriguez@uleam.edu.ec`
- **Contraseña**: `tutor123`

### Coordinador
- **Email**: `ana.martinez@coordtit.uleam.edu.ec`
- **Contraseña**: `coordinador123`

### Administrador
- **Email**: `admin@admin.uleam.edu.ec`
- **Contraseña**: `admin123`

## 📁 Estructura del Proyecto

\`\`\`
sistema-tutorias-uleam/
├── app/
│   ├── components/
│   │   ├── dashboards/          # Dashboards por rol
│   │   ├── Layout/              # Componentes de layout
│   │   ├── Modals/              # Modales del sistema
│   │   └── ui/                  # Componentes UI reutilizables
│   ├── contexts/                # Contextos de React
│   ├── hooks/                   # Hooks personalizados
│   ├── lib/                     # Utilidades
│   ├── dashboard/               # Página principal del dashboard
│   ├── login/                   # Página de inicio de sesión
│   ├── register/                # Página de registro
│   ├── recover/                 # Página de recuperación
│   ├── globals.css              # Estilos globales
│   ├── layout.tsx               # Layout principal
│   └── page.tsx                 # Página de inicio
├── public/                      # Archivos estáticos
├── package.json                 # Dependencias del proyecto
├── tailwind.config.ts           # Configuración de Tailwind
├── tsconfig.json                # Configuración de TypeScript
└── next.config.js               # Configuración de Next.js
\`\`\`

## 🎯 Funcionalidades por Rol

### 👨‍🎓 Estudiante
- Proponer y editar temas de titulación
- Subir y gestionar archivos
- Ver estado de tutoría
- Editar perfil personal
- Recibir notificaciones

### 👨‍🏫 Tutor
- Ver estudiantes asignados
- Aprobar/rechazar temas
- Enviar indicaciones
- Descargar archivos de estudiantes
- Gestionar perfil

### 👨‍💼 Coordinador
- Ver estudiantes de su facultad
- Asignar tutores a estudiantes
- Eliminar asignaciones
- Generar reportes
- Gestionar perfil

### 👨‍💻 Administrador
- Gestión completa de usuarios
- Editar perfiles de cualquier usuario
- Acceso a todas las funcionalidades
- Estadísticas generales

## 🚀 Deployment

### Vercel (Recomendado)
1. Conectar repositorio de GitLab
2. Configurar build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. Deploy automático

### Netlify
1. Build Command: `npm run build && npm run export`
2. Publish Directory: `out`

## 📊 Scripts Disponibles

\`\`\`bash
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Construir para producción
npm run start        # Ejecutar en modo producción
npm run lint         # Ejecutar linter
npm run export       # Exportar sitio estático
\`\`\`

## 🔧 Configuración

### Variables de Entorno
Crear archivo `.env.local`:
\`\`\`env
NEXT_PUBLIC_APP_NAME=Sistema de Tutorías ULEAM
NEXT_PUBLIC_APP_VERSION=1.0.0
\`\`\`

### Configuración de Next.js
\`\`\`javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
\`\`\`

## 🧪 Testing

Para probar el sistema:

1. **Registro de Usuario**: Crear cuenta con diferentes roles
2. **Funcionalidades por Rol**: Probar cada funcionalidad específica
3. **Flujo Completo**: Simular proceso completo de tutoría
4. **Responsive**: Probar en diferentes dispositivos

## 📝 Contribución

1. Fork del proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 👥 Equipo de Desarrollo

- [Nombre del Estudiante 1] - Desarrollador Frontend
- [Nombre del Estudiante 2] - Desarrollador Backend
- [Nombre del Estudiante 3] - Diseñador UI/UX
- [Nombre del Estudiante 4] - Tester y Documentación

## 📞 Contacto

Para soporte o consultas:
- **Email**: [email-del-equipo]@live.uleam.edu.ec
- **Universidad**: Universidad Laica Eloy Alfaro de Manabí
- **Facultad**: Ingeniería, Industria y Arquitectura

---

**Desarrollado con ❤️ para ULEAM**
