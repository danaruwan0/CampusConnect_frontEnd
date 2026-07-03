import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export let stompClient = null;

export const connectSocket = (
    onMessageReceived,
    onOnlineStatus,
    onTypingReceived,
    onSeenReceived,
    userId
) => {

    const socket = new SockJS(
        "http://localhost:8081/chat"
    );

    stompClient = new Client({

        webSocketFactory: () => socket,

        reconnectDelay: 5000,

        onConnect: () => {

            console.log("WebSocket Connected");

            // ==========================
            // Messages
            // ==========================
            stompClient.subscribe(

                `/topic/messages/${userId}`,

                (message) => {

                    onMessageReceived(
                        JSON.parse(message.body)
                    );

                }

            );

            // ==========================
            // Online Status
            // ==========================
            stompClient.subscribe(

                "/topic/online",

                (message) => {

                    onOnlineStatus(
                        JSON.parse(message.body)
                    );

                }

            );

            // ==========================
            // Typing
            // ==========================
            stompClient.subscribe(

                `/topic/typing/${userId}`,

                (message) => {

                    onTypingReceived(
                        JSON.parse(message.body)
                    );

                }

            );

            // ==========================
            // Seen
            // ==========================
            stompClient.subscribe(

                `/topic/seen/${userId}`,

                (message) => {

                    onSeenReceived(
                        JSON.parse(message.body)
                    );

                }

            );

            // ==========================
            // Notify Online
            // ==========================
            setTimeout(() => {

                stompClient.publish({

                    destination: "/app/online",

                    body: JSON.stringify({
                        userId
                    })

                });

            }, 100);

        },

        onDisconnect: () => {

            console.log("WebSocket Disconnected");

        },

        onStompError: (frame) => {

            console.log("Broker Error");
            console.log(frame.headers["message"]);
            console.log(frame.body);

        }

    });

    stompClient.activate();

};

// =========================================
// Send Message
// =========================================

export const sendMessage = (message) => {

    if (!stompClient?.connected) return;

    stompClient.publish({

        destination: "/app/sendMessage",

        body: JSON.stringify(message)

    });

};

// =========================================
// Disconnect
// =========================================

export const disconnectSocket = (userId) => {

    if (!stompClient?.connected) return;

    stompClient.publish({

        destination: "/app/offline",

        body: JSON.stringify({
            userId
        })

    });

    stompClient.deactivate();

};