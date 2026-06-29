import api from "./axios";

export const getChatList = async (userId) => {
    const res = await api.get(`/api/messages/chat-list/${userId}`);
    return res.data;
};

export const getConversation = async (user1, user2) => {
    const res = await api.get(
        `/api/messages/conversation/${user1}/${user2}`
    );
    return res.data;
};

export const markConversationAsRead = async (

    receiverId,

    senderId

) => {

    await api.put(

        `/api/messages/read/${receiverId}/${senderId}`

    );

};