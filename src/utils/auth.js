import { jwtDecode } from "jwt-decode";

export const getLoggedEmail = () => {

    const token =
        localStorage.getItem("token");

    if (!token) return null;

    try {

        const decoded =
            jwtDecode(token);

        return decoded.sub;

    } catch {

        return null;
    }
};