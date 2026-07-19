import React from "react";

export default function ChatBubble({

    message,

    profileImage,

    fullName,

    aiImage

}) {

    const isUser = message.sender === "user";

    return (

        <div
            className={`chat-message ${
                isUser ? "user-message" : "ai-message"
            }`}
        >

            {/* AI Avatar */}

            {
                !isUser && (

                    <img
                        src={aiImage}
                        alt="AI"
                        className="chat-avatar"
                    />

                )
            }

            <div className="chat-content">

                <div className="chat-name">

                    {
                        isUser
                            ? fullName
                            : "CampusConnect AI"
                    }

                </div>

                <div
                    className={`chat-bubble ${
                        isUser
                            ? "user-bubble"
                            : "ai-bubble"
                    }`}
                >

                    {message.text}

                </div>

                <div className="chat-time">

                    {message.time}

                </div>

            </div>

            {/* User Avatar */}

            {
                isUser && (

                    <img
                        src={profileImage}
                        alt="User"
                        className="chat-avatar"
                    />

                )
            }

        </div>

    );

}