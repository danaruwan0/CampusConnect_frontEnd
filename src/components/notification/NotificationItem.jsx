import React, { useEffect, useState } from "react";
import "./notificationItem.css";

import {
    FiArrowLeft,
    FiMapPin,
    FiClock,
    FiAlertTriangle
} from "react-icons/fi";

import defaultProfile from "../../assets/Default profile.jpg";

import { getEmergency } from "../../api/emergencyApi";

export default function NotificationItem({

    notification,

    onBack

}) {

    const [emergency, setEmergency] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadEmergency();

    }, []);

    const loadEmergency = async () => {

        try {

            const data =
                await getEmergency(notification.referenceId);

            setEmergency(data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="notification-detail-loading">

                Loading Emergency...

            </div>

        );

    }

    if (!emergency) {

        return (

            <div className="notification-detail-loading">

                Emergency not found

            </div>

        );

    }

    return (

        <div className="notification-detail">

            {/* Header */}

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

            {/* Sender */}

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

                        {" "}

                        {

                            new Date(
                                emergency.createdAt
                            ).toLocaleString()

                        }

                    </span>

                </div>

            </div>

            {/* Title */}

            <div className="notification-section">

                <div className="notification-badge">

                    <FiAlertTriangle />

                    Emergency

                </div>

                <h1>

                    {emergency.title}

                </h1>

            </div>

            {/* Description */}

            <div className="notification-section">

                <h4>Description</h4>

                <p>

                    {emergency.description}

                </p>

            </div>

            {/* Location */}

            {

                emergency.locationName &&

                <div className="notification-section">

                    <h4>

                        <FiMapPin />

                        Location

                    </h4>

                    <p>

                        {emergency.locationName}

                    </p>

                </div>

            }

            {/* Image */}

            {

                emergency.imageUrl &&

                <div className="notification-section">

                    <img

                        className="notification-image"

                        src={emergency.imageUrl}

                        alt="Emergency"

                    />

                </div>

            }

            {/* Video */}

            {

                emergency.videoUrl &&

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

            }

        </div>

    );

}