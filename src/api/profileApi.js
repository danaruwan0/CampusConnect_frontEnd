// import axios from "axios";

// const API =
//     "http://localhost:8081/api/profile";

// export const getProfile =
//     async (userId) => {

//         const res =
//             await axios.get(
//                 `${API}/${userId}`
//             );

//         return res.data;
//     };


import api from "./axios";

// export const getProfile = async (userId) => {
//     const res = await api.get(`/api/profile/${userId}`);
//     return res.data;
// };



export const getProfile = async (userId) => {

    const res = await api.get(
        `/api/profile/${userId}`
    );

    return res.data;

};

export const updateProfile = async (

    userId,
    data

) => {

    const res = await api.post(

        `/api/profile/${userId}`,
        data

    );

    return res.data;

};

export const uploadProfileImage = async (

    userId,
    formData

) => {

    const res = await api.post(

        `/api/profile/${userId}/upload-profile-image`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }

    );

    return res.data;

};

export const uploadCoverImage = async (

    userId,
    formData

) => {

    const res = await api.post(

        `/api/profile/${userId}/upload-cover-image`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }

    );

    return res.data;

};