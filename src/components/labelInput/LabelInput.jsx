import React from 'react'
import './labelInput.css'

export default function LabelInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
}) {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>

      <input
        className="input-field"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
      />
    </div>
  )
}