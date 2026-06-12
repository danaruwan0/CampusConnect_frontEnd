import React, { useState } from 'react'
import './login.css'
import { loginUser } from '../../api/authApi'
import { useNavigate } from 'react-router-dom'

import Button from '../../components/button/Button'
import LabelInput from '../../components/labelInput/LabelInput'
import Logo from '../../components/logo/Logo'

import RegisterImage from '../../assets/register.png'
import LoginImage from '../../assets/login.png'
import Register from '../register/Register'
import Home from '../home/Home'



export default function Login() {

    const navigate = useNavigate()

    // const [showLogin, setShowLogin] = useState(false)

    const [formData, setFormData] = useState({
        universityEmail: '',
        password: ''
    })

    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        })

        setErrors({
            ...errors,
            [name]: ''
        })
    }

    const validate = () => {
        let newErrors = {}

        if (!formData.universityEmail.trim()) {
            newErrors.universityEmail = 'University Email is required'
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required'
        }

        return newErrors
    }

    const handleSubmit = async () => {
        const validationErrors = validate()

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        try {
            const res = await loginUser(
                formData.universityEmail,
                formData.password
            )

            console.log("Login Success:", res.data)

            alert("Login Successful")

            // redirect to dashboard (change if needed)
            navigate("/home")

        } catch (error) {
            console.log("Login Error:", error.response?.data || error.message)
            alert("Invalid email or password")
        }
    }

    // 👉 LOGIN SCREEN
    // if (showLogin) {
    //     return <Login />
    // }

    return (
        <div className="register-container">

            <div className="register-image-container">
                <img
                    src={LoginImage}
                    alt="Login"
                    className="register-image"
                />

                <div className='templogo'>
                    <Logo />
                </div>

                <div className="register-image-text">
                    <div className='register-image-text-content'>
                        <h1>Empowering Student Success</h1>
                        <p>
                            Join thousands of students and faculty members in
                            a secure, centralized academic hub designed for the
                            modern university experience.
                        </p>
                    </div>
                </div>
            </div>

            <div className="register-form-container">

                <div className="register-form">

                    <Logo />

                    <h2>Welcome Back</h2>
                    <p>Sign in to access your dashboard and courses.</p>


                    <LabelInput
                        label="University Email"
                        type="email"
                        name="universityEmail"
                        value={formData.universityEmail}
                        onChange={handleChange}
                        placeholder="Enter your university email"
                    />
                    {errors.universityEmail && <span className="error-text">{errors.universityEmail}</span>}


                    <div>
                        <LabelInput
                            label="Password"
                            type="password"
                            placeholder="Enter Your Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>








                    {/* {errors.terms && (
                        <span className="error-text">{errors.terms}</span>
                    )} */}

                    <Button
                        text="Sign In"
                        className="register-button"
                        onClick={handleSubmit}
                    />


                    <p className="login-link">
                        dont have an account?{" "}
                        <span
                            onClick={() => navigate('/register')}
                            style={{ color: '#0058BE', cursor: 'pointer' }}
                        >
                            Register Now
                        </span>
                    </p>

                </div>
            </div>
        </div>
    )
}
