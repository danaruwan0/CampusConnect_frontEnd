import React, {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";


import {
    getConversation,
    markConversationAsRead,
    deleteForMe,
    deleteForEveryone
} from "../../api/messageApi";


import defaultProfile from "../../assets/Default profile.jpg";
import emptyChat from "../../assets/empty-chat.png";


import "./chatWindow.css";


import {
    getProfile
} from "../../api/profileApi";


import {
    connectSocket,
    sendMessage,
    disconnectSocket
} from "../../services/websocket";


import {
    sendTyping,
    stopTyping,
    subscribeTyping
} from "../../services/typingSocket";


import {
    MdDone,
    MdDoneAll,
    MdDelete,
    MdArrowBack
} from "react-icons/md";


import {
    IoSend
} from "react-icons/io5";


import {
    sendSeen,
    subscribeSeen
} from "../../services/seenSocket";


import {
    getOnlineUsers
} from "../../api/statusApi";



export default function ChatWindow({

    currentUserId,
    selectedUser,
    onNewMessage,

    onlineUsers,
    setOnlineUsers,
    setTypingUsers,

    mobileChatOpen,
    setMobileChatOpen

}) {


    // =========================================================
    // STATES
    // =========================================================

    const [typing, setTyping] =
        useState(false);

    const [messages, setMessages] =
        useState([]);

    const [text, setText] =
        useState("");

    const [myProfile, setMyProfile] =
        useState(null);

    const [menuMessage, setMenuMessage] =
        useState(null);

    const [menuPosition, setMenuPosition] =
        useState({
            x: 0,
            y: 0
        });


    // =========================================================
    // REFS
    // =========================================================

    const typingTimeout =
        useRef(null);

    const bottomRef =
        useRef(null);


    /*
     * IMPORTANT
     *
     * WebSocket callbacks can keep an old selectedUser value.
     *
     * This ref always contains the latest selected chat.
     */

    const selectedUserRef =
        useRef(null);


    /*
     * Same idea for loadConversation.
     */

    const loadConversationRef =
        useRef(null);



    // =========================================================
    // KEEP SELECTED USER REF UPDATED
    // =========================================================

    useEffect(() => {

        selectedUserRef.current =
            selectedUser;

    }, [selectedUser]);



    // =========================================================
    // CLOSE CONTEXT MENU
    // =========================================================

    useEffect(() => {

        const closeMenu = () => {

            setMenuMessage(null);

        };


        window.addEventListener(
            "click",
            closeMenu
        );


        return () => {

            window.removeEventListener(
                "click",
                closeMenu
            );

        };

    }, []);



    // =========================================================
    // LOAD MY PROFILE
    // =========================================================

    useEffect(() => {

        const loadMyProfile =
            async () => {

                try {

                    const data =
                        await getProfile(
                            currentUserId
                        );

                    setMyProfile(
                        data
                    );

                } catch (err) {

                    console.error(
                        "My profile error:",
                        err
                    );

                }

            };


        if (currentUserId) {

            loadMyProfile();

        }

    }, [currentUserId]);



    // =========================================================
    // LOAD CONVERSATION
    // =========================================================

    const loadConversation =
        useCallback(
            async () => {

                if (
                    !currentUserId ||
                    !selectedUser
                ) {

                    return;

                }


                try {

                    console.log(
                        "LOADING CONVERSATION:",
                        currentUserId,
                        selectedUser.userId
                    );


                    const data =
                        await getConversation(

                            currentUserId,

                            selectedUser.userId

                        );


                    // -------------------------------------------------
                    // UPDATE CHAT WINDOW
                    // -------------------------------------------------

                    setMessages(
                        Array.isArray(data)
                            ? data
                            : []
                    );


                    // -------------------------------------------------
                    // MARK INCOMING MESSAGES AS READ
                    // -------------------------------------------------

                    await markConversationAsRead(

                        currentUserId,

                        selectedUser.userId

                    );


                    // -------------------------------------------------
                    // CHECK UNREAD MESSAGES
                    // -------------------------------------------------

                    const hasUnread =
                        Array.isArray(data) &&
                        data.some(

                            msg =>

                                Number(
                                    msg.senderId
                                ) ===
                                Number(
                                    selectedUser.userId
                                ) &&

                                !msg.readStatus

                        );


                    // -------------------------------------------------
                    // SEND SEEN EVENT
                    // -------------------------------------------------

                    if (hasUnread) {

                        console.log(
                            "SENDING SEEN EVENT"
                        );

                        sendSeen(

                            selectedUser.userId,

                            currentUserId

                        );

                    }


                    // -------------------------------------------------
                    // REFRESH CHAT LIST
                    // -------------------------------------------------

                    if (
                        typeof onNewMessage ===
                        "function"
                    ) {

                        onNewMessage();

                    }

                } catch (err) {

                    console.error(
                        "Load conversation error:",
                        err
                    );

                }

            },

            [
                currentUserId,
                selectedUser,
                onNewMessage
            ]

        );



    // =========================================================
    // KEEP LATEST LOAD CONVERSATION IN REF
    // =========================================================

    useEffect(() => {

        loadConversationRef.current =
            loadConversation;

    }, [loadConversation]);



    // =========================================================
    // LOAD CONVERSATION WHEN CHAT CHANGES
    // =========================================================

    useEffect(() => {

        if (!selectedUser) {

            setMessages([]);

            return;

        }


        console.log(
            "SELECTED CHAT CHANGED:",
            selectedUser
        );


        loadConversation();

    }, [
        selectedUser,
        loadConversation
    ]);



    // =========================================================
    // LOAD ONLINE USERS
    // =========================================================

    useEffect(() => {

        const loadOnlineUsers =
            async () => {

                try {

                    const users =
                        await getOnlineUsers();


                    if (
                        Array.isArray(users)
                    ) {

                        setOnlineUsers(
                            users
                        );

                    } else {

                        setOnlineUsers(
                            []
                        );

                    }

                } catch (err) {

                    console.error(
                        "Online users error:",
                        err
                    );

                }

            };


        if (currentUserId) {

            loadOnlineUsers();

        }

    }, [
        currentUserId,
        setOnlineUsers
    ]);



    // =========================================================
    // MAIN WEBSOCKET
    // =========================================================

    useEffect(() => {

        if (!currentUserId) {

            return;

        }


        console.log(
            "CONNECTING MAIN WEBSOCKET:",
            currentUserId
        );


        connectSocket(


            // =================================================
            // MESSAGE EVENT
            // =================================================

            (message) => {

                console.log(
                    "WEBSOCKET MESSAGE RECEIVED:",
                    message
                );


                /*
                 * Get latest selected chat from ref.
                 *
                 * DO NOT use selectedUser directly here.
                 */

                const currentChat =
                    selectedUserRef.current;


                if (!currentChat) {

                    console.log(
                        "NO CURRENT CHAT"
                    );


                    /*
                     * No chat is open.
                     * Refresh list so latest message
                     * appears there.
                     */

                    if (
                        typeof onNewMessage ===
                        "function"
                    ) {

                        onNewMessage();

                    }

                    return;

                }


                // =================================================
                // CHECK WHETHER MESSAGE BELONGS TO CURRENT CHAT
                // =================================================

                const senderId =
                    Number(
                        message.senderId
                    );

                const receiverId =
                    Number(
                        message.receiverId
                    );

                const currentChatId =
                    Number(
                        currentChat.userId
                    );


                const isCurrentChat =

                    senderId ===
                    currentChatId

                    ||

                    receiverId ===
                    currentChatId;



                // =================================================
                // CURRENT CHAT
                // =================================================

                if (isCurrentChat) {

                    console.log(
                        "CURRENT CHAT MESSAGE"
                    );


                    /*
                     * Reload conversation from backend.
                     *
                     * This updates:
                     * - Chat Window
                     * - Chat List
                     * - Read status
                     */

                    if (
                        loadConversationRef
                            .current
                    ) {

                        loadConversationRef
                            .current();

                    }

                    return;

                }



                // =================================================
                // OTHER CHAT
                // =================================================

                console.log(
                    "OTHER CHAT MESSAGE"
                );


                /*
                 * Current chat is different.
                 *
                 * Only refresh Chat List.
                 */

                if (
                    typeof onNewMessage ===
                    "function"
                ) {

                    onNewMessage();

                }

            },


            // =================================================
            // ONLINE STATUS
            // =================================================

            (status) => {

                console.log(
                    "ONLINE STATUS:",
                    status
                );


                setOnlineUsers(
                    prev => {

                        if (
                            status.online
                        ) {

                            if (
                                prev.includes(
                                    status.userId
                                )
                            ) {

                                return prev;

                            }


                            return [

                                ...prev,

                                status.userId

                            ];

                        }


                        return prev.filter(

                            id =>
                                id !==
                                status.userId

                        );

                    }
                );

            },


            // =================================================
            // TYPING
            // =================================================

            (typingStatus) => {

                console.log(
                    "TYPING STATUS:",
                    typingStatus
                );


                const currentChat =
                    selectedUserRef.current;


                // -------------------------------------------------
                // CHAT HEADER
                // -------------------------------------------------

                if (

                    currentChat &&

                    Number(
                        typingStatus.senderId
                    ) ===

                    Number(
                        currentChat.userId
                    )

                ) {

                    setTyping(
                        typingStatus.typing
                    );

                }


                // -------------------------------------------------
                // CHAT LIST
                // -------------------------------------------------

                setTypingUsers(
                    prev => {

                        if (
                            typingStatus.typing
                        ) {

                            if (
                                prev.includes(
                                    typingStatus.senderId
                                )
                            ) {

                                return prev;

                            }


                            return [

                                ...prev,

                                typingStatus.senderId

                            ];

                        }


                        return prev.filter(

                            id =>

                                id !==
                                typingStatus.senderId

                        );

                    }
                );

            },


            // =================================================
            // SEEN
            // =================================================

            () => {

                console.log(
                    "MESSAGE SEEN EVENT"
                );


                if (
                    loadConversationRef
                        .current
                ) {

                    loadConversationRef
                        .current();

                }

            },


            currentUserId

        );


        // =====================================================
        // CLEANUP
        // =====================================================

        return () => {

            console.log(
                "DISCONNECT MAIN WEBSOCKET:",
                currentUserId
            );


            disconnectSocket(
                currentUserId
            );

        };

    }, [
        currentUserId
    ]);



    // =========================================================
    // TYPING SOCKET SUBSCRIPTION
    // =========================================================

    useEffect(() => {

        if (!currentUserId) {

            return;

        }


        const subscription =
            subscribeTyping(

                currentUserId,

                (typingStatus) => {

                    console.log(
                        "TYPING SOCKET:",
                        typingStatus
                    );


                    const currentChat =
                        selectedUserRef.current;


                    // -------------------------------------------------
                    // CHAT HEADER
                    // -------------------------------------------------

                    if (

                        currentChat &&

                        Number(
                            typingStatus.senderId
                        ) ===

                        Number(
                            currentChat.userId
                        )

                    ) {

                        setTyping(
                            typingStatus.typing
                        );

                    }


                    // -------------------------------------------------
                    // CHAT LIST
                    // -------------------------------------------------

                    setTypingUsers(
                        prev => {

                            if (
                                typingStatus.typing
                            ) {

                                if (
                                    prev.includes(
                                        typingStatus.senderId
                                    )
                                ) {

                                    return prev;

                                }


                                return [

                                    ...prev,

                                    typingStatus.senderId

                                ];

                            }


                            return prev.filter(

                                id =>

                                    id !==
                                    typingStatus.senderId

                            );

                        }
                    );

                }

            );


        return () => {

            subscription?.unsubscribe();

        };

    }, [
        currentUserId,
        setTypingUsers
    ]);



    // =========================================================
    // SEEN SOCKET SUBSCRIPTION
    // =========================================================

    useEffect(() => {

        if (!currentUserId) {

            return;

        }


        const subscription =
            subscribeSeen(

                currentUserId,

                () => {

                    console.log(
                        "SEEN SOCKET EVENT"
                    );


                    if (
                        loadConversationRef
                            .current
                    ) {

                        loadConversationRef
                            .current();

                    }

                }

            );


        return () => {

            subscription?.unsubscribe();

        };

    }, [
        currentUserId
    ]);



    // =========================================================
    // AUTO SCROLL
    // =========================================================

    useEffect(() => {

        if (
            bottomRef.current
        ) {

            bottomRef.current.scrollIntoView({

                behavior: "smooth"

            });

        }

    }, [messages]);



    // =========================================================
    // CLEAR TYPING TIMER
    // =========================================================

    useEffect(() => {

        return () => {

            clearTimeout(
                typingTimeout.current
            );

        };

    }, []);



    // =========================================================
    // SEND MESSAGE
    // =========================================================

    const handleSend = () => {

        const messageText =
            text.trim();


        // -----------------------------------------------------
        // VALIDATION
        // -----------------------------------------------------

        if (
            !messageText ||
            !selectedUser
        ) {

            return;

        }


        console.log(
            "SENDING MESSAGE:",
            messageText
        );


        // -----------------------------------------------------
        // SEND TO BACKEND
        // -----------------------------------------------------

        sendMessage({

            senderId:
                currentUserId,

            receiverId:
                selectedUser.userId,

            content:
                messageText

        });


        // -----------------------------------------------------
        // STOP TYPING
        // -----------------------------------------------------

        stopTyping(

            currentUserId,

            selectedUser.userId

        );


        clearTimeout(
            typingTimeout.current
        );


        setTyping(false);


        // -----------------------------------------------------
        // CLEAR INPUT
        // -----------------------------------------------------

        setText("");

    };



    // =========================================================
    // HANDLE TYPING
    // =========================================================

    const handleTextChange = (
        e
    ) => {

        const value =
            e.target.value;


        setText(value);


        if (!selectedUser) {

            return;

        }


        // -----------------------------------------------------
        // SEND TYPING
        // -----------------------------------------------------

        if (
            value.trim()
        ) {

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


        // -----------------------------------------------------
        // RESET TIMER
        // -----------------------------------------------------

        clearTimeout(
            typingTimeout.current
        );


        typingTimeout.current =
            setTimeout(() => {

                stopTyping(

                    currentUserId,

                    selectedUser.userId

                );

            }, 1000);

    };



    // =========================================================
    // DELETE FOR ME
    // =========================================================

    const handleDeleteForMe =
        async () => {

            if (!menuMessage) {

                return;

            }


            try {

                console.log(
                    "DELETE FOR ME:",
                    menuMessage.id
                );


                await deleteForMe(

                    menuMessage.id,

                    currentUserId

                );


                setMenuMessage(
                    null
                );


                await loadConversation();


            } catch (err) {

                console.error(
                    "Delete for me error:",
                    err
                );

            }

        };



    // =========================================================
    // DELETE FOR EVERYONE
    // =========================================================

    const handleDeleteForEveryone =
        async () => {

            if (!menuMessage) {

                return;

            }


            try {

                console.log(
                    "DELETE FOR EVERYONE:",
                    menuMessage.id
                );


                await deleteForEveryone(

                    menuMessage.id,

                    currentUserId

                );


                setMenuMessage(
                    null
                );


                await loadConversation();


            } catch (err) {

                console.error(
                    "Delete for everyone error:",
                    err
                );

            }

        };



    // =========================================================
    // EMPTY CHAT
    // =========================================================

    if (!selectedUser) {

        return (

            <div className="chat-window empty">

                <img
                    src={emptyChat}
                    alt="Select Chat"
                    className="empty-chat-image"
                />


                <h2>
                    Select a chat
                </h2>


                <p>
                    Choose a conversation
                    from the left or start
                    a new chat.
                </p>

            </div>

        );

    }



    // =========================================================
    // UI
    // =========================================================

    return (

        <div className="chat-window">


            {/* =================================================
                CHAT HEADER
            ================================================= */}

            <div className="chat-header">


                {/* MOBILE BACK BUTTON */}

                <button
                    className="mobile-back-btn"
                    onClick={() =>
                        setMobileChatOpen(
                            false
                        )
                    }
                    aria-label="Back"
                    type="button"
                >

                    <MdArrowBack />

                </button>



                {/* =================================================
                    HEADER AVATAR
                ================================================= */}

                <div className="header-avatar">

                    <img
                        src={
                            selectedUser.profileImage ||
                            defaultProfile
                        }
                        alt=""
                        onError={(e) => {

                            e.target.onerror =
                                null;

                            e.target.src =
                                defaultProfile;

                        }}
                    />


                    {

                        onlineUsers.includes(
                            selectedUser.userId
                        ) && (

                            <span
                                className="online-dot"
                            ></span>

                        )

                    }

                </div>



                {/* =================================================
                    HEADER USER INFO
                ================================================= */}

                <div>

                    <h3>
                        {
                            selectedUser.fullName
                        }
                    </h3>


                    <small>

                        {

                            typing

                                ? "Typing..."

                                : onlineUsers.includes(
                                    selectedUser.userId
                                )

                                    ? "Online"

                                    : "Offline"

                        }

                    </small>

                </div>

            </div>



            {/* =================================================
                MESSAGES
            ================================================= */}

            <div className="messages">


                {

                    messages.map(
                        (
                            msg,
                            index
                        ) => {

                            const mine =

                                Number(
                                    msg.senderId
                                ) ===

                                Number(
                                    currentUserId
                                );


                            return (

                                <div
                                    key={
                                        msg.id ??
                                        `${msg.senderId}-${msg.sentAt}-${index}`
                                    }
                                    className={
                                        mine
                                            ? "message-row mine-row"
                                            : "message-row other-row"
                                    }
                                >


                                    {/* =================================
                                        OTHER USER AVATAR
                                    ================================= */}

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
                                                onError={(
                                                    e
                                                ) => {

                                                    e.target.onerror =
                                                        null;

                                                    e.target.src =
                                                        defaultProfile;

                                                }}
                                            />

                                        )

                                    }



                                    {/* =================================
                                        MESSAGE BUBBLE
                                    ================================= */}

                                    <div

                                        className={
                                            mine
                                                ? "mine"
                                                : "other"
                                        }


                                        onContextMenu={(
                                            e
                                        ) => {

                                            e.preventDefault();


                                            const menuWidth =
                                                220;

                                            const menuHeight =
                                                110;

                                            const padding =
                                                16;


                                            let x =
                                                e.clientX;

                                            let y =
                                                e.clientY;


                                            // -------------------------
                                            // RIGHT EDGE
                                            // -------------------------

                                            if (
                                                x +
                                                menuWidth >
                                                window.innerWidth
                                            ) {

                                                x =
                                                    window.innerWidth -
                                                    menuWidth -
                                                    padding;

                                            }


                                            // -------------------------
                                            // BOTTOM EDGE
                                            // -------------------------

                                            if (
                                                y +
                                                menuHeight >
                                                window.innerHeight
                                            ) {

                                                y =
                                                    window.innerHeight -
                                                    menuHeight -
                                                    padding;

                                            }


                                            // -------------------------
                                            // LEFT EDGE
                                            // -------------------------

                                            if (
                                                x <
                                                padding
                                            ) {

                                                x =
                                                    padding;

                                            }


                                            // -------------------------
                                            // TOP EDGE
                                            // -------------------------

                                            if (
                                                y <
                                                padding
                                            ) {

                                                y =
                                                    padding;

                                            }


                                            setMenuMessage(
                                                msg
                                            );


                                            setMenuPosition({

                                                x,

                                                y

                                            });

                                        }}

                                    >


                                        {/* MESSAGE TEXT */}

                                        <div>

                                            {
                                                msg.content
                                            }

                                        </div>



                                        {/* =================================
                                            MESSAGE FOOTER
                                        ================================= */}

                                        {

                                            msg.sentAt && (

                                                <div
                                                    className="message-footer"
                                                >

                                                    <small>

                                                        {

                                                            new Date(
                                                                msg.sentAt
                                                            ).toLocaleTimeString(
                                                                [],
                                                                {
                                                                    hour:
                                                                        "2-digit",
                                                                    minute:
                                                                        "2-digit"
                                                                }
                                                            )

                                                        }

                                                    </small>



                                                    {

                                                        mine && (

                                                            <span
                                                                className="message-status"
                                                            >

                                                                {

                                                                    msg.readStatus

                                                                        ?

                                                                        (
                                                                            <MdDoneAll
                                                                                className="seen"
                                                                            />
                                                                        )

                                                                        :

                                                                        (
                                                                            <MdDone
                                                                                className="sent"
                                                                            />
                                                                        )

                                                                }

                                                            </span>

                                                        )

                                                    }

                                                </div>

                                            )

                                        }

                                    </div>



                                    {/* =================================
                                        MY AVATAR
                                    ================================= */}

                                    {

                                        mine && (

                                            <img

                                                className="message-avatar"

                                                src={
                                                    myProfile?.profileImage ||
                                                    defaultProfile
                                                }

                                                alt=""

                                                onError={(
                                                    e
                                                ) => {

                                                    e.target.onerror =
                                                        null;

                                                    e.target.src =
                                                        defaultProfile;

                                                }}

                                            />

                                        )

                                    }

                                </div>

                            );

                        }

                    )

                }


                {/* AUTO SCROLL TARGET */}

                <div
                    ref={bottomRef}
                ></div>

            </div>



            {/* =================================================
                SEND BOX
            ================================================= */}

            <div className="send-box">


                {/* INPUT */}

                <input

                    type="text"

                    value={text}

                    placeholder="Type message..."

                    onChange={
                        handleTextChange
                    }

                    onKeyDown={(
                        e
                    ) => {

                        if (
                            e.key ===
                            "Enter"
                        ) {

                            e.preventDefault();

                            handleSend();

                        }

                    }}

                />



                {/* SEND BUTTON */}

                <button

                    type="button"

                    onClick={
                        handleSend
                    }

                    className="send-btn"

                    aria-label="Send message"

                >

                    <IoSend
                        size={22}
                    />

                </button>

            </div>



            {/* =================================================
                CONTEXT MENU
            ================================================= */}

            {

                menuMessage && (

                    <div

                        className="message-menu"

                        style={{

                            left:
                                menuPosition.x,

                            top:
                                menuPosition.y

                        }}

                        onClick={(e) =>
                            e.stopPropagation()
                        }

                    >


                        {/* DELETE FOR ME */}

                        <div

                            className="menu-item"

                            onClick={
                                handleDeleteForMe
                            }

                        >

                            <MdDelete />

                            Delete for me

                        </div>



                        {/* DELETE FOR EVERYONE */}

                        {

                            Number(
                                menuMessage.senderId
                            ) ===

                            Number(
                                currentUserId
                            ) && (

                                <div

                                    className="menu-item"

                                    onClick={
                                        handleDeleteForEveryone
                                    }

                                >

                                    <MdDelete />

                                    Delete for everyone

                                </div>

                            )

                        }

                    </div>

                )

            }

        </div>

    );

}