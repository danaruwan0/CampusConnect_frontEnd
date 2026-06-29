import axios from "axios";

const API = "http://localhost:8081/api/users";

export const searchUsers = async (keyword) => {

    const res = await axios.get(
        `${API}/search?keyword=${keyword}`
    );

    return res.data;
};