import React from 'react'

export default function EmptyState({ title, description, icon = '📚', action }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface-elevated py-20 text-center animate-fade-in">
      <div className="text-6xl mb-5" role="img" aria-hidden="true">{icon}</div>
      <h2 className="text-2xl font-semibold text-text-primary">{title}</h2>
      {description && <p className="mt-3 text-text-muted max-w-md mx-auto">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
