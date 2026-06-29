import React, { useState } from "react";
import "./postCard.css";

import ReactionBar from "../reactionBar/ReactionBar";
import FollowButton from "../followButton/FollowButton";

import { getComments } from "../../api/postApi";

import defaultProfile from "../../assets/Default profile.jpg";

import {
    FaThumbsUp,
    FaRegCommentDots
} from "react-icons/fa";

import {
    BsThreeDots
} from "react-icons/bs";

import { useNavigate } from "react-router-dom";


export default function PostCard({

    post,
    currentUserId,
    onReact,
    onComment

}) {

    const [showComments, setShowComments] = useState(false);

    const [comments, setComments] = useState([]);


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

                    </div>

                </div>

                <div className="post-right">

                    {currentUserId !== post.userId && (

                        <FollowButton

                            followerId={currentUserId}

                            followingId={post.userId}

                        />

                    )}

                    <BsThreeDots className="post-menu" />

                </div>

            </div>


            {post.title && (

                <h2 className="post-title">

                    {post.title}

                </h2>

            )}

            <p className="post-content">

                {post.content}

            </p>


            {post.mediaType === "IMAGE" && (

                <img

                    src={post.mediaUrl}

                    alt=""

                    className="post-media"

                />

            )}

            {post.mediaType === "VIDEO" && (

                <video

                    controls

                    className="post-media"

                >

                    <source

                        src={post.mediaUrl}

                        type="video/mp4"

                    />

                </video>

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

                                                <div className="comment-name">
                                                    {comment.fullName}
                                                    onClick={() => navigate(`/profile/${comment.userId}`)}
                                                </div>

                                                <div className="comment-text">
                                                    {comment.comment}
                                                </div>

                                            </div>

                                        </div>

                                    ))

                                )

                        }

                    </div>

                )

            }
        </div>



    );

}