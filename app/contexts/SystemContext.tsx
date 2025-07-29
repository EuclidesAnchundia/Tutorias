"use client"

/**
 * Contexto global que almacena toda la información del sistema de tutorías.
 * Maneja usuarios, tutorías, temas, archivos y notificaciones utilizando
 * localStorage para persistencia.
 */

import { createContext, useContext, type ReactNode, useEffect } from "react"
import { useLocalStorage } from "../hooks/useLocalStorage"

interface User {
  id: string
  nombres: string
  apellidos: string
  email: string
  password: string
  rol: "estudiante" | "tutor" | "coordinador" | "administrador"
  facultad?: string
  carrera?: string
  especialidad?: string
  preguntaSeguridad: string
  respuestaSeguridad: string
  fechaRegistro: string
}

interface Tutoria {
  id: string
  estudianteEmail: string
  tutorEmail: string
  fecha: string
  hora: string
  asunto: string
  descripcion?: string
  estado: "pendiente" | "aceptada" | "rechazada" | "completada"
  fechaSolicitud: string
  observaciones?: string
  calificacion?: string
  motivoRechazo?: string
}

/**
 * Representa un tema propuesto por un estudiante.
 */
interface Tema {
  /** Identificador único del tema */
  id: string
  /** Email del estudiante que registró el tema */
  estudianteEmail: string
  /** Título del tema de titulación */
  titulo: string
  /** Descripción breve del tema */
  descripcion: string
  /** Fecha de registro en formato ISO */
  fechaRegistro: string
  /** Indica si el tema fue aprobado por el tutor */
  aprobado: boolean
  /** Observaciones del tutor tras la revisión */
  observaciones?: string
  /** Fecha en que el tutor revisó el tema */
  fechaRevision?: string
}

interface Archivo {
  id: string
  nombre: string
  tipo: string
  tamaño: number
  contenido: string
  estudianteEmail: string
  fechaSubida: string
}

interface Asignacion {
  id: string
  estudianteEmail: string
  tutorEmail: string
  coordinadorEmail: string
  fechaAsignacion: string
}

/**
 * Estructura con estadísticas generales del sistema para
 * mostrar en los paneles de administración.
 */
interface SystemStats {
  totalUsers: number
  totalStudents: number
  totalTutors: number
  totalCoordinators: number
  totalTutorias: number
  completedTutorias: number
  totalThemes: number
  totalFiles: number
  facultiesActivity: Record<string, number>
}

interface Notificacion {
  id: string
  usuarioEmail: string
  tipo: string
  mensaje: string
  datos?: any
  leida: boolean
  fecha: string
}

interface SystemContextType {
  // Usuarios
  users: User[]
  saveUser: (user: User) => void
  updateUser: (email: string, data: Partial<User>) => boolean
  deleteUser: (email: string) => boolean
  getUserByEmail: (email: string) => User | undefined
  getUsersByFaculty: (facultad: string) => User[]
  validateCredentials: (email: string, password: string) => boolean
  validateEmailDomain: (email: string) => string | null

  // Tutorías
  tutorias: Tutoria[]
  saveTutoria: (tutoria: Tutoria) => void
  updateTutoria: (id: string, data: Partial<Tutoria>) => boolean

  // Temas
  temas: Tema[]
  saveTema: (tema: Tema) => void
  getThemeByStudent: (email: string) => Tema | undefined
  updateTema: (id: string, data: Partial<Tema>) => boolean

  // Archivos
  archivos: Archivo[]
  saveArchivo: (archivo: Archivo) => void
  /** Actualiza un archivo existente */
  updateArchivo: (id: string, data: Partial<Archivo>) => boolean
  deleteArchivo: (id: string) => boolean
  getFilesByStudent: (email: string) => Archivo[]

  // Asignaciones
  asignaciones: Asignacion[]
  saveAsignacion: (asignacion: Asignacion) => void
  getAssignedTutor: (studentEmail: string) => User | undefined
  getAssignedStudents: (tutorEmail: string) => User[]
  deleteAsignacion: (id: string) => boolean

  // Notificaciones
  notificaciones: Notificacion[]
  createNotification: (userEmail: string, tipo: string, mensaje: string, datos?: any) => void
  getNotifications: (userEmail: string) => Notificacion[]
  markAsRead: (id: string) => void
  markAllAsRead: (userEmail: string) => void

  // Utilidades
  generateId: () => string
  formatDate: (date: string) => string
  resetSystem: () => void
  /** Obtiene estadísticas globales del sistema */
  getSystemStats: () => SystemStats
  forceCreateDefaultUsers: () => void
}

const SystemContext = createContext<SystemContextType | undefined>(undefined)

/**
 * Proveedor de datos principales del sistema. Encapsula la lógica de
 * almacenamiento en localStorage y expone funciones para manipularla.
 */
export function SystemProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useLocalStorage<User[]>("usuarios", [])
  const [tutorias, setTutorias] = useLocalStorage<Tutoria[]>("tutorias", [])
  const [temas, setTemas] = useLocalStorage<Tema[]>("temas", [])
  const [archivos, setArchivos] = useLocalStorage<Archivo[]>("archivos", [])
  const [asignaciones, setAsignaciones] = useLocalStorage<Asignacion[]>("asignaciones", [])
  const [notificaciones, setNotificaciones] = useLocalStorage<Notificacion[]>("notificaciones", [])

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2)

  const validateEmailDomain = (email: string): string | null => {
    const domains = {
      estudiante: "@live.uleam.edu.ec",
      tutor: "@uleam.edu.ec",
      coordinador: "@coordtit.uleam.edu.ec",
      administrador: "@admin.uleam.edu.ec",
    }

    for (const [rol, dominio] of Object.entries(domains)) {
      if (email.endsWith(dominio)) {
        return rol
      }
    }
    return null
  }

  /**
   * Registra un nuevo usuario en el arreglo de usuarios.
   */
  const saveUser = (user: User) => {
    const coordinators = users.filter((u) => u.rol === "coordinador")
    setUsers((prev) => [...prev, user])
    coordinators.forEach((coord) =>
      createNotification(
        coord.email,
        "NUEVO_USUARIO",
        `Nuevo usuario registrado: ${user.nombres} ${user.apellidos}`,
      )
    )
  }

  /**
   * Actualiza la información de un usuario identificado por su correo.
   */
  const updateUser = (email: string, data: Partial<User>): boolean => {
    const userIndex = users.findIndex((u) => u.email === email)
    if (userIndex !== -1) {
      const updatedUsers = [...users]
      updatedUsers[userIndex] = { ...updatedUsers[userIndex], ...data }
      setUsers(updatedUsers)
      return true
    }
    return false
  }

  /**
   * Elimina un usuario del sistema.
   */
  const deleteUser = (email: string): boolean => {
    const filteredUsers = users.filter((u) => u.email !== email)
    if (filteredUsers.length !== users.length) {
      setUsers(filteredUsers)
      return true
    }
    return false
  }

  const getUserByEmail = (email: string) => users.find((u) => u.email === email)

  const getUsersByFaculty = (facultad: string) => users.filter((u) => u.facultad === facultad)

  const validateCredentials = (email: string, password: string): boolean => {
    const user = getUserByEmail(email)
    return user ? user.password === password : false
  }

  const saveTutoria = (tutoria: Tutoria) => {
    setTutorias((prev) => [...prev, tutoria])
    createNotification(tutoria.tutorEmail, "NUEVA_SOLICITUD", `Nueva solicitud de tutoría: ${tutoria.asunto}`)
  }

  const updateTutoria = (id: string, data: Partial<Tutoria>): boolean => {
    const tutoriaIndex = tutorias.findIndex((t) => t.id === id)
    if (tutoriaIndex !== -1) {
      const updatedTutorias = [...tutorias]
      const oldTutoria = updatedTutorias[tutoriaIndex]
      updatedTutorias[tutoriaIndex] = { ...oldTutoria, ...data }
      setTutorias(updatedTutorias)

      if (data.estado === "aceptada" && oldTutoria.estado === "pendiente") {
        createNotification(
          oldTutoria.estudianteEmail,
          "TUTORIA_ACEPTADA",
          `Tu tutoría "${oldTutoria.asunto}" ha sido aceptada`,
        )
      } else if (data.estado === "rechazada") {
        createNotification(
          oldTutoria.estudianteEmail,
          "TUTORIA_RECHAZADA",
          `Tu tutoría "${oldTutoria.asunto}" ha sido rechazada`,
        )
      } else if (data.estado === "completada") {
        createNotification(
          oldTutoria.estudianteEmail,
          "TUTORIA_COMPLETADA",
          `Tu tutoría "${oldTutoria.asunto}" ha sido completada`,
        )
      }

      return true
    }
    return false
  }

  const saveTema = (tema: Tema) => {
    const existingIndex = temas.findIndex((t) => t.estudianteEmail === tema.estudianteEmail)
    if (existingIndex !== -1) {
      const updatedTemas = [...temas]
      updatedTemas[existingIndex] = tema
      setTemas(updatedTemas)
    } else {
      setTemas((prev) => [...prev, tema])
    }
    const tutor = getAssignedTutor(tema.estudianteEmail)
    if (tutor) {
      createNotification(
        tutor.email,
        "NUEVO_TEMA",
        `El estudiante ha propuesto un nuevo tema: ${tema.titulo}`,
      )
    }
  }

  const getThemeByStudent = (email: string) => temas.find((t) => t.estudianteEmail === email)

  /**
   * Actualiza un tema propuesto localizando su id dentro del arreglo.
   */
  const updateTema = (id: string, data: Partial<Tema>): boolean => {
    const temaIndex = temas.findIndex((t) => t.id === id)
    if (temaIndex !== -1) {
      const updatedTemas = [...temas]
      updatedTemas[temaIndex] = { ...updatedTemas[temaIndex], ...data }
      setTemas(updatedTemas)
      return true
    }
    return false
  }

  const saveArchivo = (archivo: Archivo) => {
    setArchivos((prev) => [...prev, archivo])
    const tutor = getAssignedTutor(archivo.estudianteEmail)
    if (tutor) {
      createNotification(tutor.email, "ARCHIVO_SUBIDO", `El estudiante ha subido un nuevo archivo: ${archivo.nombre}`)
    }
  }

  const updateArchivo = (id: string, data: Partial<Archivo>): boolean => {
    const archivoIndex = archivos.findIndex((a) => a.id === id)
    if (archivoIndex !== -1) {
      const updatedArchivos = [...archivos]
      updatedArchivos[archivoIndex] = { ...updatedArchivos[archivoIndex], ...data }
      setArchivos(updatedArchivos)

      const archivoActual = updatedArchivos[archivoIndex]
      const tutor = getAssignedTutor(archivoActual.estudianteEmail)
      if (tutor) {
        createNotification(
          tutor.email,
          "ARCHIVO_ACTUALIZADO",
          `El estudiante ha actualizado el archivo: ${archivoActual.nombre}`,
        )
      }

      return true
    }
    return false
  }

  const deleteArchivo = (id: string): boolean => {
    const filteredArchivos = archivos.filter((a) => a.id !== id)
    if (filteredArchivos.length !== archivos.length) {
      setArchivos(filteredArchivos)
      return true
    }
    return false
  }

  const getFilesByStudent = (email: string) => archivos.filter((a) => a.estudianteEmail === email)

  const saveAsignacion = (asignacion: Asignacion) => {
    setAsignaciones((prev) => [...prev, asignacion])
    createNotification(
      asignacion.estudianteEmail,
      "TUTOR_ASIGNADO",
      "Se te ha asignado un tutor para tu proceso de titulación",
    )
  }

  const getAssignedTutor = (studentEmail: string): User | undefined => {
    const asignacion = asignaciones.find((a) => a.estudianteEmail === studentEmail)
    return asignacion ? getUserByEmail(asignacion.tutorEmail) : undefined
  }

  const getAssignedStudents = (tutorEmail: string): User[] => {
    const tutorAsignaciones = asignaciones.filter((a) => a.tutorEmail === tutorEmail)
    return tutorAsignaciones.map((a) => getUserByEmail(a.estudianteEmail)).filter(Boolean) as User[]
  }

  const deleteAsignacion = (id: string): boolean => {
    const filteredAsignaciones = asignaciones.filter((a) => a.id !== id)
    if (filteredAsignaciones.length !== asignaciones.length) {
      setAsignaciones(filteredAsignaciones)
      return true
    }
    return false
  }

  /**
   * Crea una notificación para un usuario y la almacena en el contexto.
   */
  const createNotification = (userEmail: string, tipo: string, mensaje: string, datos?: any) => {
    const notification: Notificacion = {
      id: generateId(),
      usuarioEmail: userEmail,
      tipo,
      mensaje,
      datos,
      leida: false,
      fecha: new Date().toISOString(),
    }
    setNotificaciones((prev) => [...prev, notification])
  }

  const getNotifications = (userEmail: string) => notificaciones.filter((n) => n.usuarioEmail === userEmail)

  const markAsRead = (id: string) => {
    const notificationIndex = notificaciones.findIndex((n) => n.id === id)
    if (notificationIndex !== -1) {
      const updatedNotifications = [...notificaciones]
      updatedNotifications[notificationIndex].leida = true
      setNotificaciones(updatedNotifications)
    }
  }

  const markAllAsRead = (userEmail: string) => {
    const updatedNotifications = notificaciones.map((n) => (n.usuarioEmail === userEmail ? { ...n, leida: true } : n))
    setNotificaciones(updatedNotifications)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const resetSystem = () => {
    setUsers([])
    setTutorias([])
    setTemas([])
    setArchivos([])
    setAsignaciones([])
    setNotificaciones([])
  }

  /**
   * Calcula estadísticas generales a partir de los datos almacenados.
   */
  const getSystemStats = (): SystemStats => {
    return {
      totalUsers: users.length,
      totalStudents: users.filter((u) => u.rol === "estudiante").length,
      totalTutors: users.filter((u) => u.rol === "tutor").length,
      totalCoordinators: users.filter((u) => u.rol === "coordinador").length,
      totalTutorias: tutorias.length,
      completedTutorias: tutorias.filter((t) => t.estado === "completada").length,
      totalThemes: temas.length,
      totalFiles: archivos.length,
      facultiesActivity: users.reduce(
        (acc, user) => {
          if (user.facultad) {
            acc[user.facultad] = (acc[user.facultad] || 0) + 1
          }
          return acc
        },
        {} as Record<string, number>,
      ),
    }
  }

  // Crear datos de ejemplo si no existen
  useEffect(() => {
    if (users.length === 0) {
      const defaultUsers = [
        // Estudiantes
        {
          id: generateId(),
          nombres: "María",
          apellidos: "González",
          email: "maria.gonzalez@live.uleam.edu.ec",
          password: "estudiante123",
          rol: "estudiante" as const,
          facultad: "Facultad de Ingeniería, Industria y Arquitectura",
          carrera: "Ingeniería en Sistemas",
          preguntaSeguridad: "mascota",
          respuestaSeguridad: "firulais",
          fechaRegistro: new Date().toISOString(),
        },
        {
          id: generateId(),
          nombres: "Juan",
          apellidos: "Pérez",
          email: "juan.perez@live.uleam.edu.ec",
          password: "estudiante123",
          rol: "estudiante" as const,
          facultad: "Facultad de Ingeniería, Industria y Arquitectura",
          carrera: "Ingeniería Civil",
          preguntaSeguridad: "ciudad",
          respuestaSeguridad: "portoviejo",
          fechaRegistro: new Date().toISOString(),
        },
        {
          id: generateId(),
          nombres: "Ana",
          apellidos: "López",
          email: "ana.lopez@live.uleam.edu.ec",
          password: "estudiante123",
          rol: "estudiante" as const,
          facultad: "Facultad de Ciencias de la Salud",
          carrera: "Medicina General",
          preguntaSeguridad: "escuela",
          respuestaSeguridad: "san jose",
          fechaRegistro: new Date().toISOString(),
        },
        {
          id: generateId(),
          nombres: "Carlos",
          apellidos: "Mendoza",
          email: "carlos.mendoza@live.uleam.edu.ec",
          password: "estudiante123",
          rol: "estudiante" as const,
          facultad: "Facultad de Ciencias Administrativas, Contables y Comerciales",
          carrera: "Administración de Empresas",
          preguntaSeguridad: "mascota",
          respuestaSeguridad: "max",
          fechaRegistro: new Date().toISOString(),
        },
        // Tutores
        {
          id: generateId(),
          nombres: "Dr. Carlos",
          apellidos: "Rodríguez",
          email: "carlos.rodriguez@uleam.edu.ec",
          password: "tutor123",
          rol: "tutor" as const,
          facultad: "Facultad de Ingeniería, Industria y Arquitectura",
          especialidad: "Desarrollo de Software",
          preguntaSeguridad: "ciudad",
          respuestaSeguridad: "manta",
          fechaRegistro: new Date().toISOString(),
        },
        {
          id: generateId(),
          nombres: "Dra. Patricia",
          apellidos: "Silva",
          email: "patricia.silva@uleam.edu.ec",
          password: "tutor123",
          rol: "tutor" as const,
          facultad: "Facultad de Ingeniería, Industria y Arquitectura",
          especialidad: "Ingeniería Civil",
          preguntaSeguridad: "escuela",
          respuestaSeguridad: "uleam",
          fechaRegistro: new Date().toISOString(),
        },
        {
          id: generateId(),
          nombres: "Dr. Roberto",
          apellidos: "Vásquez",
          email: "roberto.vasquez@uleam.edu.ec",
          password: "tutor123",
          rol: "tutor" as const,
          facultad: "Facultad de Ciencias de la Salud",
          especialidad: "Medicina Interna",
          preguntaSeguridad: "mascota",
          respuestaSeguridad: "toby",
          fechaRegistro: new Date().toISOString(),
        },
        {
          id: generateId(),
          nombres: "Mg. Laura",
          apellidos: "Morales",
          email: "laura.morales@uleam.edu.ec",
          password: "tutor123",
          rol: "tutor" as const,
          facultad: "Facultad de Ciencias Administrativas, Contables y Comerciales",
          especialidad: "Gestión Empresarial",
          preguntaSeguridad: "ciudad",
          respuestaSeguridad: "chone",
          fechaRegistro: new Date().toISOString(),
        },
        // Coordinadores
        {
          id: generateId(),
          nombres: "Dra. Ana",
          apellidos: "Martínez",
          email: "ana.martinez@coordtit.uleam.edu.ec",
          password: "coordinador123",
          rol: "coordinador" as const,
          facultad: "Facultad de Ingeniería, Industria y Arquitectura",
          preguntaSeguridad: "escuela",
          respuestaSeguridad: "uleam",
          fechaRegistro: new Date().toISOString(),
        },
        {
          id: generateId(),
          nombres: "Dr. Miguel",
          apellidos: "Torres",
          email: "miguel.torres@coordtit.uleam.edu.ec",
          password: "coordinador123",
          rol: "coordinador" as const,
          facultad: "Facultad de Ciencias de la Salud",
          preguntaSeguridad: "mascota",
          respuestaSeguridad: "luna",
          fechaRegistro: new Date().toISOString(),
        },
        {
          id: generateId(),
          nombres: "Mg. Sandra",
          apellidos: "Ramírez",
          email: "sandra.ramirez@coordtit.uleam.edu.ec",
          password: "coordinador123",
          rol: "coordinador" as const,
          facultad: "Facultad de Ciencias Administrativas, Contables y Comerciales",
          preguntaSeguridad: "ciudad",
          respuestaSeguridad: "bahia",
          fechaRegistro: new Date().toISOString(),
        },
        // Administradores
        {
          id: generateId(),
          nombres: "Admin",
          apellidos: "Sistema",
          email: "admin@admin.uleam.edu.ec",
          password: "admin123",
          rol: "administrador" as const,
          facultad: "Facultad de Ciencias Administrativas, Contables y Comerciales",
          preguntaSeguridad: "mascota",
          respuestaSeguridad: "admin",
          fechaRegistro: new Date().toISOString(),
        },
        {
          id: generateId(),
          nombres: "Super",
          apellidos: "Admin",
          email: "superadmin@admin.uleam.edu.ec",
          password: "admin123",
          rol: "administrador" as const,
          facultad: "Sistemas",
          preguntaSeguridad: "escuela",
          respuestaSeguridad: "uleam",
          fechaRegistro: new Date().toISOString(),
        },
      ]

      setUsers(defaultUsers)

      // Crear temas de ejemplo
      const defaultTemas = [
        {
          id: generateId(),
          estudianteEmail: "maria.gonzalez@live.uleam.edu.ec",
          titulo: "Sistema Web para Gestión de Inventarios",
          descripcion:
            "Desarrollo de una aplicación web para el control y gestión de inventarios en pequeñas y medianas empresas, utilizando tecnologías modernas como React y Node.js.",
          fechaRegistro: new Date().toISOString(),
          aprobado: true,
        },
        {
          id: generateId(),
          estudianteEmail: "juan.perez@live.uleam.edu.ec",
          titulo: "Análisis Estructural de Puentes Colgantes",
          descripcion:
            "Estudio del comportamiento estructural de puentes colgantes bajo diferentes cargas y condiciones climáticas, aplicando métodos de elementos finitos.",
          fechaRegistro: new Date().toISOString(),
          aprobado: false,
        },
        {
          id: generateId(),
          estudianteEmail: "ana.lopez@live.uleam.edu.ec",
          titulo: "Prevalencia de Diabetes en Adultos Mayores",
          descripcion:
            "Investigación epidemiológica sobre la prevalencia de diabetes tipo 2 en adultos mayores de 65 años en la provincia de Manabí.",
          fechaRegistro: new Date().toISOString(),
          aprobado: true,
        },
      ]

      setTemas(defaultTemas)

      // Crear asignaciones de ejemplo
      const defaultAsignaciones = [
        {
          id: generateId(),
          estudianteEmail: "maria.gonzalez@live.uleam.edu.ec",
          tutorEmail: "carlos.rodriguez@uleam.edu.ec",
          coordinadorEmail: "ana.martinez@coordtit.uleam.edu.ec",
          fechaAsignacion: new Date().toISOString(),
        },
        {
          id: generateId(),
          estudianteEmail: "juan.perez@live.uleam.edu.ec",
          tutorEmail: "patricia.silva@uleam.edu.ec",
          coordinadorEmail: "ana.martinez@coordtit.uleam.edu.ec",
          fechaAsignacion: new Date().toISOString(),
        },
        {
          id: generateId(),
          estudianteEmail: "ana.lopez@live.uleam.edu.ec",
          tutorEmail: "roberto.vasquez@uleam.edu.ec",
          coordinadorEmail: "miguel.torres@coordtit.uleam.edu.ec",
          fechaAsignacion: new Date().toISOString(),
        },
      ]

      setAsignaciones(defaultAsignaciones)

      // Crear tutorías de ejemplo
      const defaultTutorias = [
        {
          id: generateId(),
          estudianteEmail: "maria.gonzalez@live.uleam.edu.ec",
          tutorEmail: "carlos.rodriguez@uleam.edu.ec",
          fecha: "2024-02-15",
          hora: "10:00",
          asunto: "Revisión del Marco Teórico",
          descripcion: "Revisión y corrección del marco teórico del proyecto de titulación",
          estado: "completada" as const,
          fechaSolicitud: new Date().toISOString(),
          observaciones: "Excelente trabajo en la investigación bibliográfica",
          calificacion: "Excelente",
        },
        {
          id: generateId(),
          estudianteEmail: "maria.gonzalez@live.uleam.edu.ec",
          tutorEmail: "carlos.rodriguez@uleam.edu.ec",
          fecha: "2024-02-20",
          hora: "14:00",
          asunto: "Desarrollo del Prototipo",
          descripcion: "Revisión del avance en el desarrollo del sistema web",
          estado: "aceptada" as const,
          fechaSolicitud: new Date().toISOString(),
        },
        {
          id: generateId(),
          estudianteEmail: "juan.perez@live.uleam.edu.ec",
          tutorEmail: "patricia.silva@uleam.edu.ec",
          fecha: "2024-02-18",
          hora: "09:00",
          asunto: "Metodología de Investigación",
          descripcion: "Definición de la metodología para el análisis estructural",
          estado: "pendiente" as const,
          fechaSolicitud: new Date().toISOString(),
        },
        {
          id: generateId(),
          estudianteEmail: "ana.lopez@live.uleam.edu.ec",
          tutorEmail: "roberto.vasquez@uleam.edu.ec",
          fecha: "2024-02-12",
          hora: "11:00",
          asunto: "Diseño de la Investigación",
          descripcion: "Planificación del estudio epidemiológico",
          estado: "completada" as const,
          fechaSolicitud: new Date().toISOString(),
          observaciones: "Muy buen planteamiento metodológico",
          calificacion: "Muy Bueno",
        },
      ]

      setTutorias(defaultTutorias)

      // Crear archivos de ejemplo
      const defaultArchivos = [
        {
          id: generateId(),
          nombre: "Marco_Teorico_v1.pdf",
          tipo: "application/pdf",
          tamaño: 2048576, // 2MB
          contenido:
            "data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQLQKMC4wNzcgMCAwIDEgNTAgNzUwIFRtCihNYXJjbyBUZcOzcmljbykgVGoKRVQKZW5kc3RyZWFtCmVuZG9iago=",
          estudianteEmail: "maria.gonzalez@live.uleam.edu.ec",
          fechaSubida: new Date().toISOString(),
        },
        {
          id: generateId(),
          nombre: "Capitulo1_Introduccion.pdf",
          tipo: "application/pdf",
          tamaño: 1536000, // 1.5MB
          contenido:
            "data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQLQKMC4wNzcgMCAwIDEgNTAgNzUwIFRtCihJbnRyb2R1Y2Npw7NuKSBUagoKRVQKZW5kc3RyZWFtCmVuZG9iago=",
          estudianteEmail: "juan.perez@live.uleam.edu.ec",
          fechaSubida: new Date().toISOString(),
        },
        {
          id: generateId(),
          nombre: "Metodologia_Investigacion.pdf",
          tipo: "application/pdf",
          tamaño: 3072000, // 3MB
          contenido:
            "data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQLQKMC4wNzcgMCAwIDEgNTAgNzUwIFRtCihNZXRvZG9sb2fDrWEpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmo=",
          estudianteEmail: "ana.lopez@live.uleam.edu.ec",
          fechaSubida: new Date().toISOString(),
        },
      ]

      setArchivos(defaultArchivos)

      // Crear notificaciones de ejemplo
      const defaultNotificaciones = [
        {
          id: generateId(),
          usuarioEmail: "maria.gonzalez@live.uleam.edu.ec",
          tipo: "TUTORIA_COMPLETADA",
          mensaje: "Tu tutoría 'Revisión del Marco Teórico' ha sido completada",
          leida: false,
          fecha: new Date().toISOString(),
        },
        {
          id: generateId(),
          usuarioEmail: "maria.gonzalez@live.uleam.edu.ec",
          tipo: "TUTORIA_ACEPTADA",
          mensaje: "Tu tutoría 'Desarrollo del Prototipo' ha sido aceptada",
          leida: true,
          fecha: new Date().toISOString(),
        },
        {
          id: generateId(),
          usuarioEmail: "carlos.rodriguez@uleam.edu.ec",
          tipo: "NUEVA_SOLICITUD",
          mensaje: "Nueva solicitud de tutoría: Desarrollo del Prototipo",
          leida: false,
          fecha: new Date().toISOString(),
        },
        {
          id: generateId(),
          usuarioEmail: "juan.perez@live.uleam.edu.ec",
          tipo: "TUTOR_ASIGNADO",
          mensaje: "Se te ha asignado un tutor para tu proceso de titulación",
          leida: true,
          fecha: new Date().toISOString(),
        },
      ]

      setNotificaciones(defaultNotificaciones)
    }
  }, [users.length])

  const forceCreateDefaultUsers = () => {
    // Limpiar todos los datos primero
    setUsers([])
    setTutorias([])
    setTemas([])
    setArchivos([])
    setAsignaciones([])
    setNotificaciones([])

    // Recrear todos los datos de ejemplo
    const defaultUsers = [
      // Estudiantes
      {
        id: generateId(),
        nombres: "María",
        apellidos: "González",
        email: "maria.gonzalez@live.uleam.edu.ec",
        password: "estudiante123",
        rol: "estudiante" as const,
        facultad: "Facultad de Ingeniería, Industria y Arquitectura",
        carrera: "Ingeniería en Sistemas",
        preguntaSeguridad: "mascota",
        respuestaSeguridad: "firulais",
        fechaRegistro: new Date().toISOString(),
      },
      {
        id: generateId(),
        nombres: "Juan",
        apellidos: "Pérez",
        email: "juan.perez@live.uleam.edu.ec",
        password: "estudiante123",
        rol: "estudiante" as const,
        facultad: "Facultad de Ingeniería, Industria y Arquitectura",
        carrera: "Ingeniería Civil",
        preguntaSeguridad: "ciudad",
        respuestaSeguridad: "portoviejo",
        fechaRegistro: new Date().toISOString(),
      },
      {
        id: generateId(),
        nombres: "Ana",
        apellidos: "López",
        email: "ana.lopez@live.uleam.edu.ec",
        password: "estudiante123",
        rol: "estudiante" as const,
        facultad: "Facultad de Ciencias de la Salud",
        carrera: "Medicina General",
        preguntaSeguridad: "escuela",
        respuestaSeguridad: "san jose",
        fechaRegistro: new Date().toISOString(),
      },
      {
        id: generateId(),
        nombres: "Carlos",
        apellidos: "Mendoza",
        email: "carlos.mendoza@live.uleam.edu.ec",
        password: "estudiante123",
        rol: "estudiante" as const,
        facultad: "Facultad de Ciencias Administrativas, Contables y Comerciales",
        carrera: "Administración de Empresas",
        preguntaSeguridad: "mascota",
        respuestaSeguridad: "max",
        fechaRegistro: new Date().toISOString(),
      },
      // Tutores
      {
        id: generateId(),
        nombres: "Dr. Carlos",
        apellidos: "Rodríguez",
        email: "carlos.rodriguez@uleam.edu.ec",
        password: "tutor123",
        rol: "tutor" as const,
        facultad: "Facultad de Ingeniería, Industria y Arquitectura",
        especialidad: "Desarrollo de Software",
        preguntaSeguridad: "ciudad",
        respuestaSeguridad: "manta",
        fechaRegistro: new Date().toISOString(),
      },
      {
        id: generateId(),
        nombres: "Dra. Patricia",
        apellidos: "Silva",
        email: "patricia.silva@uleam.edu.ec",
        password: "tutor123",
        rol: "tutor" as const,
        facultad: "Facultad de Ingeniería, Industria y Arquitectura",
        especialidad: "Ingeniería Civil",
        preguntaSeguridad: "escuela",
        respuestaSeguridad: "uleam",
        fechaRegistro: new Date().toISOString(),
      },
      {
        id: generateId(),
        nombres: "Dr. Roberto",
        apellidos: "Vásquez",
        email: "roberto.vasquez@uleam.edu.ec",
        password: "tutor123",
        rol: "tutor" as const,
        facultad: "Facultad de Ciencias de la Salud",
        especialidad: "Medicina Interna",
        preguntaSeguridad: "mascota",
        respuestaSeguridad: "toby",
        fechaRegistro: new Date().toISOString(),
      },
      {
        id: generateId(),
        nombres: "Mg. Laura",
        apellidos: "Morales",
        email: "laura.morales@uleam.edu.ec",
        password: "tutor123",
        rol: "tutor" as const,
        facultad: "Facultad de Ciencias Administrativas, Contables y Comerciales",
        especialidad: "Gestión Empresarial",
        preguntaSeguridad: "ciudad",
        respuestaSeguridad: "chone",
        fechaRegistro: new Date().toISOString(),
      },
      // Coordinadores
      {
        id: generateId(),
        nombres: "Dra. Ana",
        apellidos: "Martínez",
        email: "ana.martinez@coordtit.uleam.edu.ec",
        password: "coordinador123",
        rol: "coordinador" as const,
        facultad: "Facultad de Ingeniería, Industria y Arquitectura",
        preguntaSeguridad: "escuela",
        respuestaSeguridad: "uleam",
        fechaRegistro: new Date().toISOString(),
      },
      {
        id: generateId(),
        nombres: "Dr. Miguel",
        apellidos: "Torres",
        email: "miguel.torres@coordtit.uleam.edu.ec",
        password: "coordinador123",
        rol: "coordinador" as const,
        facultad: "Facultad de Ciencias de la Salud",
        preguntaSeguridad: "mascota",
        respuestaSeguridad: "luna",
        fechaRegistro: new Date().toISOString(),
      },
      {
        id: generateId(),
        nombres: "Mg. Sandra",
        apellidos: "Ramírez",
        email: "sandra.ramirez@coordtit.uleam.edu.ec",
        password: "coordinador123",
        rol: "coordinador" as const,
        facultad: "Facultad de Ciencias Administrativas, Contables y Comerciales",
        preguntaSeguridad: "ciudad",
        respuestaSeguridad: "bahia",
        fechaRegistro: new Date().toISOString(),
      },
      // Administradores
      {
        id: generateId(),
        nombres: "Admin",
        apellidos: "Sistema",
        email: "admin@admin.uleam.edu.ec",
        password: "admin123",
        rol: "administrador" as const,
        facultad: "Facultad de Ciencias Administrativas, Contables y Comerciales",
        preguntaSeguridad: "mascota",
        respuestaSeguridad: "admin",
        fechaRegistro: new Date().toISOString(),
      },
      {
        id: generateId(),
        nombres: "Super",
        apellidos: "Admin",
        email: "superadmin@admin.uleam.edu.ec",
        password: "admin123",
        rol: "administrador" as const,
        facultad: "Sistemas",
        preguntaSeguridad: "escuela",
        respuestaSeguridad: "uleam",
        fechaRegistro: new Date().toISOString(),
      },
    ]

    setUsers(defaultUsers)

    // Crear temas de ejemplo
    const defaultTemas = [
      {
        id: generateId(),
        estudianteEmail: "maria.gonzalez@live.uleam.edu.ec",
        titulo: "Sistema Web para Gestión de Inventarios",
        descripcion:
          "Desarrollo de una aplicación web para el control y gestión de inventarios en pequeñas y medianas empresas, utilizando tecnologías modernas como React y Node.js.",
        fechaRegistro: new Date().toISOString(),
        aprobado: true,
      },
      {
        id: generateId(),
        estudianteEmail: "juan.perez@live.uleam.edu.ec",
        titulo: "Análisis Estructural de Puentes Colgantes",
        descripcion:
          "Estudio del comportamiento estructural de puentes colgantes bajo diferentes cargas y condiciones climáticas, aplicando métodos de elementos finitos.",
        fechaRegistro: new Date().toISOString(),
        aprobado: false,
      },
      {
        id: generateId(),
        estudianteEmail: "ana.lopez@live.uleam.edu.ec",
        titulo: "Prevalencia de Diabetes en Adultos Mayores",
        descripcion:
          "Investigación epidemiológica sobre la prevalencia de diabetes tipo 2 en adultos mayores de 65 años en la provincia de Manabí.",
        fechaRegistro: new Date().toISOString(),
        aprobado: true,
      },
    ]

    setTemas(defaultTemas)

    // Crear asignaciones de ejemplo
    const defaultAsignaciones = [
      {
        id: generateId(),
        estudianteEmail: "maria.gonzalez@live.uleam.edu.ec",
        tutorEmail: "carlos.rodriguez@uleam.edu.ec",
        coordinadorEmail: "ana.martinez@coordtit.uleam.edu.ec",
        fechaAsignacion: new Date().toISOString(),
      },
      {
        id: generateId(),
        estudianteEmail: "juan.perez@live.uleam.edu.ec",
        tutorEmail: "patricia.silva@uleam.edu.ec",
        coordinadorEmail: "ana.martinez@coordtit.uleam.edu.ec",
        fechaAsignacion: new Date().toISOString(),
      },
      {
        id: generateId(),
        estudianteEmail: "ana.lopez@live.uleam.edu.ec",
        tutorEmail: "roberto.vasquez@uleam.edu.ec",
        coordinadorEmail: "miguel.torres@coordtit.uleam.edu.ec",
        fechaAsignacion: new Date().toISOString(),
      },
    ]

    setAsignaciones(defaultAsignaciones)

    // Crear tutorías de ejemplo
    const defaultTutorias = [
      {
        id: generateId(),
        estudianteEmail: "maria.gonzalez@live.uleam.edu.ec",
        tutorEmail: "carlos.rodriguez@uleam.edu.ec",
        fecha: "2024-02-15",
        hora: "10:00",
        asunto: "Revisión del Marco Teórico",
        descripcion: "Revisión y corrección del marco teórico del proyecto de titulación",
        estado: "completada" as const,
        fechaSolicitud: new Date().toISOString(),
        observaciones: "Excelente trabajo en la investigación bibliográfica",
        calificacion: "Excelente",
      },
      {
        id: generateId(),
        estudianteEmail: "maria.gonzalez@live.uleam.edu.ec",
        tutorEmail: "carlos.rodriguez@uleam.edu.ec",
        fecha: "2024-02-20",
        hora: "14:00",
        asunto: "Desarrollo del Prototipo",
        descripcion: "Revisión del avance en el desarrollo del sistema web",
        estado: "aceptada" as const,
        fechaSolicitud: new Date().toISOString(),
      },
      {
        id: generateId(),
        estudianteEmail: "juan.perez@live.uleam.edu.ec",
        tutorEmail: "patricia.silva@uleam.edu.ec",
        fecha: "2024-02-18",
        hora: "09:00",
        asunto: "Metodología de Investigación",
        descripcion: "Definición de la metodología para el análisis estructural",
        estado: "pendiente" as const,
        fechaSolicitud: new Date().toISOString(),
      },
      {
        id: generateId(),
        estudianteEmail: "ana.lopez@live.uleam.edu.ec",
        tutorEmail: "roberto.vasquez@uleam.edu.ec",
        fecha: "2024-02-12",
        hora: "11:00",
        asunto: "Diseño de la Investigación",
        descripcion: "Planificación del estudio epidemiológico",
        estado: "completada" as const,
        fechaSolicitud: new Date().toISOString(),
        observaciones: "Muy buen planteamiento metodológico",
        calificacion: "Muy Bueno",
      },
    ]

    setTutorias(defaultTutorias)

    // Crear archivos de ejemplo
    const defaultArchivos = [
      {
        id: generateId(),
        nombre: "Marco_Teorico_v1.pdf",
        tipo: "application/pdf",
        tamaño: 2048576, // 2MB
        contenido:
          "data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQLQKMC4wNzcgMCAwIDEgNTAgNzUwIFRtCihNYXJjbyBUZcOzcmljbykgVGoKRVQKZW5kc3RyZWFtCmVuZG9iago=",
        estudianteEmail: "maria.gonzalez@live.uleam.edu.ec",
        fechaSubida: new Date().toISOString(),
      },
      {
        id: generateId(),
        nombre: "Capitulo1_Introduccion.pdf",
        tipo: "application/pdf",
        tamaño: 1536000, // 1.5MB
        contenido:
          "data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQLQKMC4wNzcgMCAwIDEgNTAgNzUwIFRtCihJbnRyb2R1Y2Npw7NuKSBUagoKRVQKZW5kc3RyZWFtCmVuZG9iago=",
        estudianteEmail: "juan.perez@live.uleam.edu.ec",
        fechaSubida: new Date().toISOString(),
      },
      {
        id: generateId(),
        nombre: "Metodologia_Investigacion.pdf",
        tipo: "application/pdf",
        tamaño: 3072000, // 3MB
        contenido:
          "data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQLQKMC4wNzcgMCAwIDEgNTAgNzUwIFRtCihNZXRvZG9sb2fDrWEpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmo=",
        estudianteEmail: "ana.lopez@live.uleam.edu.ec",
        fechaSubida: new Date().toISOString(),
      },
    ]

    setArchivos(defaultArchivos)

    // Crear notificaciones de ejemplo
    const defaultNotificaciones = [
      {
        id: generateId(),
        usuarioEmail: "maria.gonzalez@live.uleam.edu.ec",
        tipo: "TUTORIA_COMPLETADA",
        mensaje: "Tu tutoría 'Revisión del Marco Teórico' ha sido completada",
        leida: false,
        fecha: new Date().toISOString(),
      },
      {
        id: generateId(),
        usuarioEmail: "maria.gonzalez@live.uleam.edu.ec",
        tipo: "TUTORIA_ACEPTADA",
        mensaje: "Tu tutoría 'Desarrollo del Prototipo' ha sido aceptada",
        leida: true,
        fecha: new Date().toISOString(),
      },
      {
        id: generateId(),
        usuarioEmail: "carlos.rodriguez@uleam.edu.ec",
        tipo: "NUEVA_SOLICITUD",
        mensaje: "Nueva solicitud de tutoría: Desarrollo del Prototipo",
        leida: false,
        fecha: new Date().toISOString(),
      },
      {
        id: generateId(),
        usuarioEmail: "juan.perez@live.uleam.edu.ec",
        tipo: "TUTOR_ASIGNADO",
        mensaje: "Se te ha asignado un tutor para tu proceso de titulación",
        leida: true,
        fecha: new Date().toISOString(),
      },
    ]

    setNotificaciones(defaultNotificaciones)
  }

  return (
    <SystemContext.Provider
      value={{
        users,
        saveUser,
        updateUser,
        deleteUser,
        getUserByEmail,
        getUsersByFaculty,
        validateCredentials,
        validateEmailDomain,
        tutorias,
        saveTutoria,
        updateTutoria,
        temas,
        saveTema,
        getThemeByStudent,
        updateTema,
        archivos,
        saveArchivo,
        updateArchivo,
        deleteArchivo,
        getFilesByStudent,
        asignaciones,
        saveAsignacion,
        getAssignedTutor,
        getAssignedStudents,
        deleteAsignacion,
        notificaciones,
        createNotification,
        getNotifications,
        markAsRead,
        markAllAsRead,
        generateId,
        formatDate,
        resetSystem,
        getSystemStats,
        forceCreateDefaultUsers, // Agregar esta línea
      }}
    >
      {children}
    </SystemContext.Provider>
  )
}

export function useSystem() {
  const context = useContext(SystemContext)
  if (context === undefined) {
    throw new Error("useSystem must be used within a SystemProvider")
  }
  return context
}
