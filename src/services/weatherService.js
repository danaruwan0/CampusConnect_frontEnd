import api from "../api/axios";


export const getWeather = async (latitude, longitude) => {

    const res = await api.get(
        `/api/weather?latitude=${latitude}&longitude=${longitude}`
    );

    return res.data;
};