import React, { useEffect, useState } from "react";
import { getChatList } from "../../api/messageApi";

import defaultProfile from "../../assets/Default profile.jpg";
import "./chatList.css";
import noChatImage from "../../assets/noChatImage.webp";

export default function ChatList({

    currentUserId,

    selectedUser,

    onSelect,

    refreshKey,

    onlineUsers = []

}) {

    const [chats, setChats] = useState([]);

    useEffect(() => {
        //test log
        console.log("CHAT LIST RELOAD", refreshKey);
        if (!currentUserId) return;

        loadChats();

    }, [currentUserId, refreshKey]);

    const loadChats = async () => {

        try {

            const data = await getChatList(currentUserId);
            //test log
            console.log("API DATA", data);

            console.log("Chat List :", data);

            if (Array.isArray(data)) {
                // test log
                // setChats(data);
                // setChats(data.map(chat => ({ ...chat })));
                setChats([...data]);

            } else {

                setChats([]);

            }

        }

        catch (err) {

            console.error(err);

            setChats([]);

        }

    };
    //test 
    console.log("Rendering Chats", chats);

    return (

        <div className="chat-list">

            <h2>Chats</h2>

            {
                chats.length === 0 && (

                    <div className="no-chat">

                        <img
                            src={noChatImage}
                            alt="No Chats"
                            className="no-chat-image"
                        />

                        <h3>No Chats Yet</h3>

                        <p>
                            Start a conversation with your friends.
                        </p>

                    </div>

                )
            }

            {

                chats.map((chat) => {

                    const image =

                        chat.profileImage &&
                            chat.profileImage.trim() !== ""

                            ? chat.profileImage

                            : defaultProfile;

                    const isOnline =

                        onlineUsers.includes(chat.userId);

                    return (

                        <div

                            key={chat.userId}

                            className={

                                selectedUser?.userId === chat.userId

                                    ? "chat-item active"

                                    : "chat-item"

                            }

                            onClick={() => onSelect(chat)}

                        >

                            <div className="chat-profile-box">

                                <img

                                    src={image}

                                    alt={chat.fullName}

                                    className="chat-profile-img"

                                    loading="lazy"

                                    onError={(e) => {

                                        e.target.onerror = null;

                                        e.target.src = defaultProfile;

                                    }}

                                />

                                {

                                    isOnline && (

                                        <span className="chat-online-dot"></span>

                                    )

                                }

                            </div>

                            <div className="chat-info">

                                <h4>

                                    {chat.fullName}

                                </h4>

                                <p>

                                    {chat.lastMessage || "No messages"}

                                </p>

                                {/* <p style={{ color: "red", fontWeight: "bold" }}>
                                    {chat.lastMessage}
                                </p> */}

                                <p>{new Date().toLocaleTimeString()}</p>

                            </div>

                            {

                                chat.unreadCount > 0 && (

                                    <span className="badge">

                                        {chat.unreadCount}

                                    </span>

                                )

                            }

                        </div>

                    );

                })

            }

        </div>

    );

}