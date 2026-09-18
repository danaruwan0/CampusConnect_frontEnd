
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profileSuggestion.css";

import defaultProfile from "../../assets/Default profile.jpg";

import {
    getSuggestions,
    followUser
} from "../../api/followApi";

export default function ProfileSuggestion() {

    const navigate = useNavigate();

    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState({});

    const loggedUserId = Number(
        localStorage.getItem("userId")
    );


    /* =====================================================
       LOAD PROFILE SUGGESTIONS
    ===================================================== */

    useEffect(() => {

        loadProfileSuggestions();

    }, []);


    const loadProfileSuggestions = async () => {

        try {

            setLoading(true);

            const data = await getSuggestions(
                loggedUserId
            );

            setSuggestions(data || []);

        } catch (error) {

            console.error(
                "Error loading profile suggestions:",
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

    const handleProfileFollow = async (followingId) => {

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


            // Remove followed user
            setSuggestions((prev) =>
                prev.filter(
                    (user) =>
                        user.userId !== followingId
                )
            );


        } catch (error) {

            console.error(
                "Error following profile user:",
                error
            );


            // Reset button
            setFollowing((prev) => ({
                ...prev,
                [followingId]: false
            }));

        }

    };


    /* =====================================================
       OPEN PROFILE
    ===================================================== */

    const handleProfileSuggestionClick = (userId) => {

        navigate(`/profile/${userId}`);

    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <section className="profile-suggestion-section">

                <div className="profile-suggestion-header">

                    <div>

                        <h2>
                            People You May Know
                        </h2>

                        <p>
                            Connect with students
                        </p>

                    </div>

                </div>


                <div className="profile-suggestion-scroll">

                    <div className="profile-suggestion-loading">

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

        <section className="profile-suggestion-section">

            {/* HEADER */}

            <div className="profile-suggestion-header">

                <div>

                    <h2>
                        People You May Know
                    </h2>

                    <p>
                        Connect with students
                    </p>

                </div>

            </div>


            {/* HORIZONTAL SUGGESTIONS */}

            <div className="profile-suggestion-scroll">

                {suggestions.map((user) => (

                    <div
                        className="profile-suggestion-card"
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

                            className="profile-suggestion-image"

                            onClick={() =>
                                handleProfileSuggestionClick(
                                    user.userId
                                )
                            }

                            onError={(e) => {

                                e.target.src =
                                    defaultProfile;

                            }}
                        />


                        {/* USER INFORMATION */}

                        <div className="profile-suggestion-info">

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
                            className="profile-suggestion-follow"

                            disabled={
                                following[user.userId]
                            }

                            onClick={() =>
                                handleProfileFollow(
                                    user.userId
                                )
                            }
                        >

                            {
                                following[user.userId]
                                    ? "Following..."
                                    : "Follow"
                            }

                        </button>

                    </div>

                ))}

            </div>

        </section>

    );

}

