import { stompClient } from "./websocket";

// Send Seen Status
export const sendSeen = (senderId, receiverId) => {

    if (!stompClient?.connected) return;

    stompClient.publish({

        destination: "/app/seen",

        body: JSON.stringify({

            senderId,
            receiverId

        })

    });

};

// Receive Seen Status
export const subscribeSeen = (userId, callback) => {

    if (!stompClient?.connected) return;

    return stompClient.subscribe(

        `/topic/seen/${userId}`,

        (message) => {

            callback(

                JSON.parse(message.body)

            );

        }

    );

};