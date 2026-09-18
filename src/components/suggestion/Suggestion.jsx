import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./suggestion.css";

import defaultProfile from "../../assets/Default profile.jpg";

import {
    getSuggestions,
    followUser
} from "../../api/followApi";

export default function Suggestion() {

    const navigate = useNavigate();

    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState({});

    const loggedUserId = Number(
        localStorage.getItem("userId")
    );


    /* =====================================================
       LOAD SUGGESTIONS
    ===================================================== */

    useEffect(() => {
        loadSuggestions();
    }, []);


    const loadSuggestions = async () => {

        try {

            setLoading(true);

            const data = await getSuggestions(
                loggedUserId
            );

            setSuggestions(data || []);

        } catch (error) {

            console.error(
                "Error loading suggestions:",
                error
            );

            setSuggestions([]);

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       FOLLOW USER
    ===================================================== */

    const handleFollow = async (followingId) => {

        try {

            // Prevent double click
            setFollowing((prev) => ({
                ...prev,
                [followingId]: true
            }));


            await followUser(
                loggedUserId,
                followingId
            );


            // Remove followed user from suggestions
            setSuggestions((prev) =>
                prev.filter(
                    (user) =>
                        user.userId !== followingId
                )
            );


        } catch (error) {

            console.error(
                "Error following user:",
                error
            );


            // Reset button if request failed
            setFollowing((prev) => ({
                ...prev,
                [followingId]: false
            }));

        }

    };


    /* =====================================================
       OPEN PROFILE
    ===================================================== */

    const handleProfileClick = (userId) => {

        navigate(`/profile/${userId}`);

    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (
            <section className="suggestion-sectionpart">

                <div className="suggestion-header">

                    <div>

                        <h2>
                            People You May Know
                        </h2>

                        <p>
                            Connect with students
                        </p>

                    </div>

                </div>


                <div className="suggestion-scroll">

                    <div className="suggestion-loading">
                        Loading...
                    </div>

                </div>

            </section>
        );

    }


    /* =====================================================
       NO SUGGESTIONS
    ===================================================== */

    if (suggestions.length === 0) {

        return null;

    }


    /* =====================================================
       UI
    ===================================================== */

    return (

        <section className="suggestion-sectionpart">

            <div className="suggestion-header">

                <div>

                    <h2>
                        People You May Know
                    </h2>

                    <p>
                        Connect with students
                    </p>

                </div>

            </div>


            <div className="suggestion-scroll">

                {suggestions.map((user) => (

                    <div
                        className="suggestion-card"
                        key={user.userId}
                    >

                        {/* PROFILE IMAGE */}

                        <img
                            src={
                                user.profileImage ||
                                defaultProfile
                            }
                            alt={
                                user.fullName ||
                                "User"
                            }
                            className="suggestion-profile"
                            onClick={() =>
                                handleProfileClick(
                                    user.userId
                                )
                            }
                            onError={(e) => {

                                e.target.src =
                                    defaultProfile;

                            }}
                        />


                        {/* USER INFO */}

                        <div className="suggestion-info">

                            <h3>
                                {user.fullName}
                            </h3>

                            <p>
                                {user.major ||
                                    "Student"}
                            </p>

                        </div>


                        {/* FOLLOW BUTTON */}

                        <button
                            className="suggestion-follow-btn"
                            disabled={
                                following[user.userId]
                            }
                            onClick={() =>
                                handleFollow(
                                    user.userId
                                )
                            }
                        >

                            {following[user.userId]
                                ? "Following..."
                                : "Follow"}

                        </button>

                    </div>

                ))}

            </div>

        </section>

    );

}