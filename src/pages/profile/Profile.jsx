import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/navbar/Navbar";
import CommonNavBar from "../../components/commonNavBar/CommonNavBar";
import PostCard from "../../components/postCard/PostCard";

import "./profile.css";

import defaultProfile from "../../assets/Default profile.jpg";
import profilenotfound from "../../assets/Profile Not Found.png";
import noPostsYet from "../../assets/No Posts Yet.png";

import { getProfile } from "../../api/profileApi";
import { getFollowerCount, getFollowingCount } from "../../api/followApi";

import { getUserPosts, reactPost, sharePost } from "../../api/postApi";

import FollowButton from "../../components/followButton/FollowButton";

import { FaFacebookMessenger } from "react-icons/fa";
import { FaRegNewspaper } from "react-icons/fa";

import CreatePostModal from "../../components/createPost/CreatePostModal";

import Loader from "../../components/loader/Loader";

// NEW
import Suggestion from "../../components/suggestion/Suggestion";
import ProfileSuggestion from "../../components/profileSuggestion/ProfileSuggestion";



import {
    FaChevronDown,
    FaChevronUp
} from "react-icons/fa";


export default function Profile() {

    const [showFullBio, setShowFullBio] = useState(false);

    const [showProfileImage, setShowProfileImage] =
        useState(false);

    const navigate = useNavigate();

    const { userId } = useParams();

    const loggedUserId =
        Number(localStorage.getItem("userId"));

    const profileUserId = userId
        ? Number(userId)
        : loggedUserId;


    // ================================
    // STATES
    // ================================

    const [profile, setProfile] = useState(null);

    const [followers, setFollowers] = useState(0);

    const [following, setFollowing] = useState(0);

    const [posts, setPosts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showCreatePost, setShowCreatePost] =
        useState(false);








    const [showProfileInfo, setShowProfileInfo] = useState(false);




    const [shareAlert, setShareAlert] = useState({
        show: false,
        success: true,
        message: ""
    });

    // ================================
    // LOAD PROFILE
    // ================================

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


            console.log(
                "USER POSTS =",
                userPosts
            );


            setProfile(profileData);

            setFollowers(followerCount);

            setFollowing(followingCount);

            setPosts(userPosts || []);


        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };


    // ================================
    // LOADING
    // ================================

    if (loading) {

        return (

            <>

                <CommonNavBar />

                <div
                    style={{
                        textAlign: "center",
                        marginTop: "70px"
                    }}
                >

                    <Loader
                        text="Loading Profile..."
                    />

                </div>

            </>

        );

    }


    // ================================
    // PROFILE NOT FOUND
    // ================================

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

                    <h2>
                        Profile Not Found
                    </h2>

                    <p>
                        The profile you're looking for
                        doesn't exist.
                    </p>

                </div>

            </>

        );

    }


    // ================================
    // DELETE POST
    // ================================

    const handleDeletePost = (postId) => {

        setPosts(prevPosts =>
            prevPosts.filter(
                post =>
                    post.postId !== postId
            )
        );

    };


    // ================================
    // REACTION
    // ================================

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


    // ================================
    // COMMENT
    // ================================

    const handleCommentAdded = (postId) => {

        setPosts(prevPosts =>

            prevPosts.map(post =>

                post.postId === postId

                    ? {
                        ...post,
                        commentCount:
                            (post.commentCount || 0) + 1
                    }

                    : post

            )

        );

    };


    // ================================
    // SHARE
    // ================================

    const handleShare = async (postId) => {

        try {

            // Share API
            await sharePost(
                postId,
                loggedUserId
            );

            // Get updated posts only
            const updatedPosts =
                await getUserPosts(profileUserId);

            // Update posts immediately
            setPosts(
                updatedPosts || []
            );

            // Success alert
            setShareAlert({
                show: true,
                success: true,
                message: "Post shared successfully"
            });

            // Auto close
            setTimeout(() => {

                setShareAlert({
                    show: false,
                    success: true,
                    message: ""
                });

            }, 3000);

        } catch (err) {

            console.log(
                "SHARE ERROR:",
                err
            );

            // Error alert
            setShareAlert({
                show: true,
                success: false,
                message: "Unable to share post"
            });

            // Auto close
            setTimeout(() => {

                setShareAlert({
                    show: false,
                    success: true,
                    message: ""
                });

            }, 2000);

        }

    };


    // ================================
    // UI
    // ================================

    return (

        <>

            {/* ==========================
                NAVBAR
            ========================== */}

            <CommonNavBar
                onCreatePost={() =>
                    setShowCreatePost(true)
                }
            />


            <div className="profile-container">


                {/* ==========================
                    COVER
                ========================== */}

                <div className="cover">

                    <img
                        src={
                            profile.coverImage ||
                            "https://images.unsplash.com/photo-1503264116251-35a269479413"
                        }
                        alt="cover"
                    />

                </div>


                {/* ==========================
                    PROFILE CARD
                ========================== */}

                <div className="profile-box">


                    {/* PROFILE IMAGE */}

                    <img
                        src={
                            profile.profileImage ||
                            defaultProfile
                        }
                        alt="profile"
                        className="profile-pic"
                        onClick={() =>
                            setShowProfileImage(true)
                        }
                        onError={(e) => {

                            e.target.src =
                                defaultProfile;

                        }}
                    />


                    {/* NAME */}

                    <h2>
                        {profile.fullName}
                    </h2>


                    {/* EMAIL */}

                    <p
                        className="email"
                        style={{
                            color: "#1877f2"
                        }}
                    >
                        {profile.email}
                    </p>


                    {/* MAJOR */}

                    {
                        profile.major && (

                            <p>
                                {profile.major}
                            </p>

                        )
                    }


                    {/* BIO */}

                    <div className="bio-section">

                        <p
                            className={
                                showFullBio
                                    ? "bio full"
                                    : "bio"
                            }
                        >
                            {
                                profile.bio ||
                                "No bio available"
                            }
                        </p>


                        {
                            profile.bio &&
                            profile.bio.length > 150 && (

                                <button
                                    className="bio-toggle"
                                    onClick={() =>
                                        setShowFullBio(
                                            !showFullBio
                                        )
                                    }
                                >

                                    {
                                        showFullBio
                                            ? "Show Less"
                                            : "Read More"
                                    }

                                </button>

                            )
                        }

                    </div>


                    {/* ==========================
                        PROFILE INFORMATION
                    ========================== */}

                    {/* <div className="profile-info">


                        <div className="info-item">

                            <strong>
                                University
                            </strong>

                            <span>
                                {
                                    profile.university ||
                                    "-"
                                }
                            </span>

                        </div>


                        <div className="info-item">

                            <strong>
                                Batch
                            </strong>

                            <span>
                                {
                                    profile.batchYear ||
                                    "-"
                                }
                            </span>

                        </div>


                        <div className="info-item">

                            <strong>
                                Location
                            </strong>

                            <span>
                                {
                                    profile.location ||
                                    "-"
                                }
                            </span>

                        </div>


                        <div className="info-item">

                            <strong>
                                Phone
                            </strong>

                            <span>
                                {
                                    profile.phone ||
                                    "-"
                                }
                            </span>

                        </div>


                        <div className="info-item">

                            <strong>
                                Skills
                            </strong>

                            <span>
                                {
                                    profile.skills ||
                                    "-"
                                }
                            </span>

                        </div>


                        <div className="info-item">

                            <strong>
                                GitHub
                            </strong>

                            <a
                                href={
                                    profile.githubUrl ||
                                    "#"
                                }
                                target="_blank"
                                rel="noreferrer"
                            >
                                Visit Profile
                            </a>

                        </div>


                        <div className="info-item">

                            <strong>
                                LinkedIn
                            </strong>

                            <a
                                href={
                                    profile.linkedinUrl ||
                                    "#"
                                }
                                target="_blank"
                                rel="noreferrer"
                            >
                                Visit Profile
                            </a>

                        </div>


                        <div className="info-item">

                            <strong>
                                Portfolio
                            </strong>

                            <a
                                href={
                                    profile.website ||
                                    "#"
                                }
                                target="_blank"
                                rel="noreferrer"
                            >
                                Visit Website
                            </a>

                        </div>

                    </div> */}





                    {/* ==========================
                            PROFILE INFORMATION
                        ========================== */}

                    <div className="profile-info-section">

                        {/* HEADER / TOGGLE */}

                        <button
                            className="profile-info-toggle"
                            onClick={() =>
                                setShowProfileInfo(!showProfileInfo)
                            }
                            aria-expanded={showProfileInfo}
                        >

                            <span>
                                Profile Information
                            </span>

                            {showProfileInfo ? (
                                <FaChevronUp />
                            ) : (
                                <FaChevronDown />
                            )}

                        </button>


                        {/* INFORMATION */}

                        {showProfileInfo && (

                            <div className="profile-info">

                                <div className="info-item">

                                    <strong>
                                        University
                                    </strong>

                                    <span>
                                        {profile.university || "-"}
                                    </span>

                                </div>


                                <div className="info-item">

                                    <strong>
                                        Batch
                                    </strong>

                                    <span>
                                        {profile.batchYear || "-"}
                                    </span>

                                </div>


                                <div className="info-item">

                                    <strong>
                                        Location
                                    </strong>

                                    <span>
                                        {profile.location || "-"}
                                    </span>

                                </div>


                                <div className="info-item">

                                    <strong>
                                        Phone
                                    </strong>

                                    <span>
                                        {profile.phone || "-"}
                                    </span>

                                </div>


                                <div className="info-item">

                                    <strong>
                                        Skills
                                    </strong>

                                    <span>
                                        {profile.skills || "-"}
                                    </span>

                                </div>


                                <div className="info-item">

                                    <strong>
                                        GitHub
                                    </strong>

                                    <a
                                        href={profile.githubUrl || "#"}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Visit Profile
                                    </a>

                                </div>


                                <div className="info-item">

                                    <strong>
                                        LinkedIn
                                    </strong>

                                    <a
                                        href={profile.linkedinUrl || "#"}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Visit Profile
                                    </a>

                                </div>


                                <div className="info-item">

                                    <strong>
                                        Portfolio
                                    </strong>

                                    <a
                                        href={profile.website || "#"}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Visit Website
                                    </a>

                                </div>

                            </div>

                        )}

                    </div>




                    {/* ==========================
                        PROFILE STATS
                    ========================== */}

                    <div className="profile-stats">


                        <div>

                            <h3>
                                {posts.length}
                            </h3>

                            <p>
                                Posts
                            </p>

                        </div>


                        <div>

                            <h3>
                                {followers}
                            </h3>

                            <p>
                                Followers
                            </p>

                        </div>


                        <div>

                            <h3>
                                {following}
                            </h3>

                            <p>
                                Following
                            </p>

                        </div>


                    </div>


                    {/* ==========================
                        PROFILE BUTTONS
                    ========================== */}

                    <div className="profile-buttons">

                        {
                            loggedUserId === profileUserId

                                ?

                                <>

                                    <button
                                        onClick={() =>
                                            navigate(
                                                "/profile/edit"
                                            )
                                        }
                                    >
                                        Edit Profile
                                    </button>


                                    <button
                                        className="create-post-btn"
                                        onClick={() =>
                                            setShowCreatePost(
                                                true
                                            )
                                        }
                                    >
                                        Create Post
                                    </button>

                                </>

                                :

                                <>

                                    <FollowButton
                                        followerId={
                                            loggedUserId
                                        }
                                        followingId={
                                            profileUserId
                                        }
                                    />


                                    <button
                                        className="message-btn"
                                        onClick={() =>
                                            navigate(
                                                `/message/${profileUserId}`
                                            )
                                        }
                                    >

                                        <FaFacebookMessenger />

                                        Message

                                    </button>

                                </>

                        }

                    </div>

                </div>


                {/* ==================================================
                    MOBILE / TABLET SUGGESTIONS
                ================================================== */}








                {/* ==================================================
                    POSTS
                ================================================== */}

                <div className="profile-posts">


                    <ProfileSuggestion className="profile-suggestionnew" />



                    <h2 className="profile-posts-name">

                        <FaRegNewspaper
                            className="posts-icon"
                        />

                        {
                            loggedUserId === profileUserId

                                ? "My Posts"

                                : `${profile.fullName}'s Posts`
                        }

                    </h2>


                    {/* NO POSTS */}

                    {
                        posts.length === 0

                            ?

                            (

                                <div className="no-posts-card">

                                    <img
                                        src={noPostsYet}
                                        alt="No Posts Yet"
                                        className="no-posts-img"
                                    />

                                    <h3>
                                        No Posts Yet
                                    </h3>

                                    <p>
                                        You haven't shared
                                        any posts yet.
                                    </p>

                                </div>

                            )

                            :

                            (

                                posts.map((post) => (

                                    <PostCard

                                        key={
                                            post.postId
                                        }

                                        post={post}

                                        currentUserId={
                                            loggedUserId
                                        }

                                        onCommentAdded={
                                            handleCommentAdded
                                        }

                                        onReact={
                                            handleReaction
                                        }

                                        onDelete={
                                            handleDeletePost
                                        }

                                        onShare={
                                            handleShare
                                        }

                                    />

                                ))

                            )
                    }

                </div>


                {/* ==========================
                    CREATE POST MODAL
                ========================== */}

                <CreatePostModal

                    open={
                        showCreatePost
                    }

                    onClose={() =>
                        setShowCreatePost(false)
                    }

                    onSuccess={() => {

                        loadProfile();

                        setShowCreatePost(false);

                    }}

                />


                {/* =========================================================
    SHARE ALERT
========================================================= */}

                {shareAlert.show && (

                    <div className="profile-share-alert-overlay">

                        <div
                            className={`profile-share-alert-box ${shareAlert.success
                                    ? "profile-share-alert-success"
                                    : "profile-share-alert-error"
                                }`}
                        >

                            {/* ICON */}

                            <div className="profile-share-alert-icon">

                                {shareAlert.success
                                    ? "✓"
                                    : "!"}

                            </div>


                            {/* CONTENT */}

                            <div className="profile-share-alert-content">

                                <h3>

                                    {shareAlert.success
                                        ? "Success"
                                        : "Error"}

                                </h3>

                                <p>
                                    {shareAlert.message}
                                </p>

                            </div>


                            {/* CLOSE */}

                            <button
                                type="button"
                                className="profile-share-alert-close"
                                onClick={() =>
                                    setShareAlert({
                                        show: false,
                                        success: true,
                                        message: ""
                                    })
                                }
                            >

                                ×

                            </button>

                        </div>

                    </div>

                )}

                {/* ==========================
                    PROFILE IMAGE VIEWER
                ========================== */}

                {
                    showProfileImage && (

                        <div
                            className="profile-image-viewer"
                            onClick={() =>
                                setShowProfileImage(false)
                            }
                        >

                            <button
                                className="profile-image-close"
                                onClick={() =>
                                    setShowProfileImage(
                                        false
                                    )
                                }
                            >
                                ×
                            </button>


                            <img
                                src={
                                    profile.profileImage ||
                                    defaultProfile
                                }
                                alt={
                                    `${profile.fullName} profile`
                                }
                                className="profile-image-large"
                                onClick={(e) =>
                                    e.stopPropagation()
                                }
                            />

                        </div>

                    )
                }


            </div>

        </>

    );

}