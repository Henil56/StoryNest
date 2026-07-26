import React from 'react'

export default function LoadingSkeleton() {
  return (
    <div className="rounded-2xl bg-surface-elevated border border-border/30 overflow-hidden shadow-sm">
      {/* Image placeholder */}
      <div className="aspect-[16/10] shimmer"></div>
      
      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Badge */}
        <div className="h-5 w-20 rounded-full shimmer"></div>
        
        {/* Title */}
        <div className="h-5 w-4/5 rounded-lg shimmer"></div>
        
        {/* Excerpt lines */}
        <div className="space-y-2">
          <div className="h-3.5 w-full rounded shimmer"></div>
          <div className="h-3.5 w-3/4 rounded shimmer"></div>
        </div>
        
        {/* Author row */}
        <div className="flex items-center gap-2 pt-2">
          <div className="w-6 h-6 rounded-full shimmer"></div>
          <div className="h-3 w-24 rounded shimmer"></div>
        </div>
        
        {/* Footer */}
        <div className="pt-3 border-t border-border/20 flex justify-between items-center">
          <div className="flex gap-3">
            <div className="h-3.5 w-10 rounded shimmer"></div>
            <div className="h-3.5 w-10 rounded shimmer"></div>
          </div>
          <div className="h-3.5 w-20 rounded shimmer"></div>
        </div>
      </div>
    </div>
  )
}
