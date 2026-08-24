import React, { useEffect, useState } from "react";
import "./notificationPanel.css";

import { FiBell, FiX } from "react-icons/fi";

import defaultProfile from "../../assets/Default profile.jpg";

import {
    getNotifications,
    markAsRead
} from "../../api/notificationApi";

import NotificationItem from "./NotificationItem";

export default function NotificationPanel({ onClose }) {

    const userId = localStorage.getItem("userId");

    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(true);

    const [selectedNotification, setSelectedNotification] =
        useState(null);

    useEffect(() => {

        loadNotifications();

    }, []);

    const loadNotifications = async () => {

        try {

            setLoading(true);

            const data =
                await getNotifications(userId);

            setNotifications(data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    const handleNotificationClick = async (notification) => {

        try {

            if (!notification.readStatus) {

                await markAsRead(notification.id);

            }

            setSelectedNotification(notification);

            loadNotifications();

        }

        catch (err) {

            console.log(err);

        }

    };

    return (

        <div
            className="notification-overlay"
            onClick={onClose}
        >

            <div
                className="notification-panel"
                onClick={(e) => e.stopPropagation()}
            >

                {

                    selectedNotification ? (

                        <NotificationItem

                            notification={selectedNotification}

                            onBack={() =>
                                setSelectedNotification(null)
                            }

                        />

                    ) : (

                        <>

                            <div className="notification-header">

                                <h2>

                                    <FiBell />

                                    Notifications

                                </h2>

                                <button
                                    onClick={onClose}
                                >
                                    <FiX />
                                </button>

                            </div>

                            <div className="notification-list">

                                {

                                    loading ? (

                                        <p>

                                            Loading...

                                        </p>

                                    )

                                        :

                                        notifications.length === 0 ? (

                                            <p>

                                                No notifications

                                            </p>

                                        )

                                            :

                                            notifications.map(notification => (

                                                <div

                                                    key={notification.id}

                                                    className={`notification-card ${notification.readStatus
                                                        ? ""
                                                        : "unread"
                                                        }`}

                                                    onClick={() =>
                                                        handleNotificationClick(
                                                            notification
                                                        )
                                                    }

                                                >

                                                    <img

                                                        src={
                                                            notification.senderProfileImage
                                                                || defaultProfile
                                                        }

                                                        alt="Profile"

                                                    />

                                                    <div>

                                                        <h4>

                                                            {
                                                                notification.senderName
                                                            }

                                                        </h4>

                                                        <p>

                                                            {
                                                                notification.title
                                                            }

                                                        </p>

                                                        <small>

                                                            {
                                                                notification.message
                                                            }

                                                        </small>

                                                    </div>

                                                </div>

                                            ))

                                }

                            </div>

                        </>

                    )

                }

            </div>

        </div>

    );

}