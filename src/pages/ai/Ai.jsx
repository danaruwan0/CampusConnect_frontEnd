import React, { useState } from "react";
import "./ai.css";
import api from "../../api/axios";


// compornet import
import TypingIndicator from "../../components/ai/TypingIndicator";
import ChatBubble from "../../components/ai/ChatBubble";
import ChatHeader from "../../components/ai/ChatHeader";
import ChatInput from "../../components/ai/ChatInput";

export default function Ai() {

    const [input, setInput] = useState("");
    const [reply, setReply] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {

        if (input.trim() === "") return;

        setLoading(true);
        setReply("");

        try {

            const response = await api.post("/api/ai/chat", {
                message: input
            });

            console.log(response.data);

            // Hugging Face Chat Completion Response
            if (
                response.data &&
                response.data.choices &&
                response.data.choices.length > 0
            ) {
                setReply(response.data.choices[0].message.content);
            } else {
                setReply("No response received.");
            }

        } catch (err) {

            console.error(err);

            if (err.response) {
                console.log(err.response.data);
                setReply("Error : " + JSON.stringify(err.response.data));
            } else {
                setReply("Unable to connect to server.");
            }

        } finally {

            setLoading(false);

        }

    };

    return (

        <div
            style={{
                width: "700px",
                margin: "40px auto",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "10px"
            }}
        >

            <h2>CampusConnect AI Assistant</h2>

            <textarea
                rows={6}
                style={{
                    width: "100%",
                    padding: "10px",
                    fontSize: "16px"
                }}
                placeholder="Ask anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />

            <br /><br />

            <button
                onClick={sendMessage}
                disabled={loading}
                style={{
                    padding: "10px 25px",
                    fontSize: "16px",
                    cursor: "pointer"
                }}
            >
                {loading ? "Generating..." : "Send"}
            </button>

            <hr />

            <h3>AI Reply</h3>

            <div
                style={{
                    whiteSpace: "pre-wrap",
                    background: "#f5f5f5",
                    padding: "15px",
                    borderRadius: "8px",
                    minHeight: "120px"
                }}
            >
                {reply}
            </div>

        </div>

    );
}