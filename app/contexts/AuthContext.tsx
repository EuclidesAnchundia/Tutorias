"use client"

/**
 * Maneja la autenticación de usuarios en el navegador. Utiliza
 * localStorage para persistir la sesión actual y expone funciones
 * para iniciar o cerrar sesión y actualizar el perfil.
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSystem } from "./SystemContext"

interface User {
  id: string
  nombres: string
  apellidos: string
  email: string
  rol: "estudiante" | "tutor" | "coordinador" | "administrador"
  facultad?: string
  carrera?: string
  especialidad?: string
  fechaRegistro: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<User>) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Proveedor que envuelve a la aplicación y gestiona la sesión
 * del usuario utilizando el contexto del sistema.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { validateCredentials, getUserByEmail, updateUser } = useSystem()

  useEffect(() => {
    const savedSession = localStorage.getItem("sesionActual")
    if (savedSession) {
      try {
        const userData = JSON.parse(savedSession)
        setUser(userData)
      } catch (error) {
        localStorage.removeItem("sesionActual")
      }
    }
    setLoading(false)
  }, [])

  /**
   * Inicia sesión validando las credenciales ingresadas.
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    if (!validateCredentials(email, password)) {
      return false
    }

    const userData = getUserByEmail(email)
    if (userData) {
      setUser(userData)
      localStorage.setItem("sesionActual", JSON.stringify(userData))
      return true
    }
    return false
  }

  /** Cierra la sesión actual y limpia el almacenamiento local. */
  const logout = () => {
    setUser(null)
    localStorage.removeItem("sesionActual")
  }

  /**
   * Actualiza los datos del usuario actualmente autenticado.
   */
  const updateProfile = (data: Partial<User>): boolean => {
    if (!user) return false

    const success = updateUser(user.email, data)
    if (success) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("sesionActual", JSON.stringify(updatedUser))
    }
    return success
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, updateProfile }}>{children}</AuthContext.Provider>
}

/** Hook para acceder al contexto de autenticación. */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
