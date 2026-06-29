import React, { useState } from 'react';
import './login.css';
import { loginUser } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/button/Button';
import LabelInput from '../../components/labelInput/LabelInput';
import Logo from '../../components/logo/Logo';

import LoginImage from '../../assets/login.png';

export default function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        setErrors({
            ...errors,
            [name]: ''
        });
    };

    const validate = () => {
        let newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        }

        return newErrors;
    };

    const handleSubmit = async () => {

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {

            // ✅ LOGIN API CALL
            const data = await loginUser(
                formData.email,
                formData.password
            );

            // ✅ SAVE TOKEN + USER INFO
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("fullName", data.fullName);
            localStorage.setItem("email", data.email);

            alert("Login Successful");

            navigate("/home");

        } catch (error) {
            console.log(error);
            alert("Invalid email or password");
        }
    };

    return (
        <div className="register-container">

            {/* LEFT IMAGE */}
            <div className="register-image-container">

                <img
                    src={LoginImage}
                    alt="Login"
                    className="register-image"
                />

                <div className="templogo">
                    <Logo />
                </div>

                <div className="register-image-text">
                    <div className="register-image-text-content">
                        <h1>Empowering Student Success</h1>
                        <p>
                            Join thousands of students in a secure academic platform.
                        </p>
                    </div>
                </div>

            </div>

            {/* RIGHT FORM */}
            <div className="register-form-container">

                <div className="register-form">

                    <Logo />

                    <h2>Welcome Back</h2>
                    <p>Sign in to continue</p>

                    {/* EMAIL */}
                    <LabelInput
                        label="University Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                    />
                    {errors.email && (
                        <span className="error-text">{errors.email}</span>
                    )}

                    {/* PASSWORD */}
                    <LabelInput
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                    />
                    {errors.password && (
                        <span className="error-text">{errors.password}</span>
                    )}

                    {/* BUTTON */}
                    <Button
                        text="Sign In"
                        className="register-button"
                        onClick={handleSubmit}
                    />

                    <p className="login-link">
                        Don't have an account?{" "}
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
    );
}