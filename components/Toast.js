'use client'

export default function Toast({ message, type = 'info', onClose }) {
  const bgColor = {
    info: 'bg-blue-500',
    success: 'bg-green-600',
    error: 'bg-red-500',
  }[type]

  return (
    <div
      role="alert"
      className={`
        fixed top-20 left-1/2 -translate-x-1/2 z-50
        ${bgColor} text-white px-6 py-4 rounded shadow-lg min-w-[250px]
        animate-fadeIn
      `}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm">{message}</span>
        <button
          onClick={onClose}
          className="text-white font-bold text-lg leading-none hover:text-gray-200 transition"
          aria-label="Fermer la notification"
        >
          ×
        </button>
      </div>
    </div>
  )
}
