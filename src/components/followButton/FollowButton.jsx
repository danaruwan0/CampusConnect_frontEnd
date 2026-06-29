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

    useEffect(() => {

        loadStatus();

    }, []);

    const loadStatus = async () => {

        try {

            const status = await isFollowing(

                followerId,
                followingId

            );

            setFollowing(status);

        }

        catch (err) {

            console.log(err);

        }

    };

    const handleFollow = async () => {

        try {

            if (following) {

                await unfollowUser(

                    followerId,
                    followingId

                );

                setFollowing(false);

            }

            else {

                await followUser(

                    followerId,
                    followingId

                );

                setFollowing(true);

            }

        }

        catch (err) {

            console.log(err);

        }

    };

    return (

        <button

            onClick={handleFollow}

            className={
                following
                    ? "unfollow-btn"
                    : "follow-btn"
            }

        >

            {
                following
                    ? "Following"
                    : "Follow"
            }

        </button>

    );

}