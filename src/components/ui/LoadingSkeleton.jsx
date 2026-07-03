import React from 'react'

export default function LoadingSkeleton() {
  return (
    <div className="rounded-2xl bg-surface-elevated p-5 shadow-sm">
      <div className="h-48 rounded-xl shimmer"></div>
      <div className="mt-4 space-y-3">
        <div className="h-3 w-20 rounded-full shimmer"></div>
        <div className="h-5 w-3/4 rounded shimmer"></div>
        <div className="h-4 w-full rounded shimmer"></div>
        <div className="h-4 w-2/3 rounded shimmer"></div>
      </div>
    </div>
  )
}
