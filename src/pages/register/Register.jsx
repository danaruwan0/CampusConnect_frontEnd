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

    const majors = [
        "HDIT Batch 1",
        "HDIT Batch 2",
        "HDIT Batch 3",
        "QS Batch 1",
        "QS Batch 2",
        "QS Batch 3",
        "CBIT Batch 1",
        "CBIT Batch 2"
    ];

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
        );

        localStorage.setItem(
            "token",
            res.data.token
        );

        localStorage.setItem(
            "userId",
            res.data.userId
        );

        localStorage.setItem(
            "fullName",
            res.data.fullName
        );

        localStorage.setItem(
            "email",
            res.data.email
        );


        Swal.fire({
            icon:"success",
            title:"Success",
            text:"Account created successfully"
        });


        setShowOtpModal(false);

        navigate("/home");


    } catch(error){

        Swal.fire({
            icon:"error",
            title:"Verification Failed",
            text:error.response?.data || "Invalid OTP"
        });

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
                            placeholder="032502010@icst.edu.lk"
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
                                <div className="major-container">
                                    <label className="major-label">Major</label>

                                    <input
                                        type="text"
                                        list="major-options"
                                        name="major"
                                        placeholder="Your Major"
                                        value={formData.major}
                                        onChange={handleChange}
                                        className="major-input"
                                    />

                                    <datalist id="major-options">
                                        {majors.map((major, index) => (
                                            <option key={index} value={major} />
                                        ))}
                                    </datalist>
                                </div>
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
