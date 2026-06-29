import React, {
    useEffect,
    useRef,
    useState,
    useCallback
} from "react";

import { getConversation, markConversationAsRead } from "../../api/messageApi";
// import { connectSocket, sendMessage } from "../../services/websocket";
import defaultProfile from "../../assets/Default profile.jpg";

import "./chatWindow.css";

import { getProfile } from "../../api/profileApi";

import { connectSocket, sendMessage, disconnectSocket } from "../../services/websocket";

export default function ChatWindow({ currentUserId, selectedUser, onNewMessage, onlineUsers, setOnlineUsers }) {

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    const bottomRef = useRef(null);


    const [myProfile, setMyProfile] = useState(null);

    useEffect(() => {

        const loadMyProfile = async () => {

            try {

                const data = await getProfile(currentUserId);

                setMyProfile(data);

            } catch (err) {

                console.log(err);

            }

        };

        if (currentUserId) {

            loadMyProfile();

        }

    }, [currentUserId]);

    // ---------------- LOAD CONVERSATION ----------------

    const loadConversation = useCallback(async () => {

        if (!selectedUser) return;

        try {

            const data = await getConversation(
                currentUserId,
                selectedUser.userId
            );

            setMessages(data);

            // Read messages only for selected chat
            await markConversationAsRead(
                currentUserId,
                selectedUser.userId
            );

            // Refresh chat list
            onNewMessage();

        } catch (err) {

            console.log(err);

        }

    }, [
        currentUserId,
        selectedUser,
        onNewMessage
    ]);

    useEffect(() => {

        if (!selectedUser) return;

        loadConversation();

    }, [selectedUser]);

    // ---------------- WEBSOCKET ----------------

    useEffect(() => {

        connectSocket(

            (message) => {

                onNewMessage();

                if (
                    selectedUser &&
                    (
                        message.senderId === selectedUser.userId ||
                        message.receiverId === selectedUser.userId
                    )
                ) {

                    loadConversation();

                }

            },

            (status) => {

                setOnlineUsers(prev => {

                    if (status.online) {

                        if (prev.includes(status.userId)) {
                            return prev;
                        }

                        return [...prev, status.userId];

                    }

                    return prev.filter(
                        id => id !== status.userId
                    );

                });

            },

            currentUserId

        );

        return () => {

            disconnectSocket(currentUserId);

        };

    }, [currentUserId]);

    // ---------------- LOAD WHEN USER CHANGES ----------------


    // ---------------- AUTO SCROLL ----------------

    useEffect(() => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages]);

    // ---------------- SEND ----------------

    const handleSend = () => {

        if (!text.trim()) return;

        // sendMessage({

        //     senderId: currentUserId,
        //     receiverId: selectedUser.userId,
        //     content: text

        // });

        // setText("");


        //test uda
        sendMessage({

            senderId: currentUserId,
            receiverId: selectedUser.userId,
            content: text

        });

        setTimeout(() => {

            onNewMessage();

        }, 500);

        setText("");

    };

    // ---------------- EMPTY ----------------

    if (!selectedUser) {

        return (

            <div className="chat-window empty">

                <h2>Select a chat</h2>

            </div>

        );

    }

    // ---------------- UI ----------------

    return (

        <div className="chat-window">

            <div className="chat-header">

                <div className="header-avatar">

                    <img
                        src={
                            selectedUser.profileImage ||
                            defaultProfile
                        }
                        alt=""
                    />

                    {

                        onlineUsers.includes(selectedUser.userId) && (

                            <span className="online-dot"></span>

                        )

                    }

                </div>

                <div>

                    <h3>{selectedUser.fullName}</h3>

                    <small>

                        {

                            onlineUsers.includes(selectedUser.userId)

                                ? "Online"

                                : "Offline"

                        }

                    </small>

                </div>

            </div>

            <div className="messages">

                {

                    messages.map((msg, index) => {

                        const mine =
                            msg.senderId === currentUserId;

                        return (

                            // ll

                            <div
                                key={msg.id ?? index}
                                className={
                                    mine
                                        ? "message-row mine-row"
                                        : "message-row other-row"
                                }
                            >

                                {/* Other User Avatar */}

                                {

                                    !mine && (

                                        <img

                                            className="message-avatar"

                                            src={
                                                msg.senderImage ||
                                                selectedUser.profileImage ||
                                                defaultProfile
                                            }

                                            alt=""

                                            onError={(e) => {

                                                e.target.src = defaultProfile;

                                            }}

                                        />

                                    )

                                }

                                <div
                                    className={
                                        mine
                                            ? "mine"
                                            : "other"
                                    }
                                >

                                    <div>

                                        {msg.content}

                                    </div>

                                    {

                                        msg.sentAt && (

                                            <small>

                                                {

                                                    new Date(msg.sentAt).toLocaleTimeString(
                                                        [],
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        }
                                                    )

                                                }

                                            </small>

                                        )

                                    }

                                </div>

                                {/* My Avatar */}

                                {

                                    mine && (

                                        <img

                                            className="message-avatar"

                                            src={
                                                myProfile?.profileImage ||
                                                defaultProfile
                                            }

                                            alt=""

                                            onError={(e) => {

                                                e.target.src = defaultProfile;

                                            }}

                                        />

                                    )

                                }

                            </div>
                        );

                    })

                }

                <div ref={bottomRef}></div>

            </div>

            <div className="send-box">

                <input

                    value={text}

                    placeholder="Type message..."

                    onChange={(e) =>
                        setText(e.target.value)
                    }

                    onKeyDown={(e) => {

                        if (e.key === "Enter") {

                            handleSend();

                        }

                    }}

                />

                <button onClick={handleSend}>

                    Send

                </button>

            </div>

        </div>

    );

}