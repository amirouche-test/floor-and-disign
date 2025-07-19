'use client'

export default function Palette({ motif, selectedColor, onSelectColor, palette }) {
  return (
    <div className="flex flex-wrap gap-2 p-2 border rounded w-64 h-16 overflow-y-auto justify-end">
      {motif.calques.map((calque, idx) => {
        const hex = palette.find(p => p.nom === calque.couleur)?.hex || calque.couleur
        return (
          <button
            key={idx}
            onClick={() => onSelectColor(calque.couleur)}
            className={`w-8 h-8 rounded-full border transition 
              ${selectedColor === calque.couleur
                ? 'ring-2 ring-blue-600 border-blue-400'
                : 'border-gray-300'}`}
            style={{ backgroundColor: hex }}
            title={calque.couleur}
          />
        )
      })}
    </div>
  )
}
