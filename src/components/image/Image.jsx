import React from 'react'
import './image.css'

export default function Image({src, alt, className,id}) {
  return (
    <div className={className} id={id}>
      <img src={src} alt={alt} />
    </div>
  )
}
