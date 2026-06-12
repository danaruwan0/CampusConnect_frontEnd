import React, { useState } from 'react'
import './register.css'
import { useNavigate } from 'react-router-dom'

import Button from '../../components/button/Button'
import LabelInput from '../../components/labelInput/LabelInput'
import Logo from '../../components/logo/Logo'
import OtpModal from '../../components/otpModal/OtpModal'

import RegisterImage from '../../assets/register.png'
import Login from '../login/Login'
import Home from '../home/Home'

import { registerUser, verifyOtp, resendOtp } from '../../api/authApi'
import Swal from 'sweetalert2'

export default function Register() {
    const navigate = useNavigate()

    const [showOtpModal, setShowOtpModal] = useState(false)
    const [showLogin, setShowLogin] = useState(false)

    const [formData, setFormData] = useState({
        fullName: '',
        universityEmail: '',
        major: '',
        password: '',
        terms: false
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

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full Name is required'
        }

        if (!formData.universityEmail.trim()) {
            newErrors.universityEmail = 'University Email is required'
        }

        if (!formData.major.trim()) {
            newErrors.major = 'Major is required'
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required'
        }

        if (!formData.terms) {
            newErrors.terms = 'Please accept Terms of Service'
        }

        return newErrors
    }






    const handleSubmit = async () => {
        const validationErrors = validate()

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        // SHOW LOADING (NO TIMER)
        Swal.fire({
            title: "Generating OTP...",
            text: "Please wait while we send OTP",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            }
        })

        try {
            const res = await registerUser(formData)

            Swal.close()   // CLOSE ONLY WHEN RESPONSE COMES

            console.log("OTP sent:", res.data)

            setShowOtpModal(true)

        } catch (error) {

            Swal.close()

            Swal.fire({
                icon: "error",
                title: "Failed",
                text: error.response?.data || "OTP generation failed"
            })
        }
    }






    const handleVerifyOtp = async (otp) => {
        try {
            const res = await verifyOtp(
                formData.universityEmail,
                otp
            )

            if (res.data === "Registration successful") {

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Account created successfully"
                })

                setShowOtpModal(false)
                navigate("/home")

            } else {

                Swal.fire({
                    icon: "error",
                    title: "Verification Failed",
                    text: res.data
                })
            }

        } catch (error) {

            Swal.fire({
                icon: "error",
                title: "Server Error",
                text: "Please try again"
            })
        }
    }


    const handleResendOtp = async () => {
        try {

            await resendOtp(formData.universityEmail)

            Swal.fire({
                icon: "success",
                title: "OTP Sent",
                text: "New OTP sent to your email"
            })

        } catch (error) {

            Swal.fire({
                icon: "error",
                title: "Failed",
                text: "Unable to resend OTP"
            })
        }
    }


    if (showLogin) {
        return <Login />
    }

    return (
        <>
            <div className="register-container">
                <div className="register-image-container">
                    <img
                        src={RegisterImage}
                        alt="Register"
                        className="register-image"
                    />

                    <div className="templogo">
                        <Logo />
                    </div>

                    <div className="register-image-text">
                        <div className="register-image-text-content">
                            <h1>Knowledge Flows.</h1>
                            <p>
                                Experience the next generation of academic
                                networking and resource sharing at CampusConnect.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="register-form-container">
                    <div className="register-form">
                        <Logo />

                        <h2>Join the Community</h2>
                        <p>Start your journey with fellow scholars today.</p>

                        <LabelInput
                            label="Full Name"
                            placeholder="Fathima Askar"
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                        {errors.fullName && (
                            <span className="error-text">{errors.fullName}</span>
                        )}

                        <LabelInput
                            label="University Email"
                            placeholder="032502090@icst.edu.lk"
                            type="email"
                            name="universityEmail"
                            value={formData.universityEmail}
                            onChange={handleChange}
                        />
                        {errors.universityEmail && (
                            <span className="error-text">{errors.universityEmail}</span>
                        )}

                        <div className="left-right-tow-label-input">
                            <div>
                                <LabelInput
                                    label="Major"
                                    placeholder="HDIT"
                                    type="text"
                                    name="major"
                                    value={formData.major}
                                    onChange={handleChange}
                                />
                                {errors.major && (
                                    <span className="error-text">{errors.major}</span>
                                )}
                            </div>

                            <div>
                                <LabelInput
                                    label="Password"
                                    type="password"
                                    placeholder="Enter Your Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                {errors.password && (
                                    <span className="error-text">{errors.password}</span>
                                )}
                            </div>
                        </div>

                        <div className="checkbox-container">
                            <input
                                type="checkbox"
                                id="terms"
                                name="terms"
                                checked={formData.terms}
                                onChange={handleChange}
                            />

                            <label htmlFor="terms">
                                I agree to the
                                <span style={{ color: '#0058BE' }}>
                                    {' '}Terms of Service{' '}
                                </span>
                                and Privacy Policy.
                            </label>
                        </div>

                        {errors.terms && (
                            <span className="error-text">{errors.terms}</span>
                        )}

                        <Button
                            text="Create Account"
                            className="register-button"
                            onClick={handleSubmit}
                        />

                        <p className="login-link">
                            Already have an account?{' '}
                            <span
                                onClick={() => navigate('/')}
                                style={{
                                    color: '#0058BE',
                                    cursor: 'pointer'
                                }}
                            >
                                Login Now
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {showOtpModal && (
                // <OtpModal
                //     email={formData.universityEmail}
                //     onClose={() => setShowOtpModal(false)}
                //     onVerify={handleVerifyOtp}
                // />

                <OtpModal
                    email={formData.universityEmail}
                    onClose={() => setShowOtpModal(false)}
                    onVerify={handleVerifyOtp}
                    onResend={handleResendOtp}
                />
            )}
        </>
    )
}
