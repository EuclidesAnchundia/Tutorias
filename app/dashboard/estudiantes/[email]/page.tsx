"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/AuthContext"
import { useSystem } from "@/app/contexts/SystemContext"
import { useToast } from "@/app/components/ui/toast"
import DashboardLayout from "@/app/components/Layout/DashboardLayout"
import {
  Calendar,
  Users,
  User,
  Check,
  X,
  CheckCircle,
  XCircle,
  FileText,
  BookOpen,
  Send,
  ChevronLeft
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function StudentDetailsPage({ params }: { params: { email: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const { addToast } = useToast()
  const {
    getUserByEmail,
    getThemeByStudent,
    tutorias,
    archivos,
    updateTutoria,
    updateTema,
    createNotification,
  } = useSystem()

  if (!user || user.rol !== "tutor") {
    router.push("/dashboard")
    return null
  }

  const student = getUserByEmail(decodeURIComponent(params.email))
  if (!student) {
    return <DashboardLayout sidebar={<div />} title="Estudiante no encontrado">Estudiante no encontrado</DashboardLayout>
  }

  const theme = getThemeByStudent(student.email)
  const studentTutorias = tutorias.filter((t) => t.estudianteEmail === student.email)
  const studentArchivos = archivos.filter((a) => a.estudianteEmail === student.email)

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

  const handleThemeAction = (themeId: string, action: "aprobar" | "rechazar", observaciones?: string) => {
    const success = updateTema(themeId, {
      aprobado: action === "aprobar",
      observaciones: observaciones || "",
      fechaRevision: new Date().toISOString(),
    })
    if (success) {
      if (action === "aprobar") {
        createNotification(student.email, "TEMA_APROBADO", `Tu tema "${theme?.titulo}" ha sido aprobado`)
      } else {
        createNotification(student.email, "TEMA_RECHAZADO", `Tu tema "${theme?.titulo}" ha sido rechazado${observaciones ? `. Observaciones: ${observaciones}` : ""}`)
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

  const sidebar = (
    <ul className="space-y-2">
      <li>
        <button onClick={() => router.push('/dashboard')} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors text-gray-700 hover:bg-gray-100">
          <Calendar size={20} />
          Mis Tutorías
        </button>
      </li>
      <li>
        <button onClick={() => router.push('/dashboard')} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors bg-red-100 text-red-700">
          <Users size={20} />
          Mis Estudiantes
        </button>
      </li>
      <li>
        <button onClick={() => router.push('/dashboard')} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors text-gray-700 hover:bg-gray-100">
          <User size={20} />
          Mi Perfil
        </button>
      </li>
    </ul>
  )

  return (
    <DashboardLayout sidebar={sidebar} title="Detalle del Estudiante">
      <div className="mb-4">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
          <ChevronLeft size={16} /> Volver
        </button>
      </div>
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="flex items-center gap-2 font-medium text-gray-900 mb-2">
            <User size={16} /> Resumen
          </h4>
          <p>
            <strong>Carrera:</strong> {student.carrera}
          </p>
        </div>

        {theme && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="flex items-center gap-2 font-medium text-gray-900 mb-2">
              <BookOpen size={16} /> Tema Propuesto
            </h4>
            <div className="space-y-1">
              <p>
                <strong>Título:</strong> {theme.titulo}
              </p>
              <p>
                <strong>Descripción:</strong> {theme.descripcion}
              </p>
              <p>
                <strong>Estado:</strong>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  theme.aprobado ? 'bg-green-100 text-green-800' : theme.fechaRevision ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {theme.aprobado ? 'Aprobado' : theme.fechaRevision ? 'Rechazado' : 'Pendiente'}
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
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="flex items-center gap-2 font-medium text-gray-900 mb-2">
            <Calendar size={16} /> Tutorías ({studentTutorias.length})
          </h4>
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
                  <TutoriaRow key={tutoria.id} tutoria={tutoria} onAction={handleTutoriaAction} />
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500 text-sm">No hay tutorías registradas</p>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="flex items-center gap-2 font-medium text-gray-900 mb-2">
            <FileText size={16} /> Archivos ({studentArchivos.length})
          </h4>
          {studentArchivos.length > 0 ? (
            <div className="space-y-2">
              {studentArchivos.map((archivo) => (
                <div key={archivo.id} className="p-2 bg-white rounded border text-sm flex justify-between items-center">
                  <span>{archivo.nombre}</span>
                  <button onClick={() => handleDownloadFile(archivo)} className="text-blue-600 hover:text-blue-800 text-xs">
                    Descargar
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No hay archivos subidos</p>
          )}
        </div>

        <IndicacionesForm studentEmail={student.email} onSend={sendMessageTo} />
      </div>
    </DashboardLayout>
  )
}

function IndicacionesForm({ studentEmail, onSend }: { studentEmail: string; onSend: (email: string, mensaje: string) => boolean }) {
  const [mensaje, setMensaje] = useState("")
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (onSend(studentEmail, mensaje)) setMensaje("") }} className="space-y-3 pt-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Indicaciones para el estudiante</label>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Escribe tus indicaciones aquí..."
          required
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
        <Send size={16} /> Enviar Mensaje
      </button>
    </form>
  )
}

function ThemeActionButtons({ themeId, onAction }: { themeId: string; onAction: (id: string, action: "aprobar" | "rechazar", observaciones?: string) => void }) {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [observaciones, setObservaciones] = useState("")
  return (
    <div className="space-y-3">
      {!showRejectForm ? (
        <div className="flex gap-2">
          <button onClick={() => onAction(themeId, "aprobar")} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1">
            <CheckCircle size={14} /> Aprobar Tema
          </button>
          <button onClick={() => setShowRejectForm(true)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center gap-1">
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
            <button onClick={() => { setShowRejectForm(false); setObservaciones("") }} className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function TutoriaRow({ tutoria, onAction }: { tutoria: any; onAction: (id: string, action: "aceptar" | "rechazar", observaciones?: string) => void }) {
  const [showReject, setShowReject] = useState(false)
  const [observaciones, setObservaciones] = useState("")
  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{tutoria.asunto}</TableCell>
        <TableCell>{tutoria.fecha}</TableCell>
        <TableCell>{tutoria.hora}</TableCell>
        <TableCell>
          <span className={`px-2 py-1 rounded-full text-xs ${
            tutoria.estado === 'completada'
              ? 'bg-blue-100 text-blue-800'
              : tutoria.estado === 'aceptada'
                ? 'bg-green-100 text-green-800'
                : tutoria.estado === 'rechazada'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
          }`}>{tutoria.estado}</span>
        </TableCell>
        <TableCell>
          {tutoria.estado === 'pendiente' && (
            <div className="flex gap-2">
              <button onClick={() => onAction(tutoria.id, 'aceptar')} className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700">
                <Check size={12} />
              </button>
              <button onClick={() => setShowReject(true)} className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700">
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
                <button onClick={() => { onAction(tutoria.id, 'rechazar', observaciones); setShowReject(false); setObservaciones('') }} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                  Confirmar Rechazo
                </button>
                <button onClick={() => setShowReject(false)} className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400">
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
