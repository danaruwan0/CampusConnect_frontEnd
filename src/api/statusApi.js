import api from "./axios";

export const getOnlineUsers = async () => {

    const res = await api.get("/api/status/online-users");

    return res.data;

};