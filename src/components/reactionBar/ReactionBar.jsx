import "./reactionBar.css";

import {
    FaRegThumbsUp,
    FaHeart,
    FaLaughSquint,
    FaRegCommentDots
} from "react-icons/fa";

import {
    reactPost,
    removeReaction
} from "../../api/postApi";

import { useState } from "react";


export default function ReactionBar({
    post,
    onComment,
    onReact
}) {

    const userId =
        Number(localStorage.getItem("userId"));
    //upatae code 
    const [selectedReaction, setSelectedReaction] =
        useState(post.userReaction || null);

const handleReaction = async (type) => {
    try {
        if (selectedReaction === type) {

            await removeReaction(
                post.postId,
                userId
            );

            setSelectedReaction(null);

            if (onReact) {
                onReact(
                    post.postId,
                    null,
                    true,
                    selectedReaction
                );
            }

        } else {

            await reactPost(
                post.postId,
                userId,
                type
            );

            const previousReaction = selectedReaction;

            setSelectedReaction(type);

            if (onReact) {
                onReact(
                    post.postId,
                    type,
                    false,
                    previousReaction
                );
            }
        }

    } catch (err) {
        console.log(err);
    }
};


    return (

        <div className="reaction-bar">

            {/* =========================
                LIKE
            ========================== */}

            <button

                className={
                    selectedReaction === "LIKE"
                        ? "reaction-btn active"
                        : "reaction-btn"
                }

                onClick={() =>
                    handleReaction("LIKE")
                }

            >

                <FaRegThumbsUp />

                <span>
                    Like
                </span>

            </button>


            {/* =========================
                LOVE
            ========================== */}

            <button

                className={
                    selectedReaction === "LOVE"
                        ? "reaction-btn active"
                        : "reaction-btn"
                }

                onClick={() =>
                    handleReaction("LOVE")
                }

            >

                <FaHeart />

                <span>
                    Love
                </span>

            </button>


            {/* =========================
                HAHA
            ========================== */}

            <button

                className={
                    selectedReaction === "HAHA"
                        ? "reaction-btn active"
                        : "reaction-btn"
                }

                onClick={() =>
                    handleReaction("HAHA")
                }

            >

                <FaLaughSquint />

                <span>
                    Haha
                </span>

            </button>


            {/* =========================
                COMMENT
            ========================== */}

            <button

                className="reaction-btn"

                onClick={onComment}

            >

                <FaRegCommentDots />

                <span>
                    Comment
                </span>

            </button>

        </div>

    );

}