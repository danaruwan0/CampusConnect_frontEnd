import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/navbar/Navbar";
import PostCard from "../../components/postCard/PostCard";

import "./profile.css";

import defaultProfile from "../../assets/Default profile.jpg";
import profilenotfound from "../../assets/Profile Not Found.png";
import noPostsYet from "../../assets/No Posts Yet.png";

import { getProfile } from "../../api/profileApi";


import { getFollowerCount, getFollowingCount } from "../../api/followApi";

import { getUserPosts } from "../../api/postApi";

import FollowButton from "../../components/followButton/FollowButton";
import { FaFacebookMessenger } from "react-icons/fa";


//


export default function Profile() {

    const navigate = useNavigate();

    // const userId = Number(localStorage.getItem("userId"));
    const { userId } = useParams();

    const loggedUserId = Number(localStorage.getItem("userId"));

    const profileUserId = userId
        ? Number(userId)
        : loggedUserId;

    const [profile, setProfile] = useState(null);

    const [followers, setFollowers] = useState(0);

    const [following, setFollowing] = useState(0);

    const [posts, setPosts] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, [profileUserId]);

    const loadProfile = async () => {

        try {

            setLoading(true);

            const [

                profileData,
                followerCount,
                followingCount,
                userPosts

            ] = await Promise.all([

                getProfile(profileUserId),

                getFollowerCount(profileUserId),

                getFollowingCount(profileUserId),

                getUserPosts(profileUserId)

            ]);

            setProfile(profileData);

            setFollowers(followerCount);

            setFollowing(followingCount);

            setPosts(userPosts);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <>
                <Navbar />

                <div
                    style={{
                        textAlign: "center",
                        marginTop: "70px"
                    }}
                >
                    <h2>Loading Profile...</h2>
                </div>

            </>

        );

    }

    if (!profile) {

        return (

            <>
                <Navbar />

                <div className="profile-not-found">

                    <img
                        src={profilenotfound}
                        alt="Profile Not Found"
                        className="profile-not-found-img"
                    />

                    <h2>Profile Not Found</h2>

                    <p>
                        The profile you're looking for doesn't exist.
                    </p>

                </div>

            </>

        );

    }

    return (

        <>

            <Navbar />

            <div className="profile-container">

                {/* COVER */}

                <div className="cover">

                    <img

                        src={
                            profile.coverImage ||
                            "https://images.unsplash.com/photo-1503264116251-35a269479413"
                        }

                        alt="cover"

                    />

                </div>

                {/* PROFILE */}

                <div className="profile-box">

                    <img

                        src={
                            profile.profileImage ||
                            defaultProfile
                        }

                        alt="profile"

                        className="profile-pic"

                        onError={(e) => {

                            e.target.src = defaultProfile;

                        }}

                    />

                    <h2>

                        {profile.fullName}

                    </h2>

                    <p className="email">

                        {profile.email}

                    </p>

                    {
                        profile.major && (

                            <p>

                                {profile.major}

                            </p>

                        )
                    }

                    <p>

                        {profile.bio || "No bio available"}

                    </p>

                    {/* STATS */}

                    <div className="profile-stats">

                        <div>

                            <h3>

                                {posts.length}

                            </h3>

                            <p>Posts</p>

                        </div>

                        <div>

                            <h3>

                                {followers}

                            </h3>

                            <p>Followers</p>

                        </div>

                        <div>

                            <h3>

                                {following}

                            </h3>

                            <p>Following</p>

                        </div>

                    </div>

                    {/* EDIT BUTTON */}

                    <div className="profile-buttons">

                        {loggedUserId === profileUserId ? (

                            <button
                                onClick={() => navigate("/profile/edit")}
                            >
                                Edit Profile
                            </button>

                        ) : (

                            <>
                                <FollowButton
                                    followerId={loggedUserId}
                                    followingId={profileUserId}
                                />

                                <button
                                    className="message-btn"
                                    onClick={() =>
                                        navigate(`/message/${profileUserId}`)
                                    }
                                >
                                    <FaFacebookMessenger />
                                    Message
                                </button>
                            </>

                        )}

                    </div>

                </div>

                {/* POSTS */}

                <div className="profile-posts">

                    <h2 style={{ marginBottom: "20px" }}>
                        {loggedUserId === profileUserId
                            ? "My Posts"
                            : `${profile.fullName}'s Posts`}
                    </h2>
                    {posts.length === 0 ? (

                        <div className="no-posts-card">

                            <img
                                src={noPostsYet}
                                alt="No Posts Yet"
                                className="no-posts-img"
                            />

                            <h3>No Posts Yet</h3>

                            <p>
                                You haven't shared any posts yet.
                            </p>

                        </div>
                    ) : (

                        posts.map((post) => (

                            <PostCard
                                key={post.postId}
                                post={post}
                                currentUserId={userId}
                            />

                        ))

                    )}

                </div>

            </div>

        </>

    );

}