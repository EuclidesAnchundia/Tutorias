"use client"

import { useState } from "react"
import {
  X,
  User,
  BookOpen,
  Calendar,
  FileText,
  Send,
  Check,
  X as XIcon,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { useSystem } from "@/app/contexts/SystemContext"
import { useToast } from "../ui/toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface StudentDetailsPanelProps {
  student: any | null
  onClose: () => void
}

export default function StudentDetailsPanel({ student, onClose }: StudentDetailsPanelProps) {
  const { addToast } = useToast()
  const {
    getThemeByStudent,
    tutorias,
    archivos,
    updateTutoria,
    updateTema,
    createNotification,
  } = useSystem()

  if (!student) return null

  const theme = getThemeByStudent(student.email)
  const studentTutorias = tutorias.filter((t) => t.estudianteEmail === student.email)
  const studentArchivos = archivos.filter((a) => a.estudianteEmail === student.email)

  const [activeTab, setActiveTab] = useState<string>("resumen")

  const sendMessageTo = (mensaje: string) => {
    if (!mensaje.trim()) {
      addToast({
        type: "error",
        title: "Campos requeridos",
        description: "Escribe un mensaje para el estudiante.",
      })
      return false
    }
    createNotification(student.email, "MENSAJE_TUTOR", `Mensaje de tu tutor: ${mensaje}`)
    addToast({
      type: "success",
      title: "Mensaje enviado",
      description: "El mensaje ha sido enviado al estudiante.",
    })
    return true
  }

  const handleTutoriaAction = (
    tutoriaId: string,
    action: "aceptar" | "rechazar",
    observaciones?: string,
  ) => {
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

  const handleCompleteTutoria = (
    tutoriaId: string,
    calificacion: string,
    observaciones: string,
  ) => {
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

  const handleThemeAction = (
    themeId: string,
    action: "aprobar" | "rechazar",
    observaciones?: string,
  ) => {
    const success = updateTema(themeId, {
      aprobado: action === "aprobar",
      observaciones: observaciones || "",
      fechaRevision: new Date().toISOString(),
    })
    if (success) {
      if (action === "aprobar") {
        createNotification(student.email, "TEMA_APROBADO", `Tu tema \"${theme?.titulo}\" ha sido aprobado`)
      } else {
        createNotification(
          student.email,
          "TEMA_RECHAZADO",
          `Tu tema \"${theme?.titulo}\" ha sido rechazado${observaciones ? `. Observaciones: ${observaciones}` : ""}`,
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

  const tabs = [
    { id: "resumen", label: "Resumen", icon: <User size={16} /> },
    { id: "tema", label: "Tema", icon: <BookOpen size={16} /> },
    { id: "tutorias", label: "Tutorías", icon: <Calendar size={16} /> },
    { id: "archivos", label: "Archivos", icon: <FileText size={16} /> },
    { id: "indicaciones", label: "Indicaciones", icon: <Send size={16} /> },
  ]

  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-auto mb-6">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Detalle del Estudiante</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      <div className="p-4">
        <div className="flex gap-4 border-b mb-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === t.id ? "border-red-600 text-red-600" : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
        {activeTab === "resumen" && (
          <div className="space-y-1 text-sm">
            <p>
              <strong>Nombre:</strong> {student.nombres} {student.apellidos}
            </p>
            <p>
              <strong>Email:</strong> {student.email}
            </p>
            <p>
              <strong>Carrera:</strong> {student.carrera}
            </p>
          </div>
        )}
        {activeTab === "tema" && (
          <div className="space-y-2 text-sm">
            {theme ? (
              <>
                <p>
                  <strong>Título:</strong> {theme.titulo}
                </p>
                <p>
                  <strong>Descripción:</strong> {theme.descripcion}
                </p>
                <p>
                  <strong>Estado:</strong>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      theme.aprobado
                        ? "bg-green-100 text-green-800"
                        : theme.fechaRevision
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {theme.aprobado ? "Aprobado" : theme.fechaRevision ? "Rechazado" : "Pendiente"}
                  </span>
                </p>
                {!theme.aprobado && (
                  <div className="mt-2">
                    <ThemeActionButtons themeId={theme.id} onAction={handleThemeAction} />
                  </div>
                )}
                {theme.observaciones && (
                  <div className="mt-2 p-2 bg-blue-50 rounded">
                    <p className="text-sm text-blue-800">
                      <strong>Observaciones:</strong> {theme.observaciones}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500">Sin tema propuesto</p>
            )}
          </div>
        )}
        {activeTab === "tutorias" && (
          <div className="space-y-2 text-sm">
            {studentTutorias.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asunto</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentTutorias.map((tutoria) => (
                    <TutoriaRow
                      key={tutoria.id}
                      tutoria={tutoria}
                      onAction={handleTutoriaAction}
                      onComplete={handleCompleteTutoria}
                    />
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500">No hay tutorías registradas</p>
            )}
          </div>
        )}
        {activeTab === "archivos" && (
          <div className="space-y-2 text-sm">
            {studentArchivos.length > 0 ? (
              studentArchivos.map((archivo) => (
                <div key={archivo.id} className="p-2 bg-white rounded border flex justify-between items-center">
                  <span>{archivo.nombre}</span>
                  <button
                    onClick={() => handleDownloadFile(archivo)}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    Descargar
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No hay archivos subidos</p>
            )}
          </div>
        )}
        {activeTab === "indicaciones" && <IndicacionesForm onSend={sendMessageTo} />}
      </div>
    </div>
  )
}

function IndicacionesForm({ onSend }: { onSend: (mensaje: string) => boolean }) {
  const [mensaje, setMensaje] = useState("")
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (onSend(mensaje)) setMensaje("")
      }}
      className="space-y-3"
    >
      <div>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          rows={3}
          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Escribe tus indicaciones aquí..."
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
      >
        <Send size={16} /> Enviar Mensaje
      </button>
    </form>
  )
}

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
            <CheckCircle size={14} /> Aprobar Tema
          </button>
          <button
            onClick={() => setShowRejectForm(true)}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center gap-1"
          >
            <XCircle size={14} /> Rechazar Tema
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

function TutoriaRow({
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
    <TableRow>
      <TableCell className="font-medium">{tutoria.asunto}</TableCell>
      <TableCell>{tutoria.fecha}</TableCell>
      <TableCell>{tutoria.hora}</TableCell>
      <TableCell>
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
      </TableCell>
      <TableCell>
        {tutoria.estado === "pendiente" && (
          <div className="flex gap-2">
            <button
              onClick={() => onAction(tutoria.id, "aceptar")}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
            >
              <Check size={14} /> Aceptar
            </button>
            <button
              onClick={() => setShowActions(true)}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center gap-1"
            >
              <XIcon size={14} /> Rechazar
            </button>
          </div>
        )}
        {tutoria.estado === "aceptada" && (
          <button
            onClick={() => setShowComplete(true)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
          >
            <CheckCircle size={14} /> Marcar como completada
          </button>
        )}
        {showActions && (
          <div className="mt-2 p-3 bg-gray-50 rounded">
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
          <div className="mt-2 p-3 bg-gray-50 rounded space-y-2">
            <input
              type="text"
              placeholder="Calificación"
              value={calificacion}
              onChange={(e) => setCalificacion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
            <textarea
              placeholder="Observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onComplete(tutoria.id, calificacion, observaciones)
                  setShowComplete(false)
                  setCalificacion("")
                  setObservaciones("")
                }}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Guardar
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
      </TableCell>
    </TableRow>
  )
}
