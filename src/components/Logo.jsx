import React, { useEffect, useState } from 'react'
import logoLightSrc from '../assets/LOGO.png'
import logoDarkSrc from '../assets/LOGO_DARK.png'

function Logo({ width, size = 'medium', className = '', alt = 'StoryNest logo', variant = 'auto' }) {
  const sizeMap = {
    xs: '150px',
    small: '280px',
    medium: '300px',
    large: '380px',
  }

  const resolvedWidth = width ?? sizeMap[size] ?? sizeMap.medium
  const normalizedWidth = typeof resolvedWidth === 'number' ? `${resolvedWidth}px` : resolvedWidth

  // For 'auto' variant, detect theme from the .dark class on <html>
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    if (variant !== 'auto') return

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [variant])

  let src = logoLightSrc
  if (variant === 'dark') {
    src = logoDarkSrc
  } else if (variant === 'auto') {
    src = isDark ? logoDarkSrc : logoLightSrc
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`inline-block object-contain transition-all duration-500 ease-out hover:scale-[1.02] hover:-translate-y-0.5 hover:drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)] dark:hover:drop-shadow-[0_0_20px_rgba(251,191,36,0.25)] active:scale-95 active:translate-y-0 cursor-pointer ${className}`}
      style={{ width: normalizedWidth, height: 'auto' }}
    />
  )
}

export default Logo