import React, { useEffect, useState } from "react";

import {
    followUser,
    unfollowUser,
    isFollowing
} from "../../api/followApi";

import "./followButton.css";

export default function FollowButton({
    followerId,
    followingId
}) {

    const [following, setFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    /*
    =========================================================
    LOAD FOLLOW STATUS
    =========================================================
    */

    useEffect(() => {

        if (!followerId || !followingId) {
            setLoading(false);
            return;
        }

        loadStatus();

    }, [followerId, followingId]);


    const loadStatus = async () => {

        try {

            setLoading(true);

            const status = await isFollowing(
                followerId,
                followingId
            );

            setFollowing(Boolean(status));

        } catch (err) {

            console.error(
                "Error loading follow status:",
                err
            );

            setFollowing(false);

        } finally {

            setLoading(false);

        }

    };


    /*
    =========================================================
    FOLLOW / UNFOLLOW
    =========================================================
    */

    const handleFollow = async () => {

        if (
            actionLoading ||
            !followerId ||
            !followingId
        ) {
            return;
        }

        try {

            setActionLoading(true);

            if (following) {

                /*
                ==========================
                UNFOLLOW
                ==========================
                */

                await unfollowUser(
                    followerId,
                    followingId
                );

                setFollowing(false);

            } else {

                /*
                ==========================
                FOLLOW
                ==========================
                */

                await followUser(
                    followerId,
                    followingId
                );

                setFollowing(true);

            }

        } catch (err) {

            console.error(
                "Follow / Unfollow error:",
                err
            );

        } finally {

            setActionLoading(false);

        }

    };


    /*
    =========================================================
    LOADING
    =========================================================
    */

    if (loading) {

        return (

            <button
                className="follow-btn follow-loading"
                disabled
            >
                Loading...
            </button>

        );

    }


    /*
    =========================================================
    BUTTON
    =========================================================
    */

    return (

        <button

            type="button"

            onClick={handleFollow}

            disabled={actionLoading}

            className={
                following
                    ? "unfollow-btn"
                    : "follow-btn"
            }

        >

            {actionLoading

                ? "Please wait..."

                : following
                    ? "Following"
                    : "Follow"

            }

        </button>

    );

}