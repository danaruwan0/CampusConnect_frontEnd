import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

// let stompClient = null;
export let stompClient = null;

export const connectSocket = (
    onMessageReceived,
    onOnlineStatus,
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

            // messages
            stompClient.subscribe(

                `/topic/messages/${userId}`,

                (message) => {

                    onMessageReceived(
                        JSON.parse(message.body)
                    );

                }

            );

            // online users
            stompClient.subscribe(

                "/topic/online",

                (message) => {

                    onOnlineStatus(
                        JSON.parse(message.body)
                    );

                }

            );

            setTimeout(() => {

                stompClient.publish({

                    destination: "/app/online",

                    body: JSON.stringify({
                        userId
                    })

                });

            },100);

        }

    });

    stompClient.activate();

};

export const sendMessage = (message)=>{

    if(stompClient?.connected){

        stompClient.publish({

            destination:"/app/sendMessage",

            body:JSON.stringify(message)

        });

    }

};

export const disconnectSocket=(userId)=>{

    if(stompClient?.connected){

        stompClient.publish({

            destination:"/app/offline",

            body:JSON.stringify({
                userId
            })

        });

        stompClient.deactivate();

    }

};

