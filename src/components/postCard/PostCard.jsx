import React, { useState, useRef, useEffect } from "react";
import "./postCard.css";
import ReactionBar from "../reactionBar/ReactionBar";
import FollowButton from "../followButton/FollowButton";
import { getComments, addComment, deletePost, sharePost } from "../../api/postApi";
import defaultProfile from "../../assets/Default profile.jpg";
import { FaThumbsUp, FaRegCommentDots } from "react-icons/fa";
import { BsThreeDots, BsTrash, BsPencilSquare, BsLink45Deg, BsFlag, BsShare } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function PostCard({
    post,
    currentUserId,
    onReact,
    onComment,
    onDelete,
    onShare
}) {

    const [showComments, setShowComments] = useState(false);

    const [comments, setComments] = useState([]);


    const [commentText, setCommentText] = useState("");

    const loggedUserId = Number(localStorage.getItem("userId"));

    const [postingComment, setPostingComment] = useState(false);

    const [expanded, setExpanded] = useState(false);

    //ew addd
    const videoRef = useRef(null);

    //menu 
    const [showMenu, setShowMenu] = useState(false);

    //delete modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleVideoDoubleClick = (e) => {
        const video = videoRef.current;
        if (!video) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;

        if (clickX < rect.width / 2) {
            video.currentTime = Math.max(0, video.currentTime - 10);
        } else {
            video.currentTime = Math.min(
                video.duration,
                video.currentTime + 10
            );
        }
    };

    const loadComments = async () => {

        try {

            if (!showComments) {

                const data = await getComments(post.postId);
                setComments(data);
            }
            setShowComments(!showComments);
        }

        catch (err) {
            console.log(err);
        }

    };


    const navigate = useNavigate();


    const handleCommentSubmit = async () => {

        if (!commentText.trim()) return;

        try {

            setPostingComment(true);

            await addComment(

                post.postId,

                loggedUserId,

                commentText

            );

            setCommentText("");
            const data = await getComments(post.postId);
            setComments(data);
        }

        catch (err) {

            console.log(err);

        }

        finally {

            setPostingComment(false);

        }

    };


    const handleDelete = async () => {
        try {

            await deletePost(post.postId, loggedUserId);

            setShowDeleteModal(false);
            setShowMenu(false);

            if (onDelete) {
                onDelete(post.postId);
            }

        } catch (err) {
            console.log(err);
        }
    };

    //menu ref
    const menuRef = useRef(null);


    // Click outside to close menu
    useEffect(() => {

        const handleClickOutside = (e) => {

            if (
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setShowMenu(false);
            }

        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);


    //
    const handleShare = async () => {

        try {
            await sharePost(post.postId, loggedUserId);
            if (onShare) {
                onShare();
            }
            alert("Post shared successfully");

        } catch (err) {
            console.log(err);
        }
    };


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

    return (

        <div className="post-card">
            <div className="post-header">
                <div className="post-user" onClick={() => navigate(`/profile/${post.userId}`)}   >
                    <img
                        src={post.profileImage || defaultProfile}
                        alt="Profile"
                        className="post-user-image"
                        onClick={() => navigate(`/profile/${post.userId}`)}
                        onError={(e) => {
                            e.target.src = defaultProfile;
                        }}
                    />

                    <div>
                        <h3
                            className="post-user-name"
                            onClick={() => navigate(`/profile/${post.userId}`)}
                        >
                            {post.fullName}
                        </h3>

                        {post.shared && (
                            <small className="shared-label">
                                Shared a post
                            </small>
                        )}
                    </div>
                </div>

                <div className="post-right">

                    {currentUserId !== post.userId && (
                        <FollowButton
                            followerId={currentUserId}
                            followingId={post.userId}
                        />
                    )}

                    <div className="post-menu-container" ref={menuRef}>

                        <BsThreeDots
                            className="post-menu"
                            onClick={() => setShowMenu(!showMenu)}
                        />

                        {showMenu && (
                            <div className="post-dropdown">

                                {loggedUserId === post.userId && (
                                    <>
                                        <button
                                            onClick={() => {
                                                setShowDeleteModal(true);
                                                setShowMenu(false);
                                            }}
                                        >
                                            <BsTrash />
                                            <span>Delete Post</span>
                                        </button>

                                        <button>
                                            <BsPencilSquare />
                                            <span>Edit Post</span>
                                        </button>
                                    </>
                                )}
                                {/* add post share button and icon */}
                                <button
                                    onClick={() => {

                                        if (onShare) {
                                            onShare(post.postId);
                                        }

                                        setShowMenu(false);
                                    }}
                                >
                                    <BsShare />
                                    <span>Share Post</span>
                                </button>

                                <button>
                                    <BsLink45Deg />
                                    <span>Copy Link</span>
                                </button>

                                <button>
                                    <BsFlag />
                                    <span>Report</span>
                                </button>




                            </div>
                        )}

                    </div>

                    {/* DELETE MODAL */}
                    {showDeleteModal && (

                        <div
                            className="delete-modal-overlay"
                            onClick={() => setShowDeleteModal(false)}
                        >

                            <div
                                className="delete-modal"
                                onClick={(e) => e.stopPropagation()}
                            >

                                <BsTrash className="delete-icon" />

                                <h3>Delete Post</h3>

                                <p>
                                    Are you sure you want to delete this post?
                                    <br />
                                    This action cannot be undone.
                                </p>

                                <div className="delete-actions">

                                    <button
                                        className="cancel-btn"
                                        onClick={() => setShowDeleteModal(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        </div>

                    )}

                </div>

            </div>


            {!post.shared ? (
                <>
                    {/* new add */}
                    {post.shared && (

                        <div className="shared-post-card">

                            <div className="shared-header">

                                <img
                                    src={post.originalProfileImage || defaultProfile}
                                    className="shared-profile"
                                    alt=""
                                />

                                <div>

                                    <div className="shared-user-name">
                                        {post.originalPostUser}
                                    </div>

                                </div>

                            </div>

                        </div>

                    )}




                    {displayPost.title && (

                        <h2 className="post-title">

                            {displayPost.title}

                        </h2>

                    )}

                    <p
                        className={`post-content ${expanded ? "expanded" : "clamped"
                            }`}
                    >
                        {displayPost.content}
                    </p>

                    {displayPost.mediaUrl && (
                        <div className="post-media-wrapper">

                            {post.mediaType === "IMAGE" && (
                                <img
                                    // src={post.mediaUrl}
                                    src={displayPost.mediaUrl}

                                    className="post-media"
                                    alt=""
                                />
                            )}

                            {post.mediaType === "VIDEO" && (
                                <video
                                    controls
                                    ref={videoRef}
                                    className="post-media"
                                >
                                    <source
                                        // src={post.mediaUrl}
                                        src={displayPost.mediaUrl}
                                        type="video/mp4"
                                    />
                                </video>
                            )}

                        </div>
                    )}
                </>
            ) : (

                <div className="shared-post-card">

                    <div className="shared-post-header">

                        <img
                            src={
                                post.originalProfileImage ||
                                defaultProfile
                            }
                            className="shared-user-image"
                            alt=""
                        />

                        <div>

                            <div className="shared-user-name">
                                {post.originalPostUser}
                            </div>

                        </div>

                    </div>

                    {post.originalPostTitle && (
                        <h3 className="shared-post-title">
                            {post.originalPostTitle}
                        </h3>
                    )}

                    <p className="shared-post-content">
                        {post.originalPostContent}
                    </p>

                    {post.originalPostMediaUrl && (

                        <div className="post-media-wrapper">

                            {post.originalPostMediaType ===
                                "IMAGE" && (
                                    <img
                                        src={post.originalPostMediaUrl}
                                        className="post-media"
                                        alt=""
                                    />
                                )}

                            {post.originalPostMediaType ===
                                "VIDEO" && (
                                    <video controls className="post-media">
                                        <source
                                            src={post.originalPostMediaUrl}
                                            type="video/mp4"
                                        />
                                    </video>
                                )}

                        </div>

                    )}

                </div>
            )}



            <div className="post-count">

                <span>
                    <FaThumbsUp className="count-like" />
                    {post.reactionCount}
                </span>

                <span
                    className="comment-count"
                    onClick={loadComments}
                >
                    <FaRegCommentDots />
                    {post.commentCount} Comments
                </span>

            </div>

            <hr className="post-divider" />


            <ReactionBar

                post={post}

                onReact={onReact}

                onComment={loadComments}

            />

            {

                showComments && (

                    <div className="comments-container">

                        {

                            comments.length === 0 ?

                                (

                                    <p className="no-comments">

                                        No comments yet

                                    </p>

                                )

                                :

                                (

                                    comments.map(comment => (

                                        <div
                                            key={comment.id}
                                            className="comment-box"

                                        >

                                            <img
                                                src={comment.profileImage || defaultProfile}
                                                alt=""
                                                className="comment-image"
                                                onError={(e) => {
                                                    e.target.src = defaultProfile;
                                                }}

                                                onClick={() => navigate(`/profile/${comment.userId}`)}
                                            />

                                            <div className="comment-content">

                                                <div
                                                    className="comment-name"
                                                    onClick={() => navigate(`/profile/${comment.userId}`)}
                                                >
                                                    {comment.fullName}
                                                </div>

                                                <div className="comment-text">
                                                    {comment.comment}
                                                </div>

                                            </div>

                                        </div>

                                    ))

                                )
                        }

                        {/* //////////// */}
                        <div className="comment-input-box">

                            <input

                                type="text"

                                placeholder="Write a comment..."

                                value={commentText}

                                onChange={(e) =>
                                    setCommentText(e.target.value)
                                }

                                onKeyDown={(e) => {

                                    if (e.key === "Enter") {

                                        handleCommentSubmit();

                                    }

                                }}

                            />

                            <button

                                onClick={handleCommentSubmit}

                                disabled={postingComment}

                            >

                                {postingComment ? "..." : "Post"}

                            </button>

                        </div>

                    </div>

                )

            }
        </div>
    );

}