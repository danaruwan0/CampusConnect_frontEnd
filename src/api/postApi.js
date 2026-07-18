import api from "./axios";

export const getFeed = async () => {
    const res = await api.get("/api/posts/feed");
    return res.data;
};


export const createPost = async (userId, title, content, image) => {

    const formData = new FormData();

    formData.append("userId", userId);

    if (title)
        formData.append("title", title);

    if (content)
        formData.append("content", content);

    if (image)
        formData.append("image", image);

    const res = await api.post(
        "/api/posts",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return res.data;
};




export const reactPost = async (postId, userId, type) => {
    const res = await api.post(`/api/posts/${postId}/react`, {
        userId,
        reactionType: type
    });
    return res.data;
};


//
//remove reaction
export const removeReaction = async (
    postId,
    userId
) => {

    const res = await api.delete(
        `/api/posts/${postId}/react/${userId}`
    );

    return res.data;

};

//get comments for a post
export const getComments = async (postId) => {
    const res = await api.get(
        `/api/posts/${postId}/comments`
    );

    return res.data;
};




export const getUserPosts = async (userId) => {

    const res = await api.get(`/api/posts/user/${userId}`);

    console.log("API RESPONSE =", res);

    console.log("DATA =", res.data);

    return res.data;
};

//create comment post part
export const addComment = async (postId, userId, comment) => {

    const res = await api.post(

        `/api/posts/${postId}/comments`,

        {
            userId,
            comment
        }

    );

    return res.data;

};



export const deletePost = async (postId, userId) => {

    const res = await api.delete(
        `/api/posts/${postId}?userId=${userId}`
    );

    return res.data;
};


export const sharePost = async (postId, userId) => {

    const res = await api.post(
        `/api/posts/${postId}/share?userId=${userId}`
    );

    return res.data;
};