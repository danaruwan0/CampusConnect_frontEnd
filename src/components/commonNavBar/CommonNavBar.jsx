import "./commonNavBar.css";

import React, { useEffect, useState } from "react";

import { searchUsers } from "../../api/searchApi";
import { getProfile } from "../../api/profileApi";
import { getUnreadCount } from "../../api/notificationApi";

import { FiBell } from "react-icons/fi";
import { FaRegSquarePlus } from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi2";
import { FaTriangleExclamation } from "react-icons/fa6";
import { RiMenu3Line } from "react-icons/ri";

import { useNavigate } from "react-router-dom";

import defaultProfile from "../../assets/Default profile.jpg";
import aiImage from "../../assets/ai.png";

import SideNavBar from "../sideNavBar/SideNavBar";
import Emergency from "../../components/emergency/Emergency";
import NotificationPanel from "../../components/notification/NotificationPanel";


export default function CommonNavBar({
    onCreatePost
}) {

    const navigate = useNavigate();

    const userId = localStorage.getItem("userId");


    /* ==========================================
       STATES
    ========================================== */

    const [profile, setProfile] = useState(null);

    const [keyword, setKeyword] = useState("");

    const [users, setUsers] = useState([]);

    const [showEmergency, setShowEmergency] = useState(false);

    const [showNotifications, setShowNotifications] = useState(false);

    const [unreadCount, setUnreadCount] = useState(0);

    const [sidebarOpen, setSidebarOpen] = useState(false);


    /* ==========================================
       LOAD PROFILE
    ========================================== */

    const loadProfile = async () => {

        try {

            const data = await getProfile(userId);

            setProfile(data);

        } catch (err) {

            console.log(err);

        }

    };


    /* ==========================================
       LOAD UNREAD NOTIFICATION COUNT
    ========================================== */

    const loadUnreadCount = async () => {

        try {

            const count = await getUnreadCount(userId);

            setUnreadCount(count);

        } catch (err) {

            console.log(err);

        }

    };


    /* ==========================================
       INITIAL LOAD
    ========================================== */

    useEffect(() => {

        loadProfile();

        loadUnreadCount();


        const interval = setInterval(() => {

            loadUnreadCount();

        }, 5000);


        return () => clearInterval(interval);

    }, []);


    /* ==========================================
       SEARCH
    ========================================== */

    const handleSearch = async (e) => {

        const value = e.target.value;

        setKeyword(value);


        if (value.length < 2) {

            setUsers([]);

            return;

        }


        try {

            const res = await searchUsers(value);

            setUsers(res);

        } catch (err) {

            console.log(err);

        }

    };


    /* ==========================================
       LOGOUT
    ========================================== */

    const logout = () => {

        localStorage.clear();

        navigate("/");

    };


    /* ==========================================
       MENU
    ========================================== */

    const openSidebar = () => {

        setSidebarOpen(true);

    };


    const closeSidebar = () => {

        setSidebarOpen(false);

    };


    /* ==========================================
       RENDER
    ========================================== */

    return (

        <>

            {/* ==================================
                NAVBAR
            ================================== */}

            <div className="common-nav-navbar">


                {/* ==================================
                    LEFT
                ================================== */}

                <div className="common-nav-navbar-left">

                    <img
                        src={aiImage}
                        alt="AI"
                        className="common-nav-header-avatar"
                    />

                </div>


                {/* ==================================
                    CENTER - SEARCH
                ================================== */}

                <div className="common-nav-navbar-center">

                    <input
                        className="common-nav-search-input"
                        type="text"
                        placeholder="Search users..."
                        value={keyword}
                        onChange={handleSearch}

                        onBlur={() => {

                            setTimeout(() => {

                                setUsers([]);

                            }, 200);

                        }}
                    />


                    {/* SEARCH RESULTS */}

                    {users.length > 0 && (

                        <div className="common-nav-search-result">

                            {users.map((user) => (

                                <div
                                    key={user.userId}
                                    className="common-nav-search-user"

                                    onClick={() => {

                                        navigate(
                                            `/profile/${user.userId}`
                                        );

                                        setKeyword("");

                                        setUsers([]);

                                    }}
                                >

                                    <h4>
                                        {user.fullName}
                                    </h4>

                                    <p>
                                        {user.email}
                                    </p>

                                </div>

                            ))}

                        </div>

                    )}

                </div>


                {/* ==================================
                    RIGHT
                ================================== */}

                <div className="common-nav-navbar-right">


                    {/* CREATE POST */}

                    <div
                        className="common-nav-notification"
                        onClick={onCreatePost}
                        title="Create Post"
                    >

                        <FaRegSquarePlus />

                    </div>


                    {/* AI CHAT */}

                    <div
                        className="common-nav-notification"
                        onClick={() => navigate("/ai")}
                        title="AI Chat"
                    >

                        <HiSparkles />

                    </div>


                    {/* EMERGENCY */}

                    <div
                        className="common-nav-notification"
                        title="Create Emergency"

                        onClick={() =>
                            setShowEmergency(true)
                        }
                    >

                        <FaTriangleExclamation />

                    </div>


                    {/* NOTIFICATIONS */}

                    <div className="common-nav-notification-wrapper">

                        <div
                            className="common-nav-notification common-nav-notification-bell"
                            title="Notifications"

                            onClick={() => {

                                setShowNotifications(true);

                                loadUnreadCount();

                            }}
                        >

                            <FiBell />


                            {unreadCount > 0 && (

                                <span className="common-nav-notification-badge">

                                    {unreadCount > 99
                                        ? "99+"
                                        : unreadCount
                                    }

                                </span>

                            )}

                        </div>

                    </div>


                    {/* PROFILE */}

                    <img
                        src={
                            profile?.profileImage
                                ? profile.profileImage
                                : defaultProfile
                        }

                        alt="Profile"

                        className="common-nav-profile-image"

                        onError={(e) => {

                            e.target.src = defaultProfile;

                        }}

                        onClick={() =>
                            navigate("/profile")
                        }
                    />


                    {/* MOBILE MENU */}

                    <div
                        className="common-nav-menu-icon"

                        onClick={openSidebar}

                        title="Menu"
                    >

                        <RiMenu3Line />

                    </div>

                </div>

            </div>


            {/* ==================================
                EMERGENCY
            ================================== */}

            {showEmergency && (

                <Emergency
                    onClose={() =>
                        setShowEmergency(false)
                    }
                />

            )}


            {/* ==================================
                NOTIFICATION PANEL
            ================================== */}

            {showNotifications && (

                <NotificationPanel

                    onClose={() => {

                        setShowNotifications(false);

                        loadUnreadCount();

                    }}

                />

            )}


            {/* ==================================
                MOBILE SIDE NAVBAR
            ================================== */}

            {sidebarOpen && (

                <>

                    {/* OVERLAY */}

                    <div
                        className="common-nav-sidebar-overlay"

                        onClick={closeSidebar}
                    />


                    {/* SIDEBAR */}

                    <div className="common-nav-sidebar-container">

                        <SideNavBar
                            open={true}
                            onClose={closeSidebar}
                        />

                    </div>

                </>

            )}

        </>

    );

}