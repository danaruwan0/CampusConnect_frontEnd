import axios from "axios";

const API = "http://localhost:8081/api/users";
// const API = "http://10.159.4.97:8081/api/users";

export const searchUsers = async (keyword, userId) => {
    const res = await axios.get(
        `${API}/search?keyword=${encodeURIComponent(keyword)}&userId=${userId}`
    );

    return res.data;
};