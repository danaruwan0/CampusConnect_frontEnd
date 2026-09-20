import React, { useEffect, useState } from "react";
import "./home.css";

import Navbar from "../../components/navbar/Navbar";
import SideNavBar from "../../components/sideNavBar/SideNavBar";
import PostCard from "../../components/postCard/PostCard";
import CreatePostModal from "../../components/createPost/CreatePostModal";
import Suggestion from "../../components/suggestion/Suggestion";
import Loader from "../../components/loader/Loader";

import noSuggestions from "../../assets/No suggestions.png";
import defaultProfile from "../../assets/Default profile.jpg";

import {
    getFeed,
    sharePost
} from "../../api/postApi";

import {
    getSuggestions,
    followUser,
    unfollowUser
} from "../../api/followApi";


export default function Home() {

    const userId = Number(
        localStorage.getItem("userId")
    );


    // =====================================================
    // STATES
    // =====================================================

    const [feed, setFeed] = useState([]);

    const [suggestions, setSuggestions] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showMenu, setShowMenu] = useState(false);

    const [showCreatePost, setShowCreatePost] = useState(false);

    const [shareAlert, setShareAlert] = useState({
        show: false,
        success: true,
        message: ""
    });


    // =====================================================
    // LOAD HOME DATA
    // =====================================================

    useEffect(() => {

        loadData();

    }, []);


    const loadData = async () => {

        try {

            setLoading(true);

            const [
                posts,
                users
            ] = await Promise.all([

                getFeed(userId),

                getSuggestions(userId)

            ]);


            setFeed(posts || []);

            setSuggestions(users || []);


        } catch (error) {

            console.error(
                "HOME LOAD ERROR:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // FOLLOW / UNFOLLOW SUGGESTION
    // =====================================================

    const handleSuggestionFollow = async (
        targetId,
        isFollowing
    ) => {

        try {

            // =================================================
            // UNFOLLOW
            // =================================================

            if (isFollowing) {

                await unfollowUser(
                    userId,
                    targetId
                );


                /*
                 * IMPORTANT
                 *
                 * Unfollow කළාම suggestion එක
                 * නැවත list එකට දාන්නේ නැහැ.
                 *
                 * Current UI එකෙන් remove වෙනවා.
                 *
                 * Page refresh කළොත් backend එකෙන්
                 * නැවත suggestion එකක් විදිහට එන්න පුළුවන්.
                 */

                setSuggestions(prevSuggestions =>
                    prevSuggestions.filter(
                        user =>
                            user.userId !== targetId
                    )
                );


                return;

            }


            // =================================================
            // FOLLOW
            // =================================================

            await followUser(
                userId,
                targetId
            );


            /*
             * IMPORTANT
             *
             * Follow API success උනාට පස්සේ
             * user එක suggestions array එකෙන්
             * remove කරනවා.
             *
             * ඒ නිසා:
             *
             * Desktop suggestion
             * +
             * Mobile / Tablet suggestion
             *
             * දෙකම refresh නැතුව immediately
             * disappear වෙනවා.
             */

            setSuggestions(prevSuggestions =>
                prevSuggestions.filter(
                    user =>
                        user.userId !== targetId
                )
            );


        } catch (error) {

            console.error(
                "SUGGESTION FOLLOW ERROR:",
                error
            );

        }

    };


    // =====================================================
    // REACTION
    // =====================================================

    const handleReact = (
        postId,
        type,
        removed = false,
        previousReaction = null
    ) => {

        setFeed(prevFeed =>

            prevFeed.map(post => {

                // Different post
                if (
                    post.postId !== postId
                ) {

                    return post;

                }


                const currentCount =
                    post.reactionCount || 0;


                // =================================================
                // REMOVE REACTION
                // =================================================

                if (removed) {

                    return {

                        ...post,

                        reactionCount:
                            Math.max(
                                0,
                                currentCount - 1
                            )

                    };

                }


                // =================================================
                // CHANGE EXISTING REACTION
                // =================================================

                if (previousReaction) {

                    return {
                        ...post
                    };

                }


                // =================================================
                // NEW REACTION
                // =================================================

                return {

                    ...post,

                    reactionCount:
                        currentCount + 1

                };

            })

        );

    };


    // =====================================================
    // DELETE POST
    // =====================================================

    const handleDelete = (postId) => {

        setFeed(prevFeed =>
            prevFeed.filter(
                post =>
                    post.postId !== postId
            )
        );

    };


    // =====================================================
    // SHARE POST
    // =====================================================

    const handleShare = async (postId) => {

        try {

            await sharePost(
                postId,
                userId
            );


            const updatedFeed =
                await getFeed(userId);


            setFeed(
                updatedFeed || []
            );


            // =================================================
            // SUCCESS ALERT
            // =================================================

            setShareAlert({

                show: true,

                success: true,

                message:
                    "Post shared successfully"

            });


            setTimeout(() => {

                setShareAlert({

                    show: false,

                    success: true,

                    message: ""

                });

            }, 3000);


        } catch (error) {

            console.error(
                "SHARE ERROR:",
                error
            );


            // =================================================
            // ERROR ALERT
            // =================================================

            setShareAlert({

                show: true,

                success: false,

                message:
                    "Unable to share post"

            });


            setTimeout(() => {

                setShareAlert({

                    show: false,

                    success: true,

                    message: ""

                });

            }, 2000);

        }

    };


    // =====================================================
    // COMMENT
    // =====================================================

    const handleComment = () => {

        /*
         * Comments are handled
         * inside PostCard.
         */

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <>

                <Navbar

                    onCreatePost={() =>
                        setShowCreatePost(true)
                    }

                    onMenuClick={() =>
                        setShowMenu(true)
                    }

                />


                <div className="loading-text">

                    <Loader
                        text="Loading Feed..."
                    />

                </div>

            </>

        );

    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className="home-page">


            {/* =================================================
                NAVBAR
            ================================================= */}

            <Navbar

                onCreatePost={() =>
                    setShowCreatePost(true)
                }

                onMenuClick={() =>
                    setShowMenu(true)
                }

            />


            {/* =================================================
                MOBILE SIDEBAR OVERLAY
            ================================================= */}

            {showMenu && (

                <div

                    className="sidebar-overlay"

                    onClick={() =>
                        setShowMenu(false)
                    }

                />

            )}


            {/* =================================================
                MOBILE / TABLET SUGGESTIONS
            ================================================= */}

            <Suggestion

                suggestions={
                    suggestions
                }

                onFollow={
                    handleSuggestionFollow
                }

            />


            {/* =================================================
                MAIN CONTAINER
            ================================================= */}

            <div className="home-container">


                {/* =================================================
                    LEFT SIDEBAR
                ================================================= */}

                <aside

                    className={
                        `left-card ${
                            showMenu
                                ? "show"
                                : ""
                        }`
                    }

                >

                    <SideNavBar

                        open={
                            showMenu
                        }

                        onClose={() =>
                            setShowMenu(false)
                        }

                    />

                </aside>


                {/* =================================================
                    FEED
                ================================================= */}

                <main className="feed">

                    {feed.length === 0

                        ? (

                            <div className="empty-feed">

                                <h3>
                                    No Posts Yet
                                </h3>

                                <p>
                                    Start sharing something
                                    with your campus community.
                                </p>

                            </div>

                        )

                        : (

                            feed.map(post => (

                                <PostCard

                                    key={
                                        post.postId
                                    }

                                    post={
                                        post
                                    }

                                    currentUserId={
                                        userId
                                    }

                                    onReact={
                                        handleReact
                                    }

                                    onComment={
                                        handleComment
                                    }

                                    onShare={
                                        handleShare
                                    }

                                    onDelete={
                                        handleDelete
                                    }

                                />

                            ))

                        )

                    }

                </main>


                {/* =================================================
                    DESKTOP RIGHT SUGGESTIONS
                ================================================= */}

                <aside className="right-card">


                    {/* =================================================
                        TITLE
                    ================================================= */}

                    <h3>
                        People You May Know
                    </h3>


                    {/* =================================================
                        SUGGESTION LIST
                    ================================================= */}

                    <div className="suggestions-list">

                        {suggestions.length === 0

                            ? (

                                <div className="no-suggestions">


                                    <img

                                        src={
                                            noSuggestions
                                        }

                                        alt="No Suggestions"

                                        className="no-suggestions-img"

                                    />


                                    <h4>
                                        No Suggestions
                                    </h4>


                                    <p>
                                        You're connected with everyone
                                        for now.
                                    </p>


                                </div>

                            )

                            : (

                                suggestions.map(
                                    user => (

                                        <div

                                            className="suggestion"

                                            key={
                                                user.userId
                                            }

                                        >


                                            {/* =================================
                                                PROFILE IMAGE
                                            ================================= */}

                                            <img

                                                src={
                                                    user.profileImage ||
                                                    defaultProfile
                                                }

                                                alt={
                                                    user.fullName ||
                                                    "User"
                                                }

                                                className="suggestion-profile-image"

                                                onClick={() =>
                                                    window.location.href =
                                                        `/profile/${user.userId}`
                                                }

                                                onError={(e) => {

                                                    e.currentTarget.src =
                                                        defaultProfile;

                                                }}

                                            />


                                            {/* =================================
                                                USER INFORMATION
                                            ================================= */}

                                            <div className="suggestion-user-info">

                                                <p>
                                                    {
                                                        user.fullName
                                                    }
                                                </p>


                                                <small>
                                                    {
                                                        user.email
                                                    }
                                                </small>

                                            </div>


                                            {/* =================================
                                                FOLLOW BUTTON
                                            ================================= */}

                                            <button

                                                className={
                                                    user.isFollowing
                                                        ? "following-btn"
                                                        : ""
                                                }

                                                onClick={() =>
                                                    handleSuggestionFollow(

                                                        user.userId,

                                                        user.isFollowing

                                                    )
                                                }

                                            >

                                                {
                                                    user.isFollowing

                                                        ? "Following"

                                                        : "Follow"
                                                }

                                            </button>


                                        </div>

                                    )

                                )

                            )

                        }

                    </div>

                </aside>


            </div>


            {/* =================================================
                CREATE POST MODAL
            ================================================= */}

            <CreatePostModal

                open={
                    showCreatePost
                }

                onClose={() =>
                    setShowCreatePost(false)
                }

                onSuccess={() => {

                    loadData();

                    setShowCreatePost(
                        false
                    );

                }}

            />


            {/* =================================================
                SHARE ALERT
            ================================================= */}

            {shareAlert.show && (

                <div className="cc-share-alert-overlay">


                    <div

                        className={
                            `cc-share-alert-box ${
                                shareAlert.success
                                    ? "cc-share-alert-success"
                                    : "cc-share-alert-error"
                            }`
                        }

                    >


                        {/* =========================================
                            ALERT ICON
                        ========================================= */}

                        <div className="cc-share-alert-icon">

                            {
                                shareAlert.success
                                    ? "✓"
                                    : "!"
                            }

                        </div>


                        {/* =========================================
                            ALERT CONTENT
                        ========================================= */}

                        <div className="cc-share-alert-content">

                            <h3>

                                {
                                    shareAlert.success
                                        ? "Success"
                                        : "Error"
                                }

                            </h3>


                            <p>

                                {
                                    shareAlert.message
                                }

                            </p>

                        </div>


                        {/* =========================================
                            CLOSE
                        ========================================= */}

                        <button

                            className="cc-share-alert-close"

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

        </div>

    );

}