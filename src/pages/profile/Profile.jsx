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

import CreatePostModal from "../../components/createPost/CreatePostModal";

import { reactPost,  sharePost } from "../../api/postApi";


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

    //new state for create post modal
    const [showCreatePost, setShowCreatePost] = useState(false);

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

            console.log("USER POSTS =", userPosts);

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

    // Function to handle post deletion
    const handleDeletePost = (postId) => {

        setPosts(prevPosts =>
            prevPosts.filter(post => post.postId !== postId)
        );

    };



    // Function to handle reactions  TODAY ADD
    const handleReaction = async (
        postId,
        reactionType
    ) => {

        try {

            await reactPost(
                postId,
                loggedUserId,
                reactionType
            );


            loadProfile();


        } catch (err) {

            console.log(err);

        }

    };


    //new add
    const handleCommentAdded = (postId) => {

        setPosts(prevPosts =>

            prevPosts.map(post =>

                post.postId === postId
                    ? {
                        ...post,
                        commentCount: post.commentCount + 1
                    }
                    : post

            )

        );

    };


    const handleShare = async (postId) => {

    try {

        await sharePost(postId, loggedUserId);

        loadProfile();

    } catch (err) {

        console.log(err);

    }

};




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

                    <p className="email" style={{ color: "#1877f2" }}>
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


                    <div className="profile-details">

                        <p>
                            <strong>University</strong>
                            <span>{profile.university}</span>
                        </p>

                        <p>
                            <strong>Batch</strong>
                            <span>{profile.batchYear}</span>
                        </p>

                        <p>
                            <strong>Location</strong>
                            <span>{profile.location}</span>
                        </p>

                        <p>
                            <strong>Phone</strong>
                            <span>{profile.phone}</span>
                        </p>

                        <p>
                            <strong>Skills</strong>
                            <span>{profile.skills}</span>
                        </p>

                        <p>
                            <strong >GitHub</strong>
                            <a href={profile.githubUrl} target="_blank" rel="noreferrer">
                                Visit GitHub
                            </a>
                        </p>

                        <p>
                            <strong >LinkedIn</strong>
                            <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">
                                Visit LinkedIn
                            </a>
                        </p>

                        <p>
                            <strong >Portfolio</strong>
                            <a href={profile.website} target="_blank" rel="noreferrer">
                                Visit Website
                            </a>
                        </p>
                    </div>

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

                            <>
                                <button
                                    onClick={() => navigate("/profile/edit")}
                                >
                                    Edit Profile
                                </button>

                                <button
                                    className="create-post-btn"
                                    onClick={() => setShowCreatePost(true)}
                                >
                                    Create Post
                                </button>
                            </>




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
                                // currentUserId={userId}
                                currentUserId={loggedUserId}


                                //new add
                                onCommentAdded={handleCommentAdded}

                                //new add
                                onReact={handleReaction}
                                
                                //new add
                                onDelete={handleDeletePost}

                                onShare={handleShare}
                            />

                        ))

                    )}

                </div>


                <CreatePostModal

                    open={showCreatePost}

                    onClose={() => setShowCreatePost(false)}

                    onSuccess={loadProfile}

                />

            </div>

        </>

    );

}