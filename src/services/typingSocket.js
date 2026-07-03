import { stompClient } from "./websocket";

// Send Typing
export const sendTyping = (senderId, receiverId) => {

    console.log("sendTyping() called");

    if (!stompClient?.connected) {
        console.log("Socket NOT connected");
        return;
    }

    console.log("Socket connected");

    stompClient.publish({

        destination: "/app/typing",

        body: JSON.stringify({

            senderId,
            receiverId,
            typing: true

        })

    });

    console.log("Typing Event Sent");

};


// Stop Typing
export const stopTyping = (senderId, receiverId) => {

    console.log("stopTyping() called");

    if (!stompClient?.connected) {
        console.log("Socket NOT connected");
        return;
    }

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

    if (!stompClient?.connected) return null;

    return stompClient.subscribe(

        `/topic/typing/${userId}`,

        (message) => {

            console.log("Typing event received", message.body);

            callback(JSON.parse(message.body));

        }

    );

};
