import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Register from '../pages/register/Register'
import Login from '../pages/login/Login'
import Home from '../pages/home/Home'
import Profile from '../pages/profile/Profile'
import Message from '../pages/message/Message'
import Setting from '../pages/setting/Setting'


import EditProfile from '../components/editProfile/EditProfile'

import Ai from '../pages/ai/Ai'

import NewsAlerts from '../pages/newsAlerts/NewsAlerts'

import Weather from '../pages/weather/Weather'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN PAGE */}
        <Route path="/login" element={<Login />} />

        {/* REGISTER PAGE */}
        <Route path="/register" element={<Register />} />

        {/* HOME PAGE */}
        <Route path="/home" element={<Home />} />

        {/* DEFAULT */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" />} />

        {/* PROFILE PAGE */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />

        {/* MESSAGE PAGE */}
        <Route path="/message" element={<Message />} />

        

        <Route path="/profile/:userId" element={<Profile />} />

        <Route path="/message/:userId" element={<Message />} />

        <Route path="/ai" element={<Ai />} />
    
        <Route path="/news-alerts" element={<NewsAlerts />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/setting" element={<Setting />} />
        

      </Routes>
    </BrowserRouter>
  )
}

export default App