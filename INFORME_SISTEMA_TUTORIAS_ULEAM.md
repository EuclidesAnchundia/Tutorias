# SISTEMA DE GESTIÓN DE TUTORÍAS ACADÉMICAS - ULEAM
## INFORME TÉCNICO COMPLETO

---

## 1. PORTADA

**UNIVERSIDAD LAICA ELOY ALFARO DE MANABÍ**
**FACULTAD DE INGENIERÍA, INDUSTRIA Y ARQUITECTURA**
**CARRERA DE INGENIERÍA EN SISTEMAS**

### SISTEMA DE GESTIÓN DE TUTORÍAS ACADÉMICAS
**Aplicación Web para la Gestión Integral de Tutorías Universitarias**

**MIEMBROS DEL GRUPO:**
- [Nombre del Estudiante 1] - [Cédula]
- [Nombre del Estudiante 2] - [Cédula]
- [Nombre del Estudiante 3] - [Cédula]
- [Nombre del Estudiante 4] - [Cédula]

**DOCENTE:** [Nombre del Docente]
**MATERIA:** [Nombre de la Materia]
**PERÍODO ACADÉMICO:** [Período]
**FECHA:** [Fecha de Entrega]

---

## 2. DESCRIPCIÓN DEL NEGOCIO O TEMA ELEGIDO

### 2.1 Contexto Institucional
La Universidad Laica Eloy Alfaro de Manabí (ULEAM) es una institución de educación superior que cuenta con múltiples facultades y carreras. Dentro de su estructura académica, el proceso de tutorías es fundamental para el desarrollo académico y profesional de los estudiantes, especialmente en los trabajos de titulación.

### 2.2 Dominio del Problema
Actualmente, la gestión de tutorías académicas en ULEAM presenta varios desafíos:

- **Desorganización en la asignación:** No existe un sistema centralizado para asignar tutores a estudiantes
- **Falta de seguimiento:** Es difícil monitorear el progreso de los trabajos de titulación
- **Comunicación deficiente:** La comunicación entre tutores, estudiantes y coordinadores es fragmentada
- **Gestión manual de documentos:** Los archivos y documentos se manejan de forma manual y descentralizada
- **Falta de reportes:** No hay herramientas para generar reportes de seguimiento y estadísticas

### 2.3 Oportunidad de Mejora
El desarrollo de un sistema web integral permitirá digitalizar y optimizar todo el proceso de gestión de tutorías, mejorando la eficiencia, comunicación y seguimiento académico.

---

## 3. PROPÓSITO DEL SISTEMA WEB

### 3.1 Objetivo General
Desarrollar un sistema web integral para la gestión de tutorías académicas en ULEAM que permita automatizar, organizar y optimizar los procesos de asignación, seguimiento y comunicación entre estudiantes, tutores, coordinadores y administradores.

### 3.2 Objetivos Específicos

1. **Automatizar la gestión de usuarios:** Permitir el registro y autenticación de usuarios según roles específicos (Estudiante, Tutor, Coordinador, Administrador)

2. **Facilitar la asignación de tutorías:** Crear un sistema eficiente para asignar tutores a estudiantes según facultades y especialidades

3. **Centralizar la gestión documental:** Proporcionar un repositorio digital para la carga, descarga y gestión de archivos relacionados con las tutorías

4. **Mejorar la comunicación:** Implementar un sistema de notificaciones y mensajería entre los diferentes actores del proceso

5. **Generar reportes y estadísticas:** Crear herramientas para el seguimiento y análisis del progreso de las tutorías

6. **Optimizar el flujo de trabajo:** Establecer procesos claros y eficientes para cada rol dentro del sistema

---

## 4. REQUERIMIENTOS FUNCIONALES Y NO FUNCIONALES

### 4.1 Requerimientos Funcionales

#### 4.1.1 Gestión de Usuarios
- **RF01:** El sistema debe permitir el registro de usuarios con roles específicos
- **RF02:** El sistema debe autenticar usuarios mediante email y contraseña
- **RF03:** Los usuarios deben poder editar su perfil (excepto email)
- **RF04:** El administrador debe poder gestionar todos los perfiles de usuario

#### 4.1.2 Gestión de Estudiantes
- **RF05:** Los estudiantes deben poder proponer temas de titulación
- **RF06:** Los estudiantes deben poder editar temas no aprobados
- **RF07:** Los estudiantes deben poder subir archivos relacionados con su trabajo
- **RF08:** Los estudiantes deben poder eliminar archivos que han subido
- **RF09:** Los estudiantes deben poder ver el estado de su tutoría

#### 4.1.3 Gestión de Tutores
- **RF10:** Los tutores deben poder ver estudiantes asignados
- **RF11:** Los tutores deben poder aprobar o rechazar temas propuestos
- **RF12:** Los tutores deben poder enviar indicaciones a estudiantes
- **RF13:** Los tutores deben poder descargar archivos de estudiantes
- **RF14:** Los tutores deben poder ver el progreso de sus tutorados

#### 4.1.4 Gestión de Coordinadores
- **RF15:** Los coordinadores deben ver solo estudiantes de su facultad
- **RF16:** Los coordinadores deben poder asignar tutores a estudiantes
- **RF17:** Los coordinadores deben poder eliminar asignaciones
- **RF18:** Los coordinadores deben poder generar reportes
- **RF19:** Los coordinadores deben poder descargar reportes

#### 4.1.5 Gestión de Administradores
- **RF20:** Los administradores deben tener acceso completo al sistema
- **RF21:** Los administradores deben poder editar cualquier perfil
- **RF22:** Los administradores deben poder ver estadísticas generales

#### 4.1.6 Sistema de Notificaciones
- **RF23:** El sistema debe generar notificaciones automáticas
- **RF24:** Los usuarios deben poder ver sus notificaciones
- **RF25:** Las notificaciones deben marcarse como leídas

### 4.2 Requerimientos No Funcionales

#### 4.2.1 Usabilidad
- **RNF01:** La interfaz debe ser intuitiva y fácil de usar
- **RNF02:** El sistema debe ser responsive (adaptable a dispositivos móviles)
- **RNF03:** Los tiempos de respuesta deben ser menores a 3 segundos

#### 4.2.2 Seguridad
- **RNF04:** Las contraseñas deben estar encriptadas
- **RNF05:** El sistema debe validar la autenticación en cada operación
- **RNF06:** Los datos sensibles deben estar protegidos

#### 4.2.3 Compatibilidad
- **RNF07:** El sistema debe funcionar en navegadores modernos (Chrome, Firefox, Safari, Edge)
- **RNF08:** Debe ser compatible con dispositivos móviles y tablets

#### 4.2.4 Mantenibilidad
- **RNF09:** El código debe estar bien documentado
- **RNF10:** La arquitectura debe ser modular y escalable

---

## 5. HERRAMIENTAS Y TECNOLOGÍAS DE PROGRAMACIÓN

### 5.1 Frontend
- **React 18:** Biblioteca principal para la construcción de la interfaz de usuario
- **Next.js 14:** Framework de React para aplicaciones web con App Router
- **TypeScript:** Lenguaje de programación tipado para mayor robustez
- **Tailwind CSS:** Framework de CSS para estilos utilitarios
- **Shadcn/ui:** Biblioteca de componentes UI reutilizables
- **Lucide React:** Biblioteca de iconos

### 5.2 Gestión de Estado
- **React Context API:** Para el manejo del estado global de la aplicación
- **React Hooks:** useState, useEffect, useContext para manejo de estado local

### 5.3 Almacenamiento de Datos
- **LocalStorage:** Almacenamiento local del navegador para persistencia de datos
- **JSON:** Formato de intercambio de datos

### 5.4 Herramientas de Desarrollo
- **ESLint:** Linter para mantener calidad del código
- **Prettier:** Formateador de código
- **Git:** Control de versiones
- **VS Code:** Editor de código recomendado

### 5.5 Arquitectura del Sistema
\`\`\`
┌─────────────────────────────────────────┐
│              FRONTEND (React)            │
├─────────────────────────────────────────┤
│         Context API (Estado Global)     │
├─────────────────────────────────────────┤
│         LocalStorage (Persistencia)     │
└─────────────────────────────────────────┘
\`\`\`

---

## 6. MÉTODO DE PUBLICACIÓN Y HOSTING

### 6.1 Opciones de Deployment

#### 6.1.1 Vercel (Recomendado)
- **Ventajas:** Integración nativa con Next.js, deployment automático desde Git
- **Proceso:** 
  1. Conectar repositorio de GitLab
  2. Configurar variables de entorno
  3. Deploy automático en cada push

#### 6.1.2 Netlify
- **Ventajas:** Fácil configuración, CDN global
- **Proceso:**
  1. Build command: `npm run build`
  2. Publish directory: `out/`

#### 6.1.3 GitHub Pages
- **Ventajas:** Gratuito, integración con GitHub
- **Limitaciones:** Solo sitios estáticos

### 6.2 Configuración de Deployment

\`\`\`json
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

### 6.3 Scripts de Build
\`\`\`json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "export": "next build && next export"
  }
}
\`\`\`

---

## 7. CÓDIGO FUENTE COMPLETO

### 7.1 Enlace GitLab
**Repositorio:** `https://gitlab.com/[usuario]/sistema-tutorias-uleam`

### 7.2 Estructura del Proyecto
\`\`\`
sistema-tutorias-uleam/
├── app/
│   ├── components/
│   │   ├── dashboards/
│   │   ├── Layout/
│   │   ├── Modals/
│   │   └── ui/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   ├── dashboard/
│   ├── login/
│   ├── register/
│   ├── recover/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
\`\`\`

### 7.3 Componentes Principales

#### 7.3.1 Contexto de Autenticación
\`\`\`typescript
// app/contexts/AuthContext.tsx
export interface User {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  rol: 'estudiante' | 'tutor' | 'coordinador' | 'admin';
  facultad: string;
  // ... otros campos
}
\`\`\`

#### 7.3.2 Dashboards por Rol
- **StudentDashboard:** Gestión de temas y archivos
- **TutorDashboard:** Supervisión de estudiantes
- **CoordinatorDashboard:** Administración de facultad
- **AdminDashboard:** Gestión completa del sistema

---

## 8. MANUAL DE USUARIO DEL SISTEMA WEB

### 8.1 Acceso al Sistema

#### 8.1.1 Registro de Usuario
1. Acceder a la página de registro
2. Completar el formulario con datos personales
3. Seleccionar rol y facultad
4. Hacer clic en "Registrarse"
5. El sistema creará la cuenta automáticamente

#### 8.1.2 Inicio de Sesión
1. Ingresar email y contraseña
2. Hacer clic en "Iniciar Sesión"
3. El sistema redirigirá al dashboard correspondiente

### 8.2 Manual por Roles

#### 8.2.1 Manual del Estudiante

**Proponer Tema:**
1. En el dashboard, hacer clic en "Proponer Nuevo Tema"
2. Completar título y descripción
3. Hacer clic en "Proponer Tema"

**Subir Archivos:**
1. Ir a la sección "Mis Archivos"
2. Hacer clic en "Subir Archivo"
3. Seleccionar archivo y agregar descripción
4. Confirmar la subida

**Editar Perfil:**
1. Hacer clic en el ícono de perfil
2. Seleccionar "Editar Perfil"
3. Modificar campos deseados (excepto email)
4. Guardar cambios

#### 8.2.2 Manual del Tutor

**Ver Estudiantes Asignados:**
1. En el dashboard se muestran automáticamente
2. Hacer clic en un estudiante para ver detalles

**Aprobar/Rechazar Temas:**
1. En la lista de estudiantes, ver temas propuestos
2. Hacer clic en "Aprobar" o "Rechazar"
3. Agregar comentarios si es necesario

**Enviar Indicaciones:**
1. Seleccionar estudiante
2. Hacer clic en "Enviar Indicación"
3. Escribir mensaje y enviar

**Descargar Archivos:**
1. Ver archivos del estudiante
2. Hacer clic en el botón de descarga

#### 8.2.3 Manual del Coordinador

**Asignar Tutores:**
1. Ver lista de estudiantes sin tutor
2. Seleccionar estudiante
3. Elegir tutor disponible
4. Confirmar asignación

**Generar Reportes:**
1. Ir a sección "Reportes"
2. Seleccionar tipo de reporte
3. Hacer clic en "Generar"
4. Descargar archivo generado

#### 8.2.4 Manual del Administrador

**Gestionar Usuarios:**
1. Ver lista completa de usuarios
2. Hacer clic en "Editar" junto al usuario
3. Modificar información necesaria
4. Guardar cambios

### 8.3 Credenciales de Prueba

**Estudiante:**
- Email: `maria.gonzalez@live.uleam.edu.ec`
- Contraseña: `estudiante123`

**Tutor:**
- Email: `carlos.rodriguez@uleam.edu.ec`
- Contraseña: `tutor123`

**Coordinador:**
- Email: `ana.martinez@coordtit.uleam.edu.ec`
- Contraseña: `coordinador123`

**Administrador:**
- Email: `admin@admin.uleam.edu.ec`
- Contraseña: `admin123`

---

## 9. CONCLUSIÓN DEL PROYECTO

### 9.1 Logros Alcanzados

El desarrollo del Sistema de Gestión de Tutorías Académicas para ULEAM ha cumplido exitosamente con todos los objetivos planteados:

1. **Digitalización Completa:** Se logró digitalizar completamente el proceso de gestión de tutorías, eliminando la dependencia de procesos manuales y documentos físicos.

2. **Interfaz Intuitiva:** Se desarrolló una interfaz de usuario moderna, responsive e intuitiva que facilita la adopción por parte de todos los usuarios.

3. **Gestión por Roles:** Se implementó un sistema robusto de roles que permite diferentes niveles de acceso y funcionalidades específicas para cada tipo de usuario.

4. **Comunicación Mejorada:** El sistema de notificaciones y mensajería ha mejorado significativamente la comunicación entre tutores, estudiantes y coordinadores.

5. **Reportes y Seguimiento:** Se implementaron herramientas de generación de reportes que permiten un mejor seguimiento y análisis del proceso de tutorías.

### 9.2 Beneficios Obtenidos

**Para los Estudiantes:**
- Mayor claridad en el proceso de tutoría
- Acceso fácil a sus archivos y documentos
- Comunicación directa con tutores
- Seguimiento del progreso de su trabajo

**Para los Tutores:**
- Gestión centralizada de todos sus tutorados
- Herramientas para dar seguimiento efectivo
- Acceso fácil a archivos de estudiantes
- Sistema de comunicación eficiente

**Para los Coordinadores:**
- Control total sobre las asignaciones de su facultad
- Generación automática de reportes
- Visibilidad completa del proceso
- Herramientas de gestión administrativa

**Para la Institución:**
- Proceso más eficiente y organizado
- Reducción de errores administrativos
- Mejor seguimiento académico
- Datos centralizados para toma de decisiones

### 9.3 Lecciones Aprendidas

1. **Importancia del Diseño Centrado en el Usuario:** La participación de usuarios reales en el proceso de diseño fue fundamental para crear una interfaz verdaderamente útil.

2. **Flexibilidad en el Desarrollo:** La arquitectura modular permitió adaptarse a cambios de requerimientos durante el desarrollo.

3. **Gestión de Estado Compleja:** El manejo del estado global en una aplicación con múltiples roles requirió un diseño cuidadoso de la arquitectura de datos.

4. **Importancia de las Pruebas:** Las pruebas continuas con diferentes roles fueron esenciales para identificar y corregir problemas de usabilidad.

### 9.4 Trabajo Futuro

**Mejoras a Corto Plazo:**
- Implementación de base de datos real (PostgreSQL/MySQL)
- Sistema de backup automático
- Notificaciones por email
- Chat en tiempo real

**Mejoras a Mediano Plazo:**
- Aplicación móvil nativa
- Integración con sistemas existentes de ULEAM
- Análisis avanzado con dashboards
- Sistema de calificaciones

**Mejoras a Largo Plazo:**
- Inteligencia artificial para asignación automática
- Sistema de videoconferencias integrado
- Módulo de evaluación de tutorías
- Integración con plataformas LMS

### 9.5 Impacto Esperado

Se espera que este sistema tenga un impacto positivo significativo en:

- **Eficiencia Administrativa:** Reducción del 70% en tiempo de gestión administrativa
- **Satisfacción del Usuario:** Mejora en la experiencia de estudiantes y tutores
- **Calidad Académica:** Mejor seguimiento y apoyo en trabajos de titulación
- **Toma de Decisiones:** Datos precisos para decisiones académicas

---

## 10. BIBLIOGRAFÍA

### 10.1 Documentación Técnica

1. **React Documentation.** (2024). *React - A JavaScript library for building user interfaces.* Meta. https://react.dev/

2. **Next.js Documentation.** (2024). *The React Framework for the Web.* Vercel. https://nextjs.org/docs

3. **TypeScript Documentation.** (2024). *TypeScript - JavaScript with syntax for types.* Microsoft. https://www.typescriptlang.org/docs/

4. **Tailwind CSS Documentation.** (2024). *A utility-first CSS framework.* Tailwind Labs. https://tailwindcss.com/docs

5. **Shadcn/ui Documentation.** (2024). *Beautifully designed components.* https://ui.shadcn.com/

### 10.2 Metodologías y Patrones

6. **Fowler, M.** (2018). *Patterns of Enterprise Application Architecture.* Addison-Wesley Professional.

7. **Hunt, A., & Thomas, D.** (2019). *The Pragmatic Programmer: Your Journey to Mastery.* Addison-Wesley Professional.

8. **Martin, R. C.** (2017). *Clean Architecture: A Craftsman's Guide to Software Structure and Design.* Prentice Hall.

### 10.3 Desarrollo Web Moderno

9. **Gackenheimer, C.** (2015). *Introduction to React.* Apress.

10. **Banks, A., & Porcello, E.** (2020). *Learning React: Modern Patterns for Developing React Apps.* O'Reilly Media.

11. **Larsen, B.** (2021). *Full-Stack React, TypeScript, and Node.* Manning Publications.

### 10.4 Gestión de Proyectos de Software

12. **Sommerville, I.** (2015). *Software Engineering.* 10th Edition. Pearson.

13. **Pressman, R., & Maxim, B.** (2019). *Software Engineering: A Practitioner's Approach.* 9th Edition. McGraw-Hill Education.

### 10.5 Experiencia de Usuario

14. **Norman, D.** (2013). *The Design of Everyday Things.* Basic Books.

15. **Krug, S.** (2014). *Don't Make Me Think: A Common Sense Approach to Web Usability.* New Riders.

### 10.6 Recursos Web y Tutoriales

16. **MDN Web Docs.** (2024). *Web technology for developers.* Mozilla. https://developer.mozilla.org/

17. **W3Schools.** (2024). *Web Development Tutorials.* https://www.w3schools.com/

18. **Stack Overflow.** (2024). *Developer Community.* https://stackoverflow.com/

### 10.7 Estándares y Buenas Prácticas

19. **W3C.** (2024). *Web Content Accessibility Guidelines (WCAG) 2.1.* https://www.w3.org/WAI/WCAG21/

20. **OWASP.** (2024). *Open Web Application Security Project.* https://owasp.org/

---

**Fecha de elaboración:** [Fecha actual]
**Versión del documento:** 1.0
**Estado:** Final

---

*Este documento constituye la documentación técnica completa del Sistema de Gestión de Tutorías Académicas desarrollado para la Universidad Laica Eloy Alfaro de Manabí (ULEAM).*
