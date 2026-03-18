import React from 'react'

interface LogoProps {
  className?: string
}

export default function Logo({ className = '' }: LogoProps) {
  // Logo is 250x31, so aspect ratio is ~8:1
  // Set width to match main site logo size (200px) and let height scale proportionally
  const logoWidth = 200;
  const logoHeight = (31 / 250) * logoWidth; // Maintain aspect ratio
  
  return (
    <img
      src="/docs_logo.png"
      alt="OpenRedaction"
      className={`object-contain flex-shrink-0 ${className}`}
      style={{ 
        width: logoWidth, 
        height: logoHeight,
        display: 'block'
      }}
    />
  )
}

