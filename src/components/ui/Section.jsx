import React from 'react'

export default function Section({ children, className = '' }) {
  return (
    <section className={`py-12 animate-fade-in ${className}`}>
      {children}
    </section>
  )
}
