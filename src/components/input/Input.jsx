import React from 'react'
import './input.css'

export default function Input({className,id, type, placeholder, value, onChange}) {
  return (
    <div className={className} id={id}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
