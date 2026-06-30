import { stompClient } from "./websocket";

// Send Typing
export const sendTyping = (senderId, receiverId) => {

    if (!stompClient?.connected) return;

    stompClient.publish({

        destination: "/app/typing",

        body: JSON.stringify({

            senderId,
            receiverId,
            typing: true

        })

    });

};

// Stop Typing
export const stopTyping = (senderId, receiverId) => {

    if (!stompClient?.connected) return;

    stompClient.publish({

        destination: "/app/stopTyping",

        body: JSON.stringify({

            senderId,
            receiverId,
            typing: false

        })

    });

};

// Subscribe
export const subscribeTyping = (userId, callback) => {

    if (!stompClient?.connected) return;

    stompClient.subscribe(

        `/topic/typing/${userId}`,

        (message) => {

            callback(JSON.parse(message.body));

        }

    );

};

