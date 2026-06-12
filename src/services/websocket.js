import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectSocket = (onMessageReceived) => {

    const socket = new SockJS("http://localhost:8081/chat");

    stompClient = new Client({
        webSocketFactory: () => socket,

        reconnectDelay: 5000,

        onConnect: () => {

            console.log("Connected");

            stompClient.subscribe(
                "/topic/messages",
                (message) => {

                    const body = JSON.parse(
                        message.body
                    );

                    onMessageReceived(body);
                }
            );
        }
    });

    stompClient.activate();
};

export const sendMessage = (message) => {

    if (stompClient && stompClient.connected) {

        stompClient.publish({
            destination: "/app/sendMessage",
            body: JSON.stringify(message)
        });

    }
};