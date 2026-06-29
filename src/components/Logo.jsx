import React from 'react'
import logoSrc from '../assets/LOGO.png'

function Logo({width = '100px', className = '', alt = 'StoryNest logo'}) {
  const normalizedWidth = typeof width === 'number' ? `${width}px` : width

  return (
    <img
      src={logoSrc}
      alt={alt}
      className={className}
      style={{ width: normalizedWidth, height: 'auto' }}
    />
  )
}

export default Logo