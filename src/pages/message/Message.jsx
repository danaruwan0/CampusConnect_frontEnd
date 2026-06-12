import React, {
    useEffect,
    useState
} from "react";

import "./message.css";

import {
    connectSocket,
    sendMessage
} from "../../services/websocket";

export default function Message() {

    const [messages, setMessages] =
        useState([]);

    const [text, setText] =
        useState("");

    useEffect(() => {

        connectSocket((message) => {

            setMessages((prev) => [
                ...prev,
                message
            ]);

        });

    }, []);

    const handleSend = () => {

        if (!text.trim()) return;

        const msg = {

            senderId: 1,
            receiverId: 2,
            senderName: "Kasun",
            content: text

        };

        sendMessage(msg);

        setText("");
    };

    return (

        <div className="message">

            <h1>Messages</h1>

            <div className="chat-box">

                {messages.map((msg, index) => (

                    <div
                        key={index}
                        className="message-item"
                    >

                        <strong>
                            {msg.senderName}
                        </strong>

                        <p>
                            {msg.content}
                        </p>

                    </div>

                ))}

            </div>

            <div className="input-box">

                <input
                    type="text"
                    value={text}
                    onChange={(e) =>
                        setText(e.target.value)
                    }
                    placeholder="Type message..."
                />

                <button
                    onClick={handleSend}
                >
                    Send
                </button>

            </div>

        </div>
    );
}