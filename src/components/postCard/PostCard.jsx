import React, { useState, useRef, useEffect } from "react";

import "./postCard.css";

import ReactionBar from "../reactionBar/ReactionBar";
import FollowButton from "../followButton/FollowButton";

import { getComments, addComment, deletePost, sharePost } from "../../api/postApi";

import defaultProfile from "../../assets/Default profile.jpg";

import { FaThumbsUp, FaRegCommentDots } from "react-icons/fa";

import { BsThreeDots,BsTrash, BsPencilSquare, BsLink45Deg ,BsFlag, BsShare, BsXLg } from "react-icons/bs";

import { useNavigate } from "react-router-dom";


export default function PostCard({
    post,
    currentUserId,
    onReact,
    onComment,
    onDelete,
    onShare
}) {

    // =========================================================
    // STATES
    // =========================================================

    const [showComments, setShowComments] =
        useState(false);

    const [comments, setComments] =
        useState([]);

    const [commentText, setCommentText] =
        useState("");

    const [postingComment, setPostingComment] =
        useState(false);

    const [showMenu, setShowMenu] =
        useState(false);

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [expanded, setExpanded] =
        useState(false);

    // =========================================================
    // FULL MEDIA VIEWER
    // =========================================================

    const [showMediaViewer, setShowMediaViewer] =
        useState(false);


    // =========================================================
    // LOGGED USER
    // =========================================================

    const loggedUserId =
        Number(localStorage.getItem("userId"));


    // =========================================================
    // NAVIGATION
    // =========================================================

    const navigate = useNavigate();


    // =========================================================
    // VIDEO REFS
    // =========================================================

    const videoRef =
        useRef(null);

    const sharedVideoRef =
        useRef(null);


    // =========================================================
    // MEDIA VIEWER REF
    // =========================================================

    const mediaViewerRef =
        useRef(null);


    // =========================================================
    // MENU REF
    // =========================================================

    const menuRef =
        useRef(null);


    // =========================================================
    // DISPLAY POST
    // =========================================================

    const displayPost = post.shared
        ? {
            title: post.originalPostTitle,
            content: post.originalPostContent,
            mediaUrl: post.originalPostMediaUrl,
            mediaType: post.originalPostMediaType,
            profileImage: post.originalProfileImage,
            fullName: post.originalPostUser
        }
        : {
            title: post.title,
            content: post.content,
            mediaUrl: post.mediaUrl,
            mediaType: post.mediaType,
            profileImage: post.profileImage,
            fullName: post.fullName
        };


    // =========================================================
    // CONTENT
    // =========================================================

    const contentText =
        displayPost.content || "";

    const CONTENT_LIMIT = 220;

    const isLongContent =
        contentText.length > CONTENT_LIMIT;


    // =========================================================
    // RESET SEE MORE WHEN POST CHANGES
    // =========================================================

    useEffect(() => {

        setExpanded(false);

    }, [post.postId]);


    // =========================================================
    // FULL MEDIA VIEWER
    // ESCAPE KEY
    // =========================================================

    useEffect(() => {

        const handleEscape = (event) => {

            if (
                event.key === "Escape" &&
                showMediaViewer
            ) {

                setShowMediaViewer(false);

            }

        };


        if (showMediaViewer) {

            document.addEventListener(
                "keydown",
                handleEscape
            );

            // Prevent background page scrolling
            document.body.style.overflow = "hidden";

        }


        return () => {

            document.removeEventListener(
                "keydown",
                handleEscape
            );

            document.body.style.overflow = "";

        };

    }, [showMediaViewer]);


    // =========================================================
    // OPEN MEDIA VIEWER
    // =========================================================

    const openMediaViewer = () => {

        // Pause original feed video
        if (videoRef.current) {

            videoRef.current.pause();

        }

        if (sharedVideoRef.current) {

            sharedVideoRef.current.pause();

        }

        setShowMediaViewer(true);

    };


    // =========================================================
    // CLOSE MEDIA VIEWER
    // =========================================================

    const closeMediaViewer = () => {

        setShowMediaViewer(false);

    };


    // =========================================================
    // GLOBAL VIDEO MANAGER
    // =========================================================

    useEffect(() => {

        const normalVideo =
            videoRef.current;

        const sharedVideo =
            sharedVideoRef.current;


        const videos = [
            normalVideo,
            sharedVideo
        ].filter(Boolean);


        if (videos.length === 0) {

            return;

        }


        const handlePlay = (event) => {

            const playingVideo =
                event.currentTarget;


            const allVideos =
                document.querySelectorAll(
                    ".post-media-video"
                );


            allVideos.forEach((otherVideo) => {

                if (
                    otherVideo !== playingVideo &&
                    !otherVideo.paused
                ) {

                    otherVideo.pause();

                }

            });

        };


        videos.forEach((video) => {

            video.addEventListener(
                "play",
                handlePlay
            );

        });


        return () => {

            videos.forEach((video) => {

                video.removeEventListener(
                    "play",
                    handlePlay
                );

            });

        };

    }, [
        post.postId,
        post.shared,
        post.mediaUrl,
        post.originalPostMediaUrl
    ]);


    // =========================================================
    // INTERSECTION OBSERVER
    // =========================================================

    useEffect(() => {

        const normalVideo =
            videoRef.current;

        const sharedVideo =
            sharedVideoRef.current;


        const videos = [
            normalVideo,
            sharedVideo
        ].filter(Boolean);


        if (videos.length === 0) {

            return;

        }


        const observer =
            new IntersectionObserver(

                (entries) => {

                    entries.forEach((entry) => {

                        const video =
                            entry.target;


                        // ====================================
                        // VIDEO VISIBLE
                        // ====================================

                        if (
                            entry.isIntersecting &&
                            entry.intersectionRatio >= 0.6
                        ) {

                            const allVideos =
                                document.querySelectorAll(
                                    ".post-media-video"
                                );


                            allVideos.forEach(
                                (otherVideo) => {

                                    if (
                                        otherVideo !== video &&
                                        !otherVideo.paused
                                    ) {

                                        otherVideo.pause();

                                    }

                                }
                            );


                            if (video.paused) {

                                const playPromise =
                                    video.play();


                                if (
                                    playPromise !== undefined
                                ) {

                                    playPromise.catch(() => {
                                        // Autoplay restriction
                                    });

                                }

                            }

                        }


                        // ====================================
                        // VIDEO NOT VISIBLE
                        // ====================================

                        else {

                            if (!video.paused) {

                                video.pause();

                            }

                        }

                    });

                },

                {
                    threshold: [
                        0,
                        0.25,
                        0.5,
                        0.6,
                        0.75,
                        1
                    ]
                }

            );


        videos.forEach((video) => {

            observer.observe(video);

        });


        return () => {

            observer.disconnect();

        };

    }, [
        post.postId,
        post.shared,
        post.mediaUrl,
        post.originalPostMediaUrl
    ]);


    // =========================================================
    // VIDEO DOUBLE CLICK
    // =========================================================

    const handleVideoDoubleClick = (e) => {

        const video =
            e.currentTarget;


        if (!video) {

            return;

        }


        const rect =
            video.getBoundingClientRect();


        const clickX =
            e.clientX - rect.left;


        if (
            clickX <
            rect.width / 2
        ) {

            video.currentTime =
                Math.max(
                    0,
                    video.currentTime - 10
                );

        }

        else {

            if (
                Number.isFinite(
                    video.duration
                )
            ) {

                video.currentTime =
                    Math.min(
                        video.duration,
                        video.currentTime + 10
                    );

            }

        }

    };


    // =========================================================
    // LOAD COMMENTS
    // =========================================================

    const loadComments = async () => {

        try {

            if (!showComments) {

                const data =
                    await getComments(
                        post.postId
                    );

                setComments(data);

            }


            setShowComments(
                !showComments
            );

        }

        catch (err) {

            console.log(err);

        }

    };


    // =========================================================
    // COMMENT SUBMIT
    // =========================================================

    const handleCommentSubmit = async () => {

        if (!commentText.trim()) {

            return;

        }


        try {

            setPostingComment(true);


            await addComment(
                post.postId,
                loggedUserId,
                commentText
            );


            setCommentText("");


            const data =
                await getComments(
                    post.postId
                );


            setComments(data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setPostingComment(false);

        }

    };


    // =========================================================
    // DELETE POST
    // =========================================================

    const handleDelete = async () => {

        try {

            await deletePost(
                post.postId,
                loggedUserId
            );


            setShowDeleteModal(false);

            setShowMenu(false);

            setShowMediaViewer(false);


            if (videoRef.current) {

                videoRef.current.pause();

            }


            if (sharedVideoRef.current) {

                sharedVideoRef.current.pause();

            }


            if (onDelete) {

                onDelete(
                    post.postId
                );

            }

        }

        catch (err) {

            console.log(err);

        }

    };


    // =========================================================
    // CLICK OUTSIDE MENU
    // =========================================================

    useEffect(() => {

        const handleClickOutside = (e) => {

            if (
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {

                setShowMenu(false);

            }

        };


        document.addEventListener(
            "mousedown",
            handleClickOutside
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    // =========================================================
    // SHARE
    // =========================================================

    const handleShare = async () => {

        try {

            await sharePost(
                post.postId,
                loggedUserId
            );


            if (onShare) {

                onShare();

            }


            alert(
                "Post shared successfully"
            );

        }

        catch (err) {

            console.log(err);

        }

    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="post-card">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="post-header">

                <div
                    className="post-user"
                    onClick={() =>
                        navigate(
                            `/profile/${post.userId}`
                        )
                    }
                >

                    <img
                        src={
                            post.profileImage ||
                            defaultProfile
                        }

                        alt="Profile"

                        className="post-user-image"

                        onError={(e) => {

                            e.currentTarget.src =
                                defaultProfile;

                        }}
                    />


                    <div>

                        <h3 className="post-user-name">

                            {post.fullName}

                        </h3>


                        {post.shared && (

                            <small className="shared-label">

                                Shared a post

                            </small>

                        )}

                    </div>

                </div>


                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <div className="post-right">


                    {currentUserId !== post.userId && (

                        <FollowButton
                            followerId={
                                currentUserId
                            }

                            followingId={
                                post.userId
                            }
                        />

                    )}


                    {/* =================================================
                        MENU
                    ================================================= */}

                    <div
                        className="post-menu-container"
                        ref={menuRef}
                    >

                        <BsThreeDots
                            className="post-menu"
                            onClick={() =>
                                setShowMenu(
                                    !showMenu
                                )
                            }
                        />


                        {showMenu && (

                            <div className="post-dropdown">


                                {/* DELETE + EDIT */}

                                {loggedUserId ===
                                    post.userId && (

                                    <>

                                        <button
                                            onClick={() => {

                                                setShowDeleteModal(
                                                    true
                                                );

                                                setShowMenu(
                                                    false
                                                );

                                            }}
                                        >

                                            <BsTrash />

                                            <span>
                                                Delete Post
                                            </span>

                                        </button>


                                        <button
                                            onClick={() => {

                                                setShowMenu(
                                                    false
                                                );

                                            }}
                                        >

                                            <BsPencilSquare />

                                            <span>
                                                Edit Post
                                            </span>

                                        </button>

                                    </>

                                )}


                                {/* SHARE */}

                                <button
                                    onClick={() => {

                                        if (onShare) {

                                            onShare(
                                                post.postId
                                            );

                                        }

                                        setShowMenu(
                                            false
                                        );

                                    }}
                                >

                                    <BsShare />

                                    <span>
                                        Share Post
                                    </span>

                                </button>


                                {/* COPY LINK */}

                                <button
                                    onClick={() => {

                                        const postUrl =
                                            `${window.location.origin}/post/${post.postId}`;

                                        navigator.clipboard
                                            .writeText(postUrl)
                                            .then(() => {

                                                alert(
                                                    "Post link copied"
                                                );

                                            })
                                            .catch(() => {

                                                alert(
                                                    "Unable to copy link"
                                                );

                                            });

                                        setShowMenu(
                                            false
                                        );

                                    }}
                                >

                                    <BsLink45Deg />

                                    <span>
                                        Copy Link
                                    </span>

                                </button>


                                {/* REPORT */}

                                <button
                                    onClick={() => {

                                        alert(
                                            "Report feature coming soon"
                                        );

                                        setShowMenu(
                                            false
                                        );

                                    }}
                                >

                                    <BsFlag />

                                    <span>
                                        Report
                                    </span>

                                </button>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        DELETE MODAL
                    ================================================= */}

                    {showDeleteModal && (

                        <div
                            className="delete-modal-overlay"

                            onClick={() =>
                                setShowDeleteModal(
                                    false
                                )
                            }
                        >

                            <div
                                className="delete-modal"

                                onClick={(e) =>
                                    e.stopPropagation()
                                }
                            >

                                <BsTrash
                                    className="delete-icon"
                                />


                                <h3>
                                    Delete Post
                                </h3>


                                <p>

                                    Are you sure you
                                    want to delete this
                                    post?

                                    <br />

                                    This action cannot
                                    be undone.

                                </p>


                                <div className="delete-actions">

                                    <button
                                        className="cancel-btn"

                                        onClick={() =>
                                            setShowDeleteModal(
                                                false
                                            )
                                        }
                                    >

                                        Cancel

                                    </button>


                                    <button
                                        className="delete-btn"

                                        onClick={
                                            handleDelete
                                        }
                                    >

                                        Delete

                                    </button>

                                </div>

                            </div>

                        </div>

                    )}

                </div>

            </div>


            {/* =================================================
                NORMAL POST
            ================================================= */}

            {!post.shared ? (

                <>

                    {/* TITLE */}

                    {displayPost.title && (

                        <h2 className="post-title">

                            {displayPost.title}

                        </h2>

                    )}


                    {/* CONTENT */}

                    {contentText && (

                        <>

                            <p
                                className={
                                    `post-content ${
                                        expanded
                                            ? "expanded"
                                            : "clamped"
                                    }`
                                }
                            >

                                {contentText}

                            </p>


                            {isLongContent && (

                                <button
                                    type="button"
                                    className="see-more-btn"

                                    onClick={() =>
                                        setExpanded(
                                            !expanded
                                        )
                                    }
                                >

                                    {expanded
                                        ? "See less"
                                        : "See more"
                                    }

                                </button>

                            )}

                        </>

                    )}


                    {/* =================================================
                        MEDIA
                    ================================================= */}

                    {displayPost.mediaUrl && (

                        <div
                            className="post-media-wrapper"
                            onClick={(e) => {

                                // Only image wrapper opens viewer.
                                // Video has its own click handler.
                                if (
                                    displayPost.mediaType ===
                                    "IMAGE"
                                ) {

                                    openMediaViewer();

                                }

                            }}
                        >


                            {/* IMAGE */}

                            {displayPost.mediaType ===
                                "IMAGE" && (

                                <img
                                    src={
                                        displayPost.mediaUrl
                                    }

                                    className="post-media post-media-image"

                                    alt="Post media"

                                    onError={(e) => {

                                        e.currentTarget.style.display =
                                            "none";

                                    }}
                                />

                            )}


                            {/* VIDEO */}

                            {displayPost.mediaType ===
                                "VIDEO" && (

                                <video
                                    controls

                                    ref={videoRef}

                                    className="post-media post-media-video"

                                    preload="metadata"

                                    playsInline

                                    onDoubleClick={
                                        handleVideoDoubleClick
                                    }

                                    onClick={(e) => {

                                        // Open viewer when user clicks
                                        // video area.
                                        //
                                        // If clicking native controls,
                                        // browser handles the control.
                                        if (
                                            e.target ===
                                            e.currentTarget
                                        ) {

                                            openMediaViewer();

                                        }

                                    }}
                                >

                                    <source
                                        src={
                                            displayPost.mediaUrl
                                        }

                                        type="video/mp4"
                                    />

                                    Your browser does
                                    not support the
                                    video tag.

                                </video>

                            )}

                        </div>

                    )}

                </>

            ) : (

                /* =================================================
                   SHARED POST
                ================================================= */

                <div className="shared-post-card">


                    {/* SHARED HEADER */}

                    <div className="shared-post-header">

                        <img
                            src={
                                post.originalProfileImage ||
                                defaultProfile
                            }

                            className="shared-user-image"

                            alt="Profile"

                            onError={(e) => {

                                e.currentTarget.src =
                                    defaultProfile;

                            }}
                        />


                        <div>

                            <div className="shared-user-name">

                                {post.originalPostUser}

                            </div>

                        </div>

                    </div>


                    {/* SHARED TITLE */}

                    {post.originalPostTitle && (

                        <h3 className="shared-post-title">

                            {post.originalPostTitle}

                        </h3>

                    )}


                    {/* SHARED CONTENT */}

                    {contentText && (

                        <>

                            <p
                                className={
                                    `shared-post-content ${
                                        expanded
                                            ? "expanded"
                                            : "clamped"
                                    }`
                                }
                            >

                                {contentText}

                            </p>


                            {isLongContent && (

                                <button
                                    type="button"

                                    className="see-more-btn shared-see-more"

                                    onClick={() =>
                                        setExpanded(
                                            !expanded
                                        )
                                    }
                                >

                                    {expanded
                                        ? "See less"
                                        : "See more"
                                    }

                                </button>

                            )}

                        </>

                    )}


                    {/* =================================================
                        SHARED MEDIA
                    ================================================= */}

                    {post.originalPostMediaUrl && (

                        <div
                            className="post-media-wrapper"
                            onClick={(e) => {

                                if (
                                    post.originalPostMediaType ===
                                    "IMAGE"
                                ) {

                                    openMediaViewer();

                                }

                            }}
                        >


                            {/* SHARED IMAGE */}

                            {post.originalPostMediaType ===
                                "IMAGE" && (

                                <img
                                    src={
                                        post.originalPostMediaUrl
                                    }

                                    className="post-media post-media-image"

                                    alt="Shared post media"

                                    onError={(e) => {

                                        e.currentTarget.style.display =
                                            "none";

                                    }}
                                />

                            )}


                            {/* SHARED VIDEO */}

                            {post.originalPostMediaType ===
                                "VIDEO" && (

                                <video
                                    controls

                                    ref={sharedVideoRef}

                                    className="post-media post-media-video"

                                    preload="metadata"

                                    playsInline

                                    onDoubleClick={
                                        handleVideoDoubleClick
                                    }

                                    onClick={(e) => {

                                        if (
                                            e.target ===
                                            e.currentTarget
                                        ) {

                                            openMediaViewer();

                                        }

                                    }}
                                >

                                    <source
                                        src={
                                            post.originalPostMediaUrl
                                        }

                                        type="video/mp4"
                                    />

                                    Your browser does
                                    not support the
                                    video tag.

                                </video>

                            )}

                        </div>

                    )}

                </div>

            )}


            {/* =================================================
                COUNTS
            ================================================= */}

            <div className="post-count">

                <span>

                    <FaThumbsUp
                        className="count-like"
                    />

                    {post.reactionCount}

                </span>


                <span
                    className="comment-count"

                    onClick={
                        loadComments
                    }
                >

                    <FaRegCommentDots />

                    {post.commentCount}
                    {" "}
                    Comments

                </span>

            </div>


            <hr className="post-divider" />


            {/* =================================================
                REACTION BAR
            ================================================= */}

            <ReactionBar
                post={post}

                onReact={
                    onReact
                }

                onComment={
                    loadComments
                }
            />


            {/* =================================================
                COMMENTS
            ================================================= */}

            {showComments && (

                <div className="comments-container">


                    {comments.length === 0 ? (

                        <p className="no-comments">

                            No comments yet

                        </p>

                    ) : (

                        comments.map(
                            (comment) => (

                                <div
                                    key={
                                        comment.id
                                    }

                                    className="comment-box"
                                >

                                    <img
                                        src={
                                            comment.profileImage ||
                                            defaultProfile
                                        }

                                        alt="Profile"

                                        className="comment-image"

                                        onError={(e) => {

                                            e.currentTarget.src =
                                                defaultProfile;

                                        }}

                                        onClick={() =>
                                            navigate(
                                                `/profile/${comment.userId}`
                                            )
                                        }
                                    />


                                    <div className="comment-content">

                                        <div
                                            className="comment-name"

                                            onClick={() =>
                                                navigate(
                                                    `/profile/${comment.userId}`
                                                )
                                            }
                                        >

                                            {
                                                comment.fullName
                                            }

                                        </div>


                                        <div className="comment-text">

                                            {
                                                comment.comment
                                            }

                                        </div>

                                    </div>

                                </div>

                            )
                        )

                    )}


                    {/* COMMENT INPUT */}

                    <div className="comment-input-box">

                        <input
                            type="text"

                            placeholder="Write a comment..."

                            value={
                                commentText
                            }

                            onChange={(e) =>
                                setCommentText(
                                    e.target.value
                                )
                            }

                            onKeyDown={(e) => {

                                if (
                                    e.key ===
                                    "Enter"
                                ) {

                                    handleCommentSubmit();

                                }

                            }}
                        />


                        <button
                            onClick={
                                handleCommentSubmit
                            }

                            disabled={
                                postingComment
                            }
                        >

                            {
                                postingComment
                                    ? "..."
                                    : "Post"
                            }

                        </button>

                    </div>

                </div>

            )}


            {/* =========================================================
                FULL SCREEN MEDIA VIEWER
            ========================================================= */}

            {showMediaViewer &&
                displayPost.mediaUrl && (

                <div
                    className="media-viewer-overlay"

                    ref={mediaViewerRef}

                    onClick={(e) => {

                        // Close only when clicking background
                        if (
                            e.target ===
                            e.currentTarget
                        ) {

                            closeMediaViewer();

                        }

                    }}
                >


                    {/* =================================================
                        CLOSE BUTTON
                    ================================================= */}

                    <button
                        type="button"

                        className="media-viewer-close"

                        onClick={
                            closeMediaViewer
                        }

                        aria-label="Close media viewer"
                    >

                        <BsXLg />

                    </button>


                    {/* =================================================
                        MEDIA VIEWER CONTENT
                    ================================================= */}

                    <div
                        className="media-viewer-content"

                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        {/* =================================================
                            FULL IMAGE
                        ================================================= */}

                        {displayPost.mediaType ===
                            "IMAGE" && (

                            <img
                                src={
                                    displayPost.mediaUrl
                                }

                                className="media-viewer-image"

                                alt="Full post media"

                                draggable="false"

                                onError={(e) => {

                                    e.currentTarget.style.display =
                                        "none";

                                }}
                            />

                        )}


                        {/* =================================================
                            FULL VIDEO
                        ================================================= */}

                        {displayPost.mediaType ===
                            "VIDEO" && (

                            <video
                                src={
                                    displayPost.mediaUrl
                                }

                                className="media-viewer-video"

                                controls

                                autoPlay

                                playsInline

                                preload="auto"
                            />

                        )}

                    </div>


                    {/* =================================================
                        VIEWER HINT
                    ================================================= */}

                    <div className="media-viewer-hint">

                        Press <strong>ESC</strong> or click outside to close

                    </div>

                </div>

            )}

        </div>

    );

}