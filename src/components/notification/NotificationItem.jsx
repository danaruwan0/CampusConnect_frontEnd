import React, { useEffect, useState } from "react";
import "./notificationItem.css";

import {
    FiArrowLeft,
    FiMapPin,
    FiClock,
    FiAlertTriangle,
    FiUserMinus,
    FiUserPlus
} from "react-icons/fi";

import defaultProfile from "../../assets/Default profile.jpg";

import { getEmergency } from "../../api/emergencyApi";

import { useNavigate } from "react-router-dom";

export default function NotificationItem({
    notification,
    onBack
}) {

    const navigate = useNavigate();

    const [emergency, setEmergency] = useState(null);

    const [loading, setLoading] = useState(false);


    /*
    =========================================================
    FOLLOW NOTIFICATION
    =========================================================
    */

    if (notification.type === "FOLLOW") {

        return (

            <div className="notification-detail">

                {/* HEADER */}

                <div className="notification-detail-header">

                    <button
                        className="notification-back-btn"
                        onClick={onBack}
                    >
                        <FiArrowLeft />
                    </button>

                    <h2>
                        New Follower
                    </h2>

                </div>


                {/* USER */}

                <div className="notification-user">

                    <img
                        src={
                            notification.senderProfileImage ||
                            defaultProfile
                        }
                        alt="Profile"
                    />

                    <div>

                        <h3>
                            {notification.senderName}
                        </h3>

                        <span>

                            <FiClock />

                            {new Date(
                                notification.createdAt
                            ).toLocaleString()}

                        </span>

                    </div>

                </div>


                {/* CONTENT */}

                <div className="notification-section">

                    <div className="notification-badge">

                        <FiUserPlus />

                        New Follower

                    </div>


                    <h1>

                        {notification.senderName}

                        {" "}

                        started following you

                    </h1>


                    {/* PROFILE BUTTON */}

                    <button
                        className="notification-profile-btn"
                        onClick={() =>
                            navigate(
                                `/profile/${notification.referenceId}`
                            )
                        }
                    >

                        View Profile

                    </button>

                </div>

            </div>

        );

    }


    /*
    =========================================================
    UNFOLLOW NOTIFICATION
    =========================================================
    */

    if (notification.type === "UNFOLLOW") {

        return (

            <div className="notification-detail">

                {/* HEADER */}

                <div className="notification-detail-header">

                    <button
                        className="notification-back-btn"
                        onClick={onBack}
                    >
                        <FiArrowLeft />
                    </button>

                    <h2>
                        Unfollowed You
                    </h2>

                </div>


                {/* USER */}

                <div className="notification-user">

                    <img
                        src={
                            notification.senderProfileImage ||
                            defaultProfile
                        }
                        alt="Profile"
                    />

                    <div>

                        <h3>
                            {notification.senderName}
                        </h3>

                        <span>

                            <FiClock />

                            {new Date(
                                notification.createdAt
                            ).toLocaleString()}

                        </span>

                    </div>

                </div>


                {/* CONTENT */}

                <div className="notification-section">

                    <div className="notification-badge notification-unfollow-badge">

                        <FiUserMinus />

                        Unfollowed You

                    </div>


                    <h1>

                        {notification.senderName}

                        {" "}

                        unfollowed you

                    </h1>


                    {/* PROFILE BUTTON */}

                    <button
                        className="notification-profile-btn"
                        onClick={() =>
                            navigate(
                                `/profile/${notification.referenceId}`
                            )
                        }
                    >

                        View Profile

                    </button>

                </div>

            </div>

        );

    }


    /*
    =========================================================
    EMERGENCY NOTIFICATION
    =========================================================
    */

    useEffect(() => {

        if (notification.type !== "EMERGENCY") {
            return;
        }

        loadEmergency();

    }, [notification]);


    const loadEmergency = async () => {

        try {

            setLoading(true);

            const data =
                await getEmergency(
                    notification.referenceId
                );

            setEmergency(data);

        }

        catch (err) {

            console.log(
                "Error loading emergency:",
                err
            );

        }

        finally {

            setLoading(false);

        }

    };


    /*
    =========================================================
    EMERGENCY LOADING
    =========================================================
    */

    if (loading) {

        return (

            <div className="notification-detail-loading">

                Loading Emergency...

            </div>

        );

    }


    /*
    =========================================================
    EMERGENCY NOT FOUND
    =========================================================
    */

    if (!emergency) {

        return (

            <div className="notification-detail-loading">

                Emergency not found

            </div>

        );

    }


    /*
    =========================================================
    EMERGENCY DETAIL
    =========================================================
    */

    return (

        <div className="notification-detail">

            {/* HEADER */}

            <div className="notification-detail-header">

                <button
                    className="notification-back-btn"
                    onClick={onBack}
                >
                    <FiArrowLeft />
                </button>

                <h2>
                    Emergency Alert
                </h2>

            </div>


            {/* SENDER */}

            <div className="notification-user">

                <img
                    src={
                        emergency.senderProfileImage ||
                        defaultProfile
                    }
                    alt="Profile"
                />

                <div>

                    <h3>
                        {emergency.senderName}
                    </h3>

                    <span>

                        <FiClock />

                        {new Date(
                            emergency.createdAt
                        ).toLocaleString()}

                    </span>

                </div>

            </div>


            {/* TITLE */}

            <div className="notification-section">

                <div className="notification-badge">

                    <FiAlertTriangle />

                    Emergency

                </div>

                <h1>
                    {emergency.title}
                </h1>

            </div>


            {/* DESCRIPTION */}

            <div className="notification-section">

                <h4>
                    Description
                </h4>

                <p>
                    {emergency.description}
                </p>

            </div>


            {/* LOCATION */}

            {
                emergency.locationName && (

                    <div className="notification-section">

                        <h4>

                            <FiMapPin />

                            Location

                        </h4>

                        <p>
                            {emergency.locationName}
                        </p>

                    </div>

                )
            }


            {/* IMAGE */}

            {
                emergency.imageUrl && (

                    <div className="notification-section">

                        <img
                            className="notification-image"
                            src={emergency.imageUrl}
                            alt="Emergency"
                        />

                    </div>

                )
            }


            {/* VIDEO */}

            {
                emergency.videoUrl && (

                    <div className="notification-section">

                        <video
                            controls
                            className="notification-video"
                        >

                            <source
                                src={emergency.videoUrl}
                            />

                        </video>

                    </div>

                )
            }

        </div>

    );

}