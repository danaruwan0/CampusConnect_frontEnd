import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ChatList from "../../components/chatList/ChatList";
import ChatWindow from "../../components/chatWindow/ChatWindow";

import { getProfile } from "../../api/profileApi";

import "./message.css";

export default function Message() {

    const currentUserId =
        Number(localStorage.getItem("userId"));

    const { userId: chatUserId } = useParams();

    const [selectedUser, setSelectedUser] =
        useState(null);

    const [refreshKey, setRefreshKey] =
        useState(0);

    const [onlineUsers, setOnlineUsers] =
        useState([]);

    const [typingUsers, setTypingUsers] =
        useState([]);

    // ----------------------------
    // Refresh Chat List
    // ----------------------------

    const refreshChats = () => {

        setRefreshKey(prev => prev + 1);

        console.log("REFRESH CHATS");

    };

    // ----------------------------
    // Open chat directly from Profile
    // ----------------------------

    useEffect(() => {

        if (!chatUserId) return;

        const loadSelectedUser = async () => {

            try {

                const profile = await getProfile(
                    Number(chatUserId)
                );

                setSelectedUser({

                    userId: Number(chatUserId),

                    fullName: profile.fullName,

                    email: profile.email,

                    profileImage: profile.profileImage,

                    major: profile.major

                });

            } catch (err) {

                console.log(err);

            }

        };

        loadSelectedUser();

    }, [chatUserId]);

    return (

        <div className="message-page">

            <ChatList

                currentUserId={currentUserId}

                selectedUser={selectedUser}

                onSelect={setSelectedUser}

                refreshKey={refreshKey}

                onlineUsers={onlineUsers}

                typingUsers={typingUsers}

            />

            <ChatWindow

                currentUserId={currentUserId}

                selectedUser={selectedUser}

                onNewMessage={refreshChats}

                onlineUsers={onlineUsers}

                setOnlineUsers={setOnlineUsers}

                setTypingUsers={setTypingUsers}

            />

        </div>

    );

}