import api from "./axios";

export const getSuggestions = async (userId) => {
    const res = await api.get(
        `/api/follow/${userId}/suggestions`
    );
    return res.data;
};

export const followUser = async (
    followerId,
    followingId
) => {
    const res = await api.post(
        `/api/follow/${followerId}/${followingId}`
    );
    return res.data;
};

export const unfollowUser = async (
    followerId,
    followingId
) => {
    const res = await api.delete(
        `/api/follow/${followerId}/${followingId}`
    );
    return res.data;
};

export const isFollowing = async (
    followerId,
    followingId
) => {
    const res = await api.get(
        `/api/follow/${followerId}/${followingId}/status`
    );
    return res.data;
};


export const getFollowerCount = async (userId) => {
    const res = await api.get(
        `/api/follow/${userId}/followers/count`
    );
    return res.data;
};

export const getFollowingCount = async (userId) => {
    const res = await api.get(
        `/api/follow/${userId}/following/count`
    );
    return res.data;
};