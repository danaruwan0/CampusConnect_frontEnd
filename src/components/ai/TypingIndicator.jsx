import React from "react";

import aiImage from "../../assets/ai.png";
import "../../pages/ai/ai.css";

export default function TypingIndicator() {

    return (

        <div className="chat-message ai-message">

            <img
                src={aiImage}
                alt="AI"
                className="chat-avatar"
            />

            <div className="chat-content">

                <div className="chat-name">
                    CampusConnect AI
                </div>

                <div className="typing-bubble">

                    <span></span>
                    <span></span>
                    <span></span>

                </div>

            </div>

        </div>

    );

}