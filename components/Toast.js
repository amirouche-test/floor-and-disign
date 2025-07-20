'use client'

import { CheckCircle, Info, XCircle, X } from 'lucide-react'

export default function Toast({ message, type = 'info', onClose }) {
  const config = {
    info: { color: 'bg-blue-600', Icon: Info },
    success: { color: 'bg-green-600', Icon: CheckCircle },
    error: { color: 'bg-red-600', Icon: XCircle },
  }[type] || { color: 'bg-gray-700', Icon: Info }

  const { color, Icon } = config

  return (
    <div
      role="alert"
      className={`
        fixed top-20 left-1/2 -translate-x-1/2 z-50
        ${color} text-white px-4 py-3 rounded-xl shadow-xl min-w-[260px] max-w-xs
        flex items-center gap-3 animate-fadeIn
      `}
    >
      <Icon className="w-5 h-5 flex-shrink-0 text-white opacity-90" />

      <span className="flex-1 text-sm font-medium">{message}</span>

      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 transition"
        aria-label="Fermer la notification"
      >
        <X size={18} />
      </button>
    </div>
  )
}
