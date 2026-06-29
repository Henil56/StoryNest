import React from 'react'
import logoSrc from '../assets/LOGO.png'

function Logo({ width, size = 'medium', className = '', alt = 'StoryNest logo' }) {
  // size can be 'small' | 'medium' | 'large' or a width string/number override
  const sizeMap = {
    small: '150px',
    medium: '250px',
    large: '300px',
  }

  const resolvedWidth = width ?? sizeMap[size] ?? sizeMap.medium
  const normalizedWidth = typeof resolvedWidth === 'number' ? `${resolvedWidth}px` : resolvedWidth

  return (
    <img
      src={logoSrc}
      alt={alt}
      className={`inline-block object-contain ${className}`}
      style={{ width: normalizedWidth, height: 'auto' }}
    />
  )
}

export default Logo