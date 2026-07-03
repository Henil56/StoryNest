import React from 'react'

export default function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
      <div className="text-6xl mb-5">📚</div>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-4 text-gray-500">{description}</p>
    </div>
  )
}
