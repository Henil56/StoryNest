import React from 'react'

export default function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-10">
      <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
      {subtitle && (
        <p className="mt-3 text-gray-600 max-w-2xl">{subtitle}</p>
      )}
    </div>
  )
}
