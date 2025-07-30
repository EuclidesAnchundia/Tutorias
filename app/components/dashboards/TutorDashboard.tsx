"use client"


import { useState } from "react"
import type React from "react"

import { useSystem } from "../../contexts/SystemContext"
import { useAuth } from "../../contexts/AuthContext"
import { useToast } from "../ui/toast"
import DashboardLayout from "../Layout/DashboardLayout"
import {
  Calendar,
  Users,
  User,
  Check,
  X,
  Star,
  Edit,
  Save,
  Send,
  CheckCircle,
  XCircle,
  ChevronRight,
  BookOpen,
  FileText,
} from "lucide-react"
import StudentDetailsPanel from "../Panels/StudentDetailsPanel"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table"

export default function TutorDashboard() {
  const [activeSection, setActiveSection] = useState("tutorias")
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)
  const { user, updateProfile } = useAuth()
  const { addToast } = useToast()
  const {
    tutorias,
    updateTutoria,
    getAssignedStudents,
    archivos,
    createNotification,
    temas,
    getThemeByStudent,
    updateTema,
  } = useSystem()

  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    nombres: user?.nombres || "",
    apellidos: user?.apellidos || "",
    password: "",
    confirmPassword: "",
    facultad: user?.facultad || "",
    especialidad: user?.especialidad || "",
  })

  // Función para enviar mensajes a un estudiante específico
  const sendMessageTo = (email: string, mensaje: string) => {
    if (!mensaje.trim()) {
      addToast({
        type: "error",
        title: "Campos requeridos",
        description: "Escribe un mensaje para el estudiante.",
      })
      return false
    }

    createNotification(email, "MENSAJE_TUTOR", `Mensaje de tu tutor: ${mensaje}`)

    addToast({
      type: "success",
      title: "Mensaje enviado",
      description: "El mensaje ha sido enviado al estudiante.",
    })

    return true
  }

  const tutorTutorias = tutorias.filter((t) => t.tutorEmail === user?.email)
  const assignedStudents = getAssignedStudents(user?.email || "")
  const studentFiles = archivos.filter((a) => assignedStudents.some((student) => student.email === a.estudianteEmail))

  /**
   * Acepta o rechaza una tutoría existente.
   */
  const handleTutoriaAction = (tutoriaId: string, action: "aceptar" | "rechazar", observaciones?: string) => {
    const newState = action === "aceptar" ? "aceptada" : "rechazada"
    const success = updateTutoria(tutoriaId, {
      estado: newState,
      observaciones: observaciones || "",
    })

    if (success) {
      addToast({
        type: action === "aceptar" ? "success" : "warning",
        title: `Tutoría ${action === "aceptar" ? "aceptada" : "rechazada"}`,
        description: `La tutoría ha sido ${action === "aceptar" ? "aceptada" : "rechazada"} correctamente.`,
      })
    } else {
      addToast({
        type: "error",
        title: "Error",
        description: "No se pudo actualizar la tutoría.",
      })
    }
  }

  /**
   * Marca una tutoría como completada y registra la calificación.
   */
  const handleCompleteTutoria = (tutoriaId: string, calificacion: string, observaciones: string) => {
    const success = updateTutoria(tutoriaId, {
      estado: "completada",
      calificacion,
      observaciones,
    })

    if (success) {
      addToast({
        type: "success",
        title: "Tutoría completada",
        description: "La tutoría ha sido marcada como completada.",
      })
    }
  }

  /**
   * Aprueba o rechaza un tema propuesto por un estudiante.
   */
  const handleThemeAction = (themeId: string, action: "aprobar" | "rechazar", observaciones?: string) => {
    const success = updateTema(themeId, {
      aprobado: action === "aprobar",
      observaciones: observaciones || "",
      fechaRevision: new Date().toISOString(),
    })

    if (success) {
      const theme = temas.find((t) => t.id === themeId)
      const student = assignedStudents.find((s) => s.email === theme?.estudianteEmail)

      // Crear notificación para el estudiante
      if (theme && student) {
        createNotification(
          student.email,
          action === "aprobar" ? "TEMA_APROBADO" : "TEMA_RECHAZADO",
          `Tu tema "${theme.titulo}" ha sido ${action === "aprobar" ? "aprobado" : "rechazado"}${
            observaciones ? `. Observaciones: ${observaciones}` : ""
          }`,
        )
      }

      addToast({
        type: action === "aprobar" ? "success" : "warning",
        title: `Tema ${action === "aprobar" ? "aprobado" : "rechazado"}`,
        description: `El tema ha sido ${action === "aprobar" ? "aprobado" : "rechazado"} correctamente.`,
      })
    } else {
      addToast({
        type: "error",
        title: "Error",
        description: "No se pudo actualizar el tema.",
      })
    }
  }

  /**
   * Actualiza el perfil del tutor con los datos del formulario.
   */
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()

    if (profileForm.password && profileForm.password !== profileForm.confirmPassword) {
      addToast({
        type: "error",
        title: "Error de contraseña",
        description: "Las contraseñas no coinciden.",
      })
      return
    }

    const updateData: any = {
      nombres: profileForm.nombres,
      apellidos: profileForm.apellidos,
      facultad: profileForm.facultad,
      especialidad: profileForm.especialidad,
    }

    if (profileForm.password) {
      updateData.password = profileForm.password
    }

    const success = updateProfile(updateData)
    if (success) {
      addToast({
        type: "success",
        title: "Perfil actualizado",
        description: "Tu perfil ha sido actualizado correctamente.",
      })
      setEditingProfile(false)
      setProfileForm({ ...profileForm, password: "", confirmPassword: "" })
    }
  }


  /**
   * Descarga un archivo previamente subido por un estudiante.
   */
  const handleDownloadFile = (archivo: any) => {
    try {
      const link = document.createElement("a")
      link.href = archivo.contenido
      link.download = archivo.nombre
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      addToast({
        type: "success",
        title: "Descarga iniciada",
        description: `Descargando ${archivo.nombre}`,
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Error de descarga",
        description: "No se pudo descargar el archivo.",
      })
    }
  }

  const sidebar = (
    <ul className="space-y-2">
      <li>
        <button
          onClick={() => setActiveSection("tutorias")}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
            activeSection === "tutorias" ? "bg-red-100 text-red-700" : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Calendar size={20} />
          Mis Tutorías
        </button>
      </li>
      <li>
        <button
          onClick={() => setActiveSection("estudiantes")}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
            activeSection === "estudiantes" ? "bg-red-100 text-red-700" : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Users size={20} />
          Mis Estudiantes
        </button>
      </li>
      <li>
        <button
          onClick={() => setActiveSection("perfil")}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
            activeSection === "perfil" ? "bg-red-100 text-red-700" : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <User size={20} />
          Mi Perfil
        </button>
      </li>
    </ul>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "tutorias":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Gestión de Tutorías</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Calendar className="text-yellow-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Pendientes</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {tutorTutorias.filter((t) => t.estado === "pendiente").length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Check className="text-green-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Aceptadas</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {tutorTutorias.filter((t) => t.estado === "aceptada").length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Star className="text-blue-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Completadas</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {tutorTutorias.filter((t) => t.estado === "completada").length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Solicitudes de Tutoría</h3>
              {tutorTutorias.length === 0 ? (
                <p className="text-gray-500">No tienes tutorías asignadas.</p>
              ) : (
                <div className="space-y-4">
                  {tutorTutorias.map((tutoria) => (
                    <TutoriaCard
                      key={tutoria.id}
                      tutoria={tutoria}
                      onAction={handleTutoriaAction}
                      onComplete={handleCompleteTutoria}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )

      case "estudiantes":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Mis Estudiantes Asignados</h2>

            {assignedStudents.length === 0 ? (
              <p className="text-gray-500">No tienes estudiantes asignados.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {assignedStudents.map((student) => (
                  <StudentCard key={student.id} student={student} onSelect={setSelectedStudent} />
                ))}
              </div>
            )}
          </div>
        )


      case "perfil":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Mi Perfil</h2>
              <button
                onClick={() => {
                  setEditingProfile(!editingProfile)
                  if (!editingProfile) {
                    setProfileForm({
                      nombres: user?.nombres || "",
                      apellidos: user?.apellidos || "",
                      password: "",
                      confirmPassword: "",
                      facultad: user?.facultad || "",
                      especialidad: user?.especialidad || "",
                    })
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <Edit size={16} />
                {editingProfile ? "Cancelar" : "Editar Perfil"}
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              {editingProfile ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombres</label>
                      <input
                        type="text"
                        value={profileForm.nombres}
                        onChange={(e) => setProfileForm({ ...profileForm, nombres: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos</label>
                      <input
                        type="text"
                        value={profileForm.apellidos}
                        onChange={(e) => setProfileForm({ ...profileForm, apellidos: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email (No editable)</label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facultad</label>
                    <select
                      value={profileForm.facultad}
                      onChange={(e) => setProfileForm({ ...profileForm, facultad: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    >
                      <option value="">Seleccionar facultad...</option>
                      <option value="Facultad Ciencias Sociales, Derecho y Bienestar">
                        Facultad Ciencias Sociales, Derecho y Bienestar
                      </option>
                      <option value="Facultad de Educación, Turismo, Artes y Humanidades">
                        Facultad de Educación, Turismo, Artes y Humanidades
                      </option>
                      <option value="Facultad de Ciencias Administrativas, Contables y Comerciales">
                        Facultad de Ciencias Administrativas, Contables y Comerciales
                      </option>
                      <option value="Facultad de Ciencias de la Salud">Facultad de Ciencias de la Salud</option>
                      <option value="Facultad de Ingeniería, Industria y Arquitectura">
                        Facultad de Ingeniería, Industria y Arquitectura
                      </option>
                      <option value="Facultad de Ciencias de la Vida y Tecnologías">
                        Facultad de Ciencias de la Vida y Tecnologías
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Especialidad</label>
                    <input
                      type="text"
                      value={profileForm.especialidad}
                      onChange={(e) => setProfileForm({ ...profileForm, especialidad: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nueva Contraseña (opcional)
                      </label>
                      <input
                        type="password"
                        value={profileForm.password}
                        onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
                      <input
                        type="password"
                        value={profileForm.confirmPassword}
                        onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
                    >
                      <Save size={16} />
                      Guardar Cambios
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProfile(false)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2"
                    >
                      <X size={16} />
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombres</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.nombres}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Apellidos</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.apellidos}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rol</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{user?.rol}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Facultad</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.facultad}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Especialidad</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.especialidad}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <DashboardLayout
      sidebar={sidebar}
      title={
        activeSection === "tutorias"
          ? "Mis Tutorías"
          : activeSection === "estudiantes"
            ? "Mis Estudiantes"
            : "Mi Perfil"
      }
    >
      {renderContent()}
      {selectedStudent && (
        <StudentDetailsPanel student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}
    </DashboardLayout>
  )
}

// Componente para cada tutoría
function TutoriaCard({
  tutoria,
  onAction,
  onComplete,
}: {
  tutoria: any
  onAction: (id: string, action: "aceptar" | "rechazar", observaciones?: string) => void
  onComplete: (id: string, calificacion: string, observaciones: string) => void
}) {
  const [showActions, setShowActions] = useState(false)
  const [observaciones, setObservaciones] = useState("")
  const [calificacion, setCalificacion] = useState("")
  const [showComplete, setShowComplete] = useState(false)

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900">{tutoria.asunto}</h4>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            tutoria.estado === "aceptada"
              ? "bg-green-100 text-green-800"
              : tutoria.estado === "rechazada"
                ? "bg-red-100 text-red-800"
                : tutoria.estado === "completada"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {tutoria.estado}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-2">Estudiante: {tutoria.estudianteEmail}</p>
      <p className="text-sm text-gray-600 mb-2">
        Fecha: {tutoria.fecha} a las {tutoria.hora}
      </p>

      {tutoria.descripcion && <p className="text-sm text-gray-700 mb-3">{tutoria.descripcion}</p>}

      {tutoria.estado === "pendiente" && (
        <div className="flex gap-2">
          <button
            onClick={() => onAction(tutoria.id, "aceptar")}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
          >
            <Check size={14} />
            Aceptar
          </button>
          <button
            onClick={() => setShowActions(true)}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center gap-1"
          >
            <X size={14} />
            Rechazar
          </button>
        </div>
      )}

      {tutoria.estado === "aceptada" && (
        <button
          onClick={() => setShowComplete(true)}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          Marcar como Completada
        </button>
      )}

      {showActions && (
        <div className="mt-3 p-3 bg-gray-50 rounded">
          <textarea
            placeholder="Motivo del rechazo (opcional)"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            rows={2}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                onAction(tutoria.id, "rechazar", observaciones)
                setShowActions(false)
                setObservaciones("")
              }}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Confirmar Rechazo
            </button>
            <button
              onClick={() => setShowActions(false)}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {showComplete && (
        <div className="mt-3 p-3 bg-gray-50 rounded">
          <div className="space-y-2">
            <select
              value={calificacion}
              onChange={(e) => setCalificacion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="">Seleccionar calificación</option>
              <option value="Excelente">Excelente</option>
              <option value="Muy Bueno">Muy Bueno</option>
              <option value="Bueno">Bueno</option>
              <option value="Regular">Regular</option>
            </select>
            <textarea
              placeholder="Observaciones finales"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              rows={2}
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                if (calificacion) {
                  onComplete(tutoria.id, calificacion, observaciones)
                  setShowComplete(false)
                  setCalificacion("")
                  setObservaciones("")
                }
              }}
              disabled={!calificacion}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              Completar
            </button>
            <button
              onClick={() => setShowComplete(false)}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {tutoria.observaciones && (
        <div className="mt-3 p-2 bg-gray-50 rounded">
          <p className="text-sm text-gray-700">
            <strong>Observaciones:</strong> {tutoria.observaciones}
          </p>
        </div>
      )}

      {tutoria.calificacion && (
        <div className="mt-2 p-2 bg-blue-50 rounded">
          <p className="text-sm text-blue-800">
            <strong>Calificación:</strong> {tutoria.calificacion}
          </p>
        </div>
      )}
    </div>
  )
}

// Componente para aprobar/rechazar temas
function ThemeActionButtons({
  themeId,
  onAction,
}: {
  themeId: string
  onAction: (id: string, action: "aprobar" | "rechazar", observaciones?: string) => void
}) {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [observaciones, setObservaciones] = useState("")

  return (
    <div className="space-y-3">
      {!showRejectForm ? (
        <div className="flex gap-2">
          <button
            onClick={() => onAction(themeId, "aprobar")}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
          >
            <CheckCircle size={14} />
            Aprobar Tema
          </button>
          <button
            onClick={() => setShowRejectForm(true)}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center gap-1"
          >
            <XCircle size={14} />
            Rechazar Tema
          </button>
        </div>
      ) : (
        <div className="p-3 bg-red-50 rounded">
          <textarea
            placeholder="Motivo del rechazo y sugerencias para el estudiante..."
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2"
            rows={3}
            required
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (observaciones.trim()) {
                  onAction(themeId, "rechazar", observaciones)
                  setShowRejectForm(false)
                  setObservaciones("")
                }
              }}
              disabled={!observaciones.trim()}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
            >
              Confirmar Rechazo
            </button>
            <button
              onClick={() => {
                setShowRejectForm(false)
                setObservaciones("")
              }}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Tarjeta expandible para mostrar la información completa de un estudiante
function StudentCard({ student, onSelect }: { student: any; onSelect: (s: any) => void }) {
  const { getThemeByStudent, tutorias, getFilesByStudent } = useSystem()
  const studentTutorias = tutorias.filter((t) => t.estudianteEmail === student.email)
  const theme = getThemeByStudent(student.email)
  const files = getFilesByStudent(student.email)

  return (
    <button
      type="button"
      onClick={() => onSelect(student)}
      className="bg-white w-full text-left rounded-lg shadow hover:shadow-md transition-shadow p-4"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center font-semibold text-red-700">
          {student.nombres.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-gray-900">
            {student.nombres} {student.apellidos}
          </p>
          <p className="text-sm text-gray-600">{student.carrera}</p>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <span className="px-2 py-1 bg-gray-100 rounded">Tutorías: {studentTutorias.length}</span>
        <span className="px-2 py-1 bg-gray-100 rounded">Archivos: {files.length}</span>
        <span className="px-2 py-1 bg-gray-100 rounded">Tema: {theme ? (theme.aprobado ? 'Aprobado' : 'Pendiente') : 'Sin tema'}</span>
      </div>
    </button>
  )
}

// Fila de tutoría para la vista de estudiantes
function TutoriaRow({
  tutoria,
  onAction,
}: {
  tutoria: any
  onAction: (id: string, action: "aceptar" | "rechazar", observaciones?: string) => void
}) {
  const [showReject, setShowReject] = useState(false)
  const [observaciones, setObservaciones] = useState("")

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{tutoria.asunto}</TableCell>
        <TableCell>{tutoria.fecha}</TableCell>
        <TableCell>{tutoria.hora}</TableCell>
        <TableCell>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              tutoria.estado === "completada"
                ? "bg-blue-100 text-blue-800"
                : tutoria.estado === "aceptada"
                  ? "bg-green-100 text-green-800"
                  : tutoria.estado === "rechazada"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {tutoria.estado}
          </span>
        </TableCell>
        <TableCell>
          {tutoria.estado === "pendiente" && (
            <div className="flex gap-2">
              <button
                onClick={() => onAction(tutoria.id, "aceptar")}
                className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
              >
                <Check size={12} />
              </button>
              <button
                onClick={() => setShowReject(true)}
                className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </TableCell>
      </TableRow>
      {showReject && (
        <TableRow>
          <TableCell colSpan={5}>
            <div className="p-3 bg-gray-50 rounded">
              <textarea
                placeholder="Motivo del rechazo (opcional)"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onAction(tutoria.id, "rechazar", observaciones)
                    setShowReject(false)
                    setObservaciones("")
                  }}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Confirmar Rechazo
                </button>
                <button
                  onClick={() => setShowReject(false)}
                  className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
