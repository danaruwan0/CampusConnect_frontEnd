import api from "./axios";
export const getNotifications = async (userId) => {

    const res = await api.get(`/api/notifications/${userId}`);

    return res.data;
};

export const getUnreadCount = async (userId) => {

    const res = await api.get(`/api/notifications/${userId}/count`);

    return res.data;
};

export const markAsRead = async (notificationId) => {

    const res = await api.put(
        `/api/notifications/${notificationId}/read`
    );

    return res.data;
};