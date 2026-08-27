import React from "react";
import "./loader.css";

import aiAvatar from "../../assets/ai.png";


export default function Loader({ text = "Loading..." }) {

    return (

        <div className="loader-container">

            <div className="loader-card">

                <div className="loader-spinner"></div>

                <p>
                    {text}
                </p>

            </div>

        </div>

    );
}