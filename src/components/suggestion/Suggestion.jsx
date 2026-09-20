import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./suggestion.css";

import defaultProfile from "../../assets/Default profile.jpg";


export default function Suggestion({
    suggestions = [],
    onFollow
}) {

    const navigate = useNavigate();


    // =====================================================
    // LOCAL SUGGESTIONS
    // =====================================================

    const [localSuggestions, setLocalSuggestions] =
        useState(
            Array.isArray(suggestions)
                ? suggestions
                : []
        );


    // =====================================================
    // FOLLOWING / LOADING STATE
    // =====================================================

    const [following, setFollowing] =
        useState({});


    // =====================================================
    // UPDATE LOCAL SUGGESTIONS
    // WHEN PARENT DATA CHANGES
    // =====================================================

    useEffect(() => {

        setLocalSuggestions(
            Array.isArray(suggestions)
                ? suggestions
                : []
        );

    }, [suggestions]);


    // =====================================================
    // FOLLOW USER
    // =====================================================

    const handleFollow = async (
        userId,
        isFollowing
    ) => {

        // -------------------------------------------------
        // Prevent duplicate clicks
        // -------------------------------------------------

        if (following[userId]) {
            return;
        }


        // -------------------------------------------------
        // Save current data
        // -------------------------------------------------

        const previousSuggestions =
            [...localSuggestions];


        try {

            // =================================================
            // BUTTON LOADING
            // =================================================

            setFollowing(prev => ({
                ...prev,
                [userId]: true
            }));


            // =================================================
            // BACKEND FOLLOW / UNFOLLOW
            // =================================================

            await onFollow(
                userId,
                isFollowing
            );


            // =================================================
            // FOLLOW SUCCESS
            // =================================================

            if (!isFollowing) {

                /*
                 * User was not following before.
                 *
                 * Follow success.
                 *
                 * Remove the user from
                 * People You May Know.
                 */

                setLocalSuggestions(prev =>
                    prev.filter(
                        user =>
                            user.userId !== userId
                    )
                );

            }


            // =================================================
            // UNFOLLOW SUCCESS
            // =================================================

            else {

                /*
                 * If this component ever contains
                 * a Following user and they unfollow,
                 * update the state.
                 */

                setLocalSuggestions(prev =>
                    prev.map(user => {

                        if (
                            user.userId === userId
                        ) {

                            return {
                                ...user,
                                isFollowing: false
                            };

                        }

                        return user;

                    })
                );

            }


        } catch (error) {

            // =================================================
            // ERROR
            // =================================================

            console.error(
                "Suggestion follow error:",
                error
            );


            // -------------------------------------------------
            // Restore old suggestions
            // -------------------------------------------------

            setLocalSuggestions(
                previousSuggestions
            );


        } finally {

            // =================================================
            // REMOVE LOADING
            // =================================================

            setFollowing(prev => {

                const updated = {
                    ...prev
                };

                delete updated[userId];

                return updated;

            });

        }

    };


    // =====================================================
    // OPEN PROFILE
    // =====================================================

    const handleProfileClick = (
        userId
    ) => {

        if (!userId) {
            return;
        }


        navigate(
            `/profile/${userId}`
        );

    };


    // =====================================================
    // IMAGE ERROR
    // =====================================================

    const handleImageError = (
        event
    ) => {

        event.currentTarget.src =
            defaultProfile;

    };


    // =====================================================
    // NO SUGGESTIONS
    // =====================================================

    if (
        !localSuggestions ||
        localSuggestions.length === 0
    ) {

        return null;

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <section className="suggestion-sectionpart">


            {/* =================================================
                HEADER
            ================================================= */}

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


            {/* =================================================
                SUGGESTION SCROLL
            ================================================= */}

            <div className="suggestion-scroll">

                {localSuggestions.map(
                    user => {

                        const userId =
                            user.userId;


                        const isFollowing =
                            Boolean(
                                user.isFollowing
                            );


                        const isUpdating =
                            Boolean(
                                following[userId]
                            );


                        return (

                            <div
                                className="suggestion-card"
                                key={userId}
                            >


                                {/* =================================
                                    PROFILE IMAGE
                                ================================= */}

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
                                            userId
                                        )
                                    }

                                    onError={
                                        handleImageError
                                    }
                                />


                                {/* =================================
                                    USER INFORMATION
                                ================================= */}

                                <div className="suggestion-info">

                                    <h3
                                        title={
                                            user.fullName ||
                                            "User"
                                        }
                                    >
                                        {
                                            user.fullName ||
                                            "Unknown User"
                                        }
                                    </h3>


                                    <p
                                        title={
                                            user.major ||
                                            "Student"
                                        }
                                    >
                                        {
                                            user.major ||
                                            "Student"
                                        }
                                    </p>

                                </div>


                                {/* =================================
                                    FOLLOW BUTTON
                                ================================= */}

                                <button

                                    type="button"

                                    className={
                                        `
                                        suggestion-follow-btn
                                        ${
                                            isFollowing
                                                ? "following"
                                                : ""
                                        }
                                        ${
                                            isUpdating
                                                ? "updating"
                                                : ""
                                        }
                                        `
                                    }

                                    disabled={
                                        isUpdating
                                    }

                                    onClick={() =>
                                        handleFollow(
                                            userId,
                                            isFollowing
                                        )
                                    }

                                >

                                    {
                                        isUpdating

                                            ? "Following..."

                                            : isFollowing

                                                ? "Following"

                                                : "Follow"
                                    }

                                </button>


                            </div>

                        );

                    }
                )}

            </div>


        </section>

    );

}