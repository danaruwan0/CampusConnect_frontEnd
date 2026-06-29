import api from "./axios";

export const getFeed = async () => {
    const res = await api.get("/api/posts/feed");
    return res.data;
};

export const reactPost = async (postId, userId, type) => {
    const res = await api.post(`/api/posts/${postId}/react`, {
        userId,
        reactionType: type
    });
    return res.data;
};

// export const addComment = async (postId, userId, comment) => {
//     const res = await api.post(`/api/posts/${postId}/comments`, {
//         userId,
//         comment
//     });
//     return res.data;
// };

export const getComments = async (postId) => {
    const res = await api.get(
        `/api/posts/${postId}/comments`
    );

    return res.data;
};

// export const getUserPosts = async (userId) => {
//     const res = await api.get(
//         `/api/posts/user/${userId}`
//     );

//     return res.data;
// };



export const getUserPosts = async (userId) => {

    const res = await api.get(`/api/posts/user/${userId}`);

    console.log("API RESPONSE =", res);

    console.log("DATA =", res.data);

    return res.data;
};