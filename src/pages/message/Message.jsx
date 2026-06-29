import { useState } from "react";

import ChatList from "../../components/chatList/ChatList";
import ChatWindow from "../../components/chatWindow/ChatWindow";

import "./message.css";

export default function Message() {

    const userId =
        Number(localStorage.getItem("userId"));

    const [selectedUser, setSelectedUser] =
        useState(null);

    const [refreshKey, setRefreshKey] =
        useState(0);

    const refreshChats = () => {

        setRefreshKey(prev => prev + 1);
        //log
        console.log("REFRESH CHATS");

    };

    const [onlineUsers, setOnlineUsers] = useState([]);

    return (

        <div className="message-page">

            <ChatList

                currentUserId={userId}

                selectedUser={selectedUser}

                onSelect={setSelectedUser}

                refreshKey={refreshKey}

                onlineUsers={onlineUsers}

                

            />

            <ChatWindow

                currentUserId={userId}

                selectedUser={selectedUser}

                onNewMessage={refreshChats}

                onlineUsers={onlineUsers}

                setOnlineUsers={setOnlineUsers}

            />

        </div>

    );

}