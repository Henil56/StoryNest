import React from 'react'

export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-white p-5 shadow-sm">
      <div className="h-48 rounded-xl bg-gray-200"></div>
      <div className="mt-4 h-5 w-2/3 rounded bg-gray-200"></div>
      <div className="mt-2 h-4 w-1/2 rounded bg-gray-200"></div>
    </div>
  )
}
