'use client';

import { useState } from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 32, className = '' }: LogoProps) {
  const [hasError, setHasError] = useState(false);

  // Show fallback if image fails to load
  if (hasError) {
    return (
      <div 
        className={`bg-white rounded-full flex items-center justify-center flex-shrink-0 ${className}`}
        style={{ 
          width: size, 
          height: size,
          minWidth: size,
          minHeight: size,
          maxWidth: size,
          maxHeight: size
        }}
      >
        <span className="text-black font-bold" style={{ fontSize: size * 0.4 }}>
          OR
        </span>
      </div>
    );
  }

  return (
    <img
      src="/logo.png"
      alt="OpenRedaction"
      className={`object-contain flex-shrink-0 ${className}`}
      style={{ 
        width: size, 
        height: size, 
        display: 'block',
        minWidth: size,
        minHeight: size,
        maxWidth: size,
        maxHeight: size
      }}
      onError={() => setHasError(true)}
    />
  );
}

