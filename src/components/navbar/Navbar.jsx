import "./navbar.css";
import React, { useState, useEffect } from "react";
import { searchUsers } from "../../api/searchApi";
import { FiBell } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../api/profileApi";
import defaultProfile from "../../assets/Default profile.jpg";

import { FiCpu } from "react-icons/fi";
import { FiMessageCircle } from "react-icons/fi";
import { FaRobot } from "react-icons/fa6";
import { GiArtificialIntelligence } from "react-icons/gi";

import { HiSparkles } from "react-icons/hi2";

// import { Astroid } from 'lucide-react';
// import { Sparkles } from "lucide-react";
// import { Stars } from "lucide-react";




export default function Navbar() {

    const userId = localStorage.getItem("userId");

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

    const navigate =
        useNavigate();

    const [keyword,
        setKeyword] =
        useState("");

    const [users,
        setUsers] =
        useState([]);

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

    return (

        <div className="navbar">

            <div className="navbar-left">

                <h2 className="logo">
                    CampusConnect
                </h2>

            </div>

            <div className="navbar-center">

                <input
                    className="search-input"
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
                            className="search-result"
                        >

                            {
                                users.map(
                                    (user) => (

                                        <div
                                            key={user.userId}
                                            className="search-user"
                                            onClick={() => {

                                                navigate(`/profile/${user.userId}`);

                                                setKeyword("");

                                                setUsers([]);

                                            }}
                                        >

                                            <h4>
                                                {
                                                    user.fullName
                                                }
                                            </h4>

                                            <p>
                                                {
                                                    user.email
                                                }
                                            </p>

                                        </div>

                                    )
                                )
                            }

                        </div>

                    )
                }

            </div>

            <div className="navbar-right">

                <div
                    className="notification"
                >
                    <FiBell />
                </div>

                {/* add ai chat page  */}
                <div 
                    className="notification"
                    onClick={() => navigate("/ai")}

                >
                     {/* <Astroid /> */}
                     <HiSparkles  />
                </div>

                <img
                    src={
                        profile?.profileImage
                            ? profile.profileImage
                            : defaultProfile
                    }
                    alt=""
                    className="profile-image"
                    onClick={() => navigate("/profile")}
                />

                <button
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

        </div>
    );
}