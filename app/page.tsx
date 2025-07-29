"use client"

/**
 * Página principal. Si el usuario ya tiene sesión activa se redirige
 * automáticamente al dashboard, de lo contrario se muestra la portada.
 */

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./contexts/AuthContext"
import HomePage from "./components/HomePage"
import LoadingSpinner from "./components/LoadingSpinner"

export default function Page() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return <LoadingSpinner />
  }

  if (user) {
    return <LoadingSpinner />
  }

  return <HomePage />
}
