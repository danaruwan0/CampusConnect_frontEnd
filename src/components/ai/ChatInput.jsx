import React from "react";
import { IoSend } from "react-icons/io5";
import "../../pages/ai/ai.css";

export default function ChatInput({

    input,
    setInput,
    sendMessage,
    loading

}) {

    const handleKeyDown = (e) => {

        if (e.key === "Enter" && !e.shiftKey) {

            e.preventDefault();

            sendMessage();

        }

    };

    return (

        <div className="chat-input-container">

            <textarea

                className="chat-input"

                placeholder="Ask CampusConnect AI..."

                value={input}

                onChange={(e) =>

                    setInput(e.target.value)

                }

                onKeyDown={handleKeyDown}

                rows={1}

            />

            <button

                className="send-btn"

                onClick={sendMessage}

                disabled={loading}

            >

                <IoSend size={20} />

            </button>

        </div>

    );

}