import "./navbar.css";
import React, { useState, useEffect } from "react";
import { searchUsers } from "../../api/searchApi";
import { FiBell } from "react-icons/fi";
import { FaRegSquarePlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../api/profileApi";
import defaultProfile from "../../assets/Default profile.jpg";
import { FiCpu } from "react-icons/fi";
import { FiMessageCircle } from "react-icons/fi";
import { FaRobot } from "react-icons/fa6";
import { GiArtificialIntelligence } from "react-icons/gi";
import { HiSparkles } from "react-icons/hi2"
import { FiLogOut } from "react-icons/fi";
import { FiMenu } from "react-icons/fi";
import { FaBarsStaggered } from "react-icons/fa6";
import { RiMenu3Line } from "react-icons/ri";
import { FiX } from "react-icons/fi";
import aiImage from "../../assets/ai.png";
import { MdEmergency } from "react-icons/md";
import { FaTriangleExclamation } from "react-icons/fa6";
import SideNavBar from "../sideNavBar/SideNavBar";
import Emergency from "../../components/emergency/Emergency";
import NotificationPanel from "../../components/notification/NotificationPanel"
import { getUnreadCount } from "../../api/notificationApi";

export default function Navbar({
    onCreatePost, onMenuClick }) {

    const userId = localStorage.getItem("userId");

    const [profile, setProfile] = useState(null);

    const loadProfile = async () => {
        try {
            const data = await getProfile(userId);
            setProfile(data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {

        loadProfile();

        loadUnreadCount();

        const interval = setInterval(() => {

            loadUnreadCount();

        }, 5000);

        return () => clearInterval(interval);

    }, []);

    const navigate = useNavigate();

    const [keyword, setKeyword] = useState("");

    const [users, setUsers] = useState([]);

    const handleSearch =
        async (e) => {

            const value =
                e.target.value;

            setKeyword(value);

            if (
                value.length < 2
            ) {

                setUsers([]);

                return;
            }

            try {

                const res =
                    await searchUsers(
                        value
                        ,
                        userId
                    );

                setUsers(res);

            } catch (err) {

                console.log(err);

            }
        };

    const logout = () => {

        localStorage.clear();

        navigate("/");
    };

    const [showEmergency, setShowEmergency] = useState(false);

    const [showNotifications, setShowNotifications] = useState(false);

    const [unreadCount, setUnreadCount] = useState(0);

    const loadUnreadCount = async () => {
        try {
            const count = await getUnreadCount(userId);
            setUnreadCount(count);
        } catch (err) {
            console.log(err);
        }
    };


    return (

        <>
            <div className="nav-navbar">

                <div className="nav-navbar-left">

                    {/* logo image */}
                    <img
                        src={aiImage}
                        alt="AI"
                        className="nav-header-avatar"
                    />

                </div>

                <div className="nav-navbar-center">

                    <input
                        className="nav-search-input"
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

                    {
                        users.length > 0 && (

                            <div
                                className="nav-search-result"
                            >

                                {
                                    users.map(
                                        (user) => (

                                            <div
                                                key={user.userId}
                                                className="nav-search-user"
                                                onClick={() => {

                                                    navigate(`/profile/${user.userId}`);

                                                    setKeyword("");
                                                    setUsers([]);

                                                }}
                                            >

                                                <div className="nav-search-user-image">

                                                    <img
                                                        src={
                                                            user.profileImage &&
                                                                user.profileImage.trim() !== ""
                                                                ? user.profileImage
                                                                : defaultProfile
                                                        }
                                                        alt={user.fullName}
                                                        onError={(e) => {

                                                            e.target.onerror = null;
                                                            e.target.src = defaultProfile;

                                                        }}
                                                    />

                                                </div>


                                                <div className="nav-search-user-info">

                                                    <h4>
                                                        {user.fullName}
                                                    </h4>

                                                    <p>
                                                        {user.email}
                                                    </p>

                                                </div>

                                            </div>
                                        )
                                    )
                                }

                            </div>

                        )
                    }

                </div>

                <div className="nav-navbar-right">

                    <div
                        className="nav-notification"
                        onClick={onCreatePost}
                        title="Create Post"
                    >
                        <FaRegSquarePlus />
                    </div>

                    <div
                        className="nav-notification"
                        onClick={() => navigate("/ai")}
                        title="AI Chat"
                    >
                        <HiSparkles />
                    </div>

                    <div
                        className="nav-notification"
                        title="Create Emergency"
                        onClick={() => setShowEmergency(true)}
                    >
                        <FaTriangleExclamation />
                    </div>

                    <div className="nav-notification-wrapper">

                        <div
                            className="nav-notification notification-bell"
                            title="Notifications"
                            onClick={() => {
                                setShowNotifications(true);
                                loadUnreadCount();
                            }}
                        >
                            <FiBell />

                            {unreadCount > 0 && (
                                <span className="nav-notification-badge">
                                    {unreadCount > 99 ? "99+" : unreadCount}
                                </span>
                            )}
                        </div>


                    </div>


                    <img
                        src={
                            profile?.profileImage
                                ? profile.profileImage
                                : defaultProfile
                        }
                        alt=""
                        className="nav-profile-image"
                        onClick={() => navigate("/profile")}
                    />

                    <div
                        className="nav-menu-icon"
                        onClick={onMenuClick}
                        title="Menu"
                    >
                        <RiMenu3Line />
                    </div>
                </div>
            </div>

            {
                showEmergency && (
                    <Emergency
                        onClose={() => setShowEmergency(false)}
                    />
                )
            }


            {
                showNotifications && (

                    <NotificationPanel
                        onClose={() => {

                            setShowNotifications(false);

                            loadUnreadCount();

                        }}
                    />

                )
            }
        </>
    );
}