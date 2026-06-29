import axios from "axios";

const BASE_URL = "http://localhost:8081/api/auth";

// REGISTER (with mapping fix)
export const registerUser = async (formData) => {
    return await axios.post(`${BASE_URL}/register`, {
        fullName: formData.fullName,
        email: formData.universityEmail,   
        major: formData.major,
        password: formData.password
    });
};

// VERIFY OTP
export const verifyOtp = async (email, otp) => {
    return await axios.post(`${BASE_URL}/verify-otp`, {
        email,
        otp
    });
};

// LOGIN
export const loginUser = async (email, password) => {
    const res = await axios.post(`${BASE_URL}/login`, {
        email,
        password
    });

    return res.data;
};

// RESEND OTP
export const resendOtp = async (email) => {
    return await axios.post(
        `${BASE_URL}/resend-otp`,
        { email }
    );
};