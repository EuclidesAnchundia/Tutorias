"use client"

import { X } from "lucide-react"
import { useNotifications } from "../../hooks/useNotifications"

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const { notifications, unreadCount, markNotificationAsRead, markAllNotificationsAsRead } = useNotifications()

  if (!isOpen) return null


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => {
        markAllNotificationsAsRead()
        onClose()
      }}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Notificaciones {unreadCount > 0 && `(${unreadCount})`}
            </h2>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>
          <button
            onClick={() => {
              markAllNotificationsAsRead()
              onClose()
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-96">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No tienes notificaciones</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications
                .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                .map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      !notification.leida ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                    }`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notification.leida ? "font-semibold" : ""} text-gray-900`}>
                          {notification.mensaje}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(notification.fecha).toLocaleString()}</p>
                      </div>
                      {!notification.leida && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
