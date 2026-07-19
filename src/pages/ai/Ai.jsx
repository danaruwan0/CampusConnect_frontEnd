import React, { useEffect, useRef, useState } from "react";
import "./ai.css";

import Navbar from "../../components/navbar/Navbar";

import api from "../../api/axios";
import { getProfile } from "../../api/profileApi";

import ChatBubble from "../../components/ai/ChatBubble";
import ChatHeader from "../../components/ai/ChatHeader";
import ChatInput from "../../components/ai/ChatInput";
import TypingIndicator from "../../components/ai/TypingIndicator";

import defaultProfile from "../../assets/Default profile.jpg";
import aiAvatar from "../../assets/ai.png";

import { HiSparkles } from "react-icons/hi2";

export default function Ai() {

    const loggedUserId = Number(localStorage.getItem("userId"));

    const [profile, setProfile] = useState(null);

    const [messages, setMessages] = useState([]);

    const [input, setInput] = useState("");

    const [loading, setLoading] = useState(false);

    const bottomRef = useRef(null);

    useEffect(() => {
        loadProfile();
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages, loading]);

    const loadProfile = async () => {

        try {

            const data = await getProfile(loggedUserId);

            setProfile(data);

        } catch (err) {

            console.log(err);

        }

    };

    const sendMessage = async () => {

        if (input.trim() === "") return;

        const userMessage = {

            id: Date.now(),

            sender: "user",

            text: input,

            time: new Date().toLocaleTimeString([], {

                hour: "2-digit",

                minute: "2-digit"

            })

        };

        setMessages(prev => [...prev, userMessage]);

        const question = input;

        setInput("");

        setLoading(true);

        try {

            const response = await api.post("/api/ai/chat", {

                message: question

            });

            let aiReply = "No response.";

            if (

                response.data &&
                response.data.choices &&
                response.data.choices.length > 0

            ) {

                aiReply =
                    response.data.choices[0].message.content;

            }

            const aiMessage = {

                id: Date.now() + 1,

                sender: "ai",

                text: aiReply,

                time: new Date().toLocaleTimeString([], {

                    hour: "2-digit",

                    minute: "2-digit"

                })

            };

            setMessages(prev => [...prev, aiMessage]);

        } catch (err) {

            console.log(err);

            const errorMessage = {

                id: Date.now() + 2,

                sender: "ai",

                text: "Unable to connect to AI server.",

                time: new Date().toLocaleTimeString([], {

                    hour: "2-digit",

                    minute: "2-digit"

                })

            };

            setMessages(prev => [...prev, errorMessage]);

        } finally {

            setLoading(false);

        }

    };

    return (

        <>

            {/* <Navbar /> */}

            <div className="ai-page">

                <ChatHeader />

                <div className="chat-body">

                    {messages.length === 0 && (

                        <div className="welcome-box">

                            <img

                                src={aiAvatar}

                                alt="AI"

                                className="welcome-ai-image"

                            />

                            <h2>

                                CampusConnect AI

                            </h2>

                            <p className="welcome-text">

                                Welcome

                                {profile ? ` ${profile.fullName}` : ""}

                                <HiSparkles className="welcome-icon" />

                            </p>
                            <p>

                                Ask me anything.

                            </p>

                        </div>

                    )}

                    {messages.map((message) => (

                        <ChatBubble

                            key={message.id}

                            message={message}

                            profileImage={

                                profile?.profileImage ||

                                defaultProfile

                            }

                            fullName={

                                profile?.fullName ||

                                "User"

                            }

                            aiImage={aiAvatar}

                        />

                    ))}

                    {loading && <TypingIndicator />}

                    <div ref={bottomRef}></div>

                </div>

                <ChatInput

                    input={input}

                    setInput={setInput}

                    sendMessage={sendMessage}

                    loading={loading}

                />

            </div>

        </>

    );

}