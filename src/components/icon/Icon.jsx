import React from 'react'
import './icon.css'

export default function Icon({src, alt, className,id}) {
  return (
    <div className={className} id={id}>
      <img src={src} alt={alt} />
    </div>
  )
}
