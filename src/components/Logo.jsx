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
      className={`inline-block object-contain transition-opacity duration-200 hover:opacity-80 ${className}`}
      style={{ width: normalizedWidth, height: 'auto' }}
    />
  )
}

export default Logo