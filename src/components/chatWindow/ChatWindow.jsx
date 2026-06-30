import React, { useEffect, useRef, useState, useCallback } from "react";

import { getConversation, markConversationAsRead } from "../../api/messageApi";
import defaultProfile from "../../assets/Default profile.jpg";

import "./chatWindow.css";

import { getProfile } from "../../api/profileApi";

import { connectSocket, sendMessage, disconnectSocket } from "../../services/websocket";
import { sendTyping, stopTyping, subscribeTyping } from "../../services/typingSocket";

import { MdDone, MdDoneAll } from "react-icons/md";

import { sendSeen, subscribeSeen } from "../../services/seenSocket";

import { getOnlineUsers } from "../../api/statusApi";

export default function ChatWindow({ currentUserId, selectedUser, onNewMessage, onlineUsers, setOnlineUsers, setTypingUsers }) {

    const [typing, setTyping] = useState(false);

    const typingTimeout = useRef(null);

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

            const hasUnread = data.some(

                msg =>

                    msg.senderId === selectedUser.userId &&
                    !msg.readStatus

            );

            if (hasUnread) {

                sendSeen(

                    selectedUser.userId,
                    currentUserId

                );

            }

            onNewMessage();
            // Refresh chat list

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

    const loadOnlineUsers = async () => {

        try {

            const users = await getOnlineUsers();

            setOnlineUsers(users);

        } catch (e) {

            console.log(e);

        }

    };

    if(currentUserId){

        loadOnlineUsers();

    }

}, [currentUserId]);

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


    useEffect(() => {

        if (!currentUserId) return;

        const subscription = subscribeTyping(

            currentUserId,

            (typingStatus) => {

                // Chat Header
                if (

                    selectedUser &&

                    typingStatus.senderId === selectedUser.userId

                ) {

                    setTyping(typingStatus.typing);

                }

                // Chat List
                setTypingUsers(prev => {

                    if (typingStatus.typing) {

                        if (prev.includes(typingStatus.senderId)) {

                            return prev;

                        }

                        return [

                            ...prev,

                            typingStatus.senderId

                        ];

                    }

                    return prev.filter(

                        id => id !== typingStatus.senderId

                    );

                });

            }

        );

        return () => {

            subscription?.unsubscribe();

        };

    }, [

        currentUserId,

        selectedUser,

        setTypingUsers

    ]);



    useEffect(() => {

        if (!currentUserId) return;

        const subscription = subscribeSeen(

            currentUserId,

            (status) => {

                loadConversation();

                onNewMessage();

            }

        );

        return () => {

            subscription?.unsubscribe();

        };

    }, [currentUserId, loadConversation]);

    // ---------------- LOAD WHEN USER CHANGES ----------------


    // ---------------- AUTO SCROLL ----------------

    useEffect(() => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages]);


    useEffect(() => {

        return () => {

            clearTimeout(typingTimeout.current);

        };

    }, []);

    // ---------------- SEND ----------------

    const handleSend = () => {

        if (!text.trim()) return;

        sendMessage({

            senderId: currentUserId,

            receiverId: selectedUser.userId,

            content: text

        });

        stopTyping(

            currentUserId,

            selectedUser.userId

        );

        clearTimeout(typingTimeout.current);

        setTyping(false);

        setText("");

        setTimeout(() => {

            onNewMessage();

        }, 500);

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

                            typing

                                ? "Typing..."

                                : onlineUsers.includes(selectedUser.userId)

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

                                            <div className="message-footer">

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

                                                {

                                                    mine && (

                                                        <span className="message-status">

                                                            {

                                                                msg.readStatus
                                                                    ? <MdDoneAll className="seen" />
                                                                    : <MdDone className="sent" />

                                                            }

                                                        </span>

                                                    )

                                                }

                                            </div>

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

                    // onChange={(e) =>
                    //     setText(e.target.value)
                    // }

                    onChange={(e) => {

                        const value = e.target.value;

                        setText(value);

                        if (!selectedUser) return;

                        if (value.trim()) {

                            sendTyping(

                                currentUserId,

                                selectedUser.userId

                            );

                        } else {

                            stopTyping(

                                currentUserId,

                                selectedUser.userId

                            );

                        }

                        clearTimeout(typingTimeout.current);

                        typingTimeout.current = setTimeout(() => {

                            stopTyping(

                                currentUserId,

                                selectedUser.userId

                            );

                        }, 1000);

                    }}


                    //up

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