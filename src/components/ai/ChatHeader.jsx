import React from "react";
import "../../pages/ai/ai.css";

import aiImage from "../../assets/ai.png";

export default function ChatHeader() {

    return (

        <div className="chat-header">

            <div className="chat-header-left">

                <div className="avatar-wrapper">

                    <img
                        src={aiImage}
                        alt="AI"
                        className="header-avatar"
                    />

                    <span className="online-dot"></span>

                </div>

                <div>

                    <h3>CampusConnect AI</h3>

                    <p>Always online</p>

                </div>

            </div>

        </div>

    );

}