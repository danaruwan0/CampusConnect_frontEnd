import React from 'react';
import SchoolIcon from '@mui/icons-material/School';
import './logo.css'

export default function Logo() {
  return (
    <div className="logo">
      <SchoolIcon className="logo-icon" />
      <span className="logo-text">CampusConnect</span>
    </div>
  );
}