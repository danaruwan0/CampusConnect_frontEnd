import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import { useParams } from "react-router-dom";

import ChatList from "../../components/chatList/ChatList";
import ChatWindow from "../../components/chatWindow/ChatWindow";

import { getProfile } from "../../api/profileApi";

import "./message.css";


export default function Message() {

    // =========================================================
    // CURRENT USER
    // =========================================================

    const currentUserId =
        Number(localStorage.getItem("userId"));


    // =========================================================
    // URL CHAT USER
    // =========================================================

    const {
        userId: chatUserId
    } = useParams();


    // =========================================================
    // STATES
    // =========================================================

    const [selectedUser, setSelectedUser] =
        useState(null);

    const [refreshKey, setRefreshKey] =
        useState(0);

    const [onlineUsers, setOnlineUsers] =
        useState([]);

    const [typingUsers, setTypingUsers] =
        useState([]);

    const [mobileChatOpen, setMobileChatOpen] =
        useState(false);


    // =========================================================
    // REFRESH CHAT LIST
    // =========================================================

    const refreshChats = useCallback(() => {

        console.log(
            "REFRESH CHAT LIST"
        );

        setRefreshKey(prev => prev + 1);

    }, []);


    // =========================================================
    // OPEN CHAT DIRECTLY FROM PROFILE / URL
    // =========================================================

    useEffect(() => {

        if (!chatUserId) {
            return;
        }

        const loadSelectedUser = async () => {

            try {

                console.log(
                    "OPEN CHAT USER:",
                    chatUserId
                );

                const profile =
                    await getProfile(
                        Number(chatUserId)
                    );


                setSelectedUser({

                    userId:
                        Number(chatUserId),

                    fullName:
                        profile.fullName,

                    email:
                        profile.email,

                    profileImage:
                        profile.profileImage,

                    major:
                        profile.major

                });


                // -------------------------------------------------
                // MOBILE
                // -------------------------------------------------

                setMobileChatOpen(true);

            } catch (err) {

                console.error(
                    "Failed to load selected user:",
                    err
                );

            }

        };


        loadSelectedUser();

    }, [chatUserId]);


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="message-page">

            {/* =================================================
                CHAT LIST
            ================================================= */}

            <div
                className={
                    `chat-list-wrapper ${
                        mobileChatOpen
                            ? "hide-mobile"
                            : ""
                    }`
                }
            >

                <ChatList

                    currentUserId={
                        currentUserId
                    }

                    selectedUser={
                        selectedUser
                    }

                    refreshKey={
                        refreshKey
                    }

                    onlineUsers={
                        onlineUsers
                    }

                    typingUsers={
                        typingUsers
                    }

                    onSelect={(user) => {

                        console.log(
                            "SELECT CHAT:",
                            user
                        );

                        setSelectedUser(
                            user
                        );

                        setMobileChatOpen(
                            true
                        );

                    }}

                />

            </div>


            {/* =================================================
                CHAT WINDOW
            ================================================= */}

            <div
                className={
                    `chat-window-wrapper ${
                        mobileChatOpen
                            ? "show-mobile"
                            : ""
                    }`
                }
            >

                <ChatWindow

                    currentUserId={
                        currentUserId
                    }

                    selectedUser={
                        selectedUser
                    }

                    onNewMessage={
                        refreshChats
                    }

                    onlineUsers={
                        onlineUsers
                    }

                    setOnlineUsers={
                        setOnlineUsers
                    }

                    setTypingUsers={
                        setTypingUsers
                    }

                    mobileChatOpen={
                        mobileChatOpen
                    }

                    setMobileChatOpen={
                        setMobileChatOpen
                    }

                />

            </div>

        </div>

    );

}