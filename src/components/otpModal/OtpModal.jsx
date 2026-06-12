import React, { useRef, useState } from 'react'
import './otpModal.css'
import Button from '../button/Button'

import { FiRefreshCw } from 'react-icons/fi'
import Swal from "sweetalert2";


export default function OtpModal({ email, onClose, onVerify, onResend }) {
    const [otp, setOtp] = useState(['', '', '', '', '', ''])

    const inputRefs = useRef([])

    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)


        if (value && index < 5) {
            inputRefs.current[index + 1].focus()
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus()
        }
    }

    const handleVerify = () => {
    const finalOtp = otp.join('');

    if (finalOtp.length !== 6) {
        Swal.fire({
            icon: 'error',
            title: 'OTP Required',
            text: 'Enter the complete 6-digit verification code.',
            confirmButtonColor: '#0058BE',
            backdrop: true
        });

        return;
    }

    onVerify(finalOtp);
};


    const [resending, setResending] = useState(false)

    const handleResendClick = async () => {
        setResending(true)

        try {
            await onResend()
        } finally {
            setResending(false)
        }
    }

    return (
        <div className="otp-overlay">
            <div className="otp-modal">
                <h2>Verify Your Email</h2>

                <p>
                    We’ve sent a 6-digit code to <strong style={{ color: '#0058BE' }}>{email}</strong>
                </p>

                <div className="otp-input-group">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            maxLength="1"
                            value={digit}
                            className="otp-box"
                            onChange={(e) =>
                                handleChange(e.target.value, index)
                            }
                            onKeyDown={(e) =>
                                handleKeyDown(e, index)
                            }
                        />
                    ))}
                </div>

                <Button
                    text="Verify & Complete Registration"
                    className="register-button"
                    onClick={handleVerify}
                />

                <button
                    className="otp-cancel-btn"
                    onClick={onClose}
                >
                    Cancel
                </button>


                <p>2 minutes to expire your OTP</p>

                <button
                    className="resend-btn"
                    onClick={handleResendClick}
                    disabled={resending}
                >
                    {resending ? (
                        <>
                            <FiRefreshCw className="spin-icon" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <FiRefreshCw />
                            Resend OTP
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}