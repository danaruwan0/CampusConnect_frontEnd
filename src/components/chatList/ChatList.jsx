import React, { useEffect, useState } from "react";
import { getChatList } from "../../api/messageApi";
import { searchUsers } from "../../api/searchApi";

import defaultProfile from "../../assets/Default profile.jpg";
import noChatImage from "../../assets/noChatImage.webp";

import "./chatList.css";
import { FiSearch } from "react-icons/fi";
export default function ChatList({
    currentUserId,
    selectedUser,
    onSelect,
    refreshKey,
    onlineUsers = [],
    typingUsers = []
}) {

    /* =========================================================
       STATES
    ========================================================= */

    const [chats, setChats] = useState([]);

    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);


    /* =========================================================
       LOAD CHAT LIST
    ========================================================= */

    useEffect(() => {

        console.log("CHAT LIST RELOAD:", refreshKey);

        if (!currentUserId) return;

        loadChats();

    }, [currentUserId, refreshKey]);


    const loadChats = async () => {

        try {

            const data = await getChatList(currentUserId);

            console.log("CHAT LIST API DATA:", data);

            if (Array.isArray(data)) {

                setChats([...data]);

            } else {

                setChats([]);

            }

        } catch (err) {

            console.error("Chat list error:", err);

            setChats([]);

        }

    };


    /* =========================================================
       SEARCH USERS
    ========================================================= */

    const handleSearch = async (value) => {

        setSearchKeyword(value);

        // Less than 2 characters
        if (value.trim().length < 2) {

            setSearchResults([]);

            return;

        }

        try {

            setSearchLoading(true);

            const results = await searchUsers(
                value.trim(),
                currentUserId
            );

            setSearchResults(
                Array.isArray(results)
                    ? results
                    : []
            );

        } catch (err) {

            console.error(
                "User search error:",
                err
            );

            setSearchResults([]);

        } finally {

            setSearchLoading(false);

        }

    };


    /* =========================================================
       SELECT SEARCH RESULT
    ========================================================= */

    const handleSelectSearchUser = (user) => {

        // Open chat window
        onSelect(user);

        // Clear search
        setSearchKeyword("");

        setSearchResults([]);

    };


    /* =========================================================
       PROFILE IMAGE
    ========================================================= */

    const getProfileImage = (image) => {

        if (
            image &&
            typeof image === "string" &&
            image.trim() !== ""
        ) {

            return image;

        }

        return defaultProfile;

    };


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <div className="chat-list">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="chat-list-header">

                <h2>
                    Chats
                </h2>

                {/* SEARCH */}

                <div className="chat-search-wrapper">

                    <span className="chat-search-icon">
                        <FiSearch />
                    </span>

                    <input
                        type="text"
                        className="chat-search-input"
                        placeholder="Find Contact..."
                        value={searchKeyword}
                        onChange={(e) =>
                            handleSearch(e.target.value)
                        }
                    />

                    {searchKeyword && (
                        <button
                            className="chat-search-clear"
                            onClick={() => {
                                setSearchKeyword("");
                                setSearchResults([]);
                            }}
                            type="button"
                            aria-label="Clear search"
                        >
                            ×
                        </button>
                    )}

                </div>
            </div>


            {/* =================================================
                SEARCH LOADING
            ================================================= */}

            {searchLoading && (

                <div className="chat-search-loading">

                    <span className="search-spinner"></span>

                    <span>
                        Searching...
                    </span>

                </div>

            )}


            {/* =================================================
                SEARCH RESULTS
            ================================================= */}

            {!searchLoading &&
                searchKeyword.trim().length >= 2 &&
                searchResults.length > 0 && (

                    <div className="chat-search-results">

                        <div className="search-result-title">
                            Contacts
                        </div>

                        {searchResults.map((user) => {

                            const image =
                                getProfileImage(
                                    user.profileImage
                                );

                            const isOnline =
                                onlineUsers.includes(
                                    user.userId
                                );

                            return (

                                <div
                                    key={user.userId}
                                    className="chat-search-user"
                                    onClick={() =>
                                        handleSelectSearchUser(
                                            user
                                        )
                                    }
                                >

                                    {/* PROFILE */}

                                    <div className="chat-profile-box">

                                        <img
                                            src={image}
                                            alt={user.fullName}
                                            className="chat-profile-img"
                                            loading="lazy"
                                            onError={(e) => {

                                                e.target.onerror =
                                                    null;

                                                e.target.src =
                                                    defaultProfile;

                                            }}
                                        />

                                        {isOnline && (

                                            <span className="chat-online-dot"></span>

                                        )}

                                    </div>


                                    {/* USER INFO */}

                                    <div className="chat-info">

                                        <h4>
                                            {user.fullName}
                                        </h4>

                                        <p>
                                            {user.email}
                                        </p>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                )}


            {/* =================================================
                NO SEARCH RESULTS
            ================================================= */}

            {!searchLoading &&
                searchKeyword.trim().length >= 2 &&
                searchResults.length === 0 && (

                    <div className="chat-no-search-result">

                        <div className="no-search-icon">

                            <FiSearch />

                        </div>

                        <p>
                            No contacts found
                        </p>

                    </div>

                )}


            {/* =================================================
                EXISTING CHAT LIST
            ================================================= */}

            {searchKeyword.trim().length < 2 && (

                <>

                    {chats.length === 0 ? (

                        /* =====================================
                           NO CHATS
                        ===================================== */

                        <div className="no-chat">

                            <img
                                src={noChatImage}
                                alt="No Chats"
                                className="no-chat-image"
                            />

                            <h3>
                                No Chats Yet
                            </h3>

                            <p>
                                Search for a contact above
                                <br />
                                to start a conversation.
                            </p>

                        </div>

                    ) : (

                        /* =====================================
                           CHATS
                        ===================================== */

                        <div className="chat-items">

                            {chats.map((chat) => {

                                const image =
                                    getProfileImage(
                                        chat.profileImage
                                    );

                                const isOnline =
                                    onlineUsers.includes(
                                        chat.userId
                                    );

                                const isTyping =
                                    typingUsers.includes(
                                        chat.userId
                                    );

                                const isActive =
                                    selectedUser?.userId ===
                                    chat.userId;


                                return (

                                    <div
                                        key={chat.userId}
                                        className={
                                            isActive
                                                ? "chat-item active"
                                                : "chat-item"
                                        }
                                        onClick={() =>
                                            onSelect(chat)
                                        }
                                    >

                                        {/* PROFILE */}

                                        <div className="chat-profile-box">

                                            <img
                                                src={image}
                                                alt={chat.fullName}
                                                className="chat-profile-img"
                                                loading="lazy"
                                                onError={(e) => {

                                                    e.target.onerror =
                                                        null;

                                                    e.target.src =
                                                        defaultProfile;

                                                }}
                                            />

                                            {isOnline && (

                                                <span className="chat-online-dot"></span>

                                            )}

                                        </div>


                                        {/* CHAT INFO */}

                                        <div className="chat-info">

                                            <h4>
                                                {chat.fullName}
                                            </h4>

                                            <p
                                                className={
                                                    isTyping
                                                        ? "chat-typing"
                                                        : ""
                                                }
                                            >

                                                {isTyping
                                                    ? "Typing..."
                                                    : chat.lastMessage ||
                                                    "No messages"}

                                            </p>

                                            {!isTyping && (

                                                <span className="chat-time">

                                                    {chat.lastMessageTime
                                                        ? new Date(
                                                            chat.lastMessageTime
                                                        ).toLocaleTimeString(
                                                            [],
                                                            {
                                                                hour:
                                                                    "2-digit",
                                                                minute:
                                                                    "2-digit"
                                                            }
                                                        )
                                                        : ""}

                                                </span>

                                            )}

                                        </div>


                                        {/* UNREAD */}

                                        {chat.unreadCount > 0 && (

                                            <span className="badge">

                                                {chat.unreadCount > 99
                                                    ? "99+"
                                                    : chat.unreadCount}

                                            </span>

                                        )}

                                    </div>

                                );

                            })}

                        </div>

                    )}

                </>

            )}

        </div>

    );

}