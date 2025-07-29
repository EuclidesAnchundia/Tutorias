import type React from "react"

/**
 * Layout raíz de la aplicación. Aquí se configuran los proveedores
 * de contexto global (sistema, autenticación y toasts).
 */
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SystemProvider } from "./contexts/SystemContext"
import { AuthProvider } from "./contexts/AuthContext"
import { ToastProvider } from "./components/ui/toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema de Tutorías ULEAM",
  description: "Sistema Web para el Control de Tutorías de Titulación en la ULEAM",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ToastProvider>
          <SystemProvider>
            <AuthProvider>{children}</AuthProvider>
          </SystemProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
