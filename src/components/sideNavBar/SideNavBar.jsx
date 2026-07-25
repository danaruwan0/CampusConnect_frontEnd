import React, { useEffect, useState } from "react";
import "./sideNavBar.css";

import { useNavigate, useLocation } from "react-router-dom";

import defaultProfile from "../../assets/Default profile.jpg";

import { getProfile } from "../../api/profileApi";

import { FiX } from "react-icons/fi";

import {
    FiHome,
    FiUser,
    FiMessageCircle,
    FiSettings,
    FiLogOut
} from "react-icons/fi";

import { HiSparkles } from "react-icons/hi2";

export default function SideNavBar({
    open,
    onClose
}) {
    const navigate = useNavigate();
    const location = useLocation();

    const userId = Number(localStorage.getItem("userId"));

    const [profile, setProfile] = useState(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {

        try {

            const data = await getProfile(userId);

            setProfile(data);

        } catch (err) {

            console.log(err);

        }

    };

    const logout = () => {

        localStorage.clear();

        navigate("/login");

    };

    return (

        <div className={`side-navbar ${open ? "show" : ""}`}>

            {/* Profile */}
            <div className="close-btn" onClick={onClose}>
                <FiX />
            </div>


            <div className="side-profile">

                <img
                    src={profile?.profileImage || defaultProfile}
                    alt=""
                    onError={(e) => e.target.src = defaultProfile}
                />

                <h3>{profile?.fullName}</h3>

                <p>{profile?.major || "Student"}</p>

            </div>


            {/* Menu */}

            <div className="side-menu">

                <div
                    className={`side-item ${location.pathname === "/home" ? "active" : ""
                        }`}
                    onClick={() => navigate("/home")}
                >
                    <FiHome />
                    <span>Home</span>
                </div>


                <div
                    className={`side-item ${location.pathname === "/profile" ? "active" : ""
                        }`}
                    onClick={() => navigate("/profile")}
                >
                    <FiUser />
                    <span>Profile</span>
                </div>


                <div
                    className={`side-item ${location.pathname.startsWith("/message")
                        ? "active"
                        : ""
                        }`}
                    onClick={() => navigate("/message")}
                >
                    <FiMessageCircle />
                    <span>Messages</span>
                </div>


                <div
                    className={`side-item ${location.pathname === "/ai" ? "active" : ""
                        }`}
                    onClick={() => navigate("/ai")}
                >
                    <HiSparkles />
                    <span>AI Chat</span>
                </div>


                <div
                    className={`side-item ${location.pathname === "/setting" ? "active" : ""
                        }`}
                    onClick={() => navigate("/setting")}
                >
                    <FiSettings />
                    <span>Settings</span>
                </div>

            </div>


            {/* Logout */}

            <div
                className="side-logout"
                onClick={logout}
            >
                <FiLogOut />
                <span>Logout</span>
            </div>

        </div>

    );

}