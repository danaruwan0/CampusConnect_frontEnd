import React from "react";
import "../../pages/ai/ai.css";

import aiImage from "../../assets/ai.png";

export default function ChatHeader() {

    return (

        <div className="chat-header1">

            <div className="chat-header-left1">

                <div className="avatar-wrapper1">

                    <img
                        src={aiImage}
                        alt="AI"
                        className="header-avatar1"
                    />

                    <span className="online-dot1"></span>

                </div>

                <div>

                    <h3>CampusConnect AI</h3>

                    <p>Always online</p>

                </div>

            </div>

        </div>

    );

}