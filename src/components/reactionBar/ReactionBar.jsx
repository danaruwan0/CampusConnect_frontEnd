import "./reactionBar.css";

import {
    FaRegThumbsUp,
    FaHeart,
    FaLaughSquint,
    FaRegCommentDots
} from "react-icons/fa";

export default function ReactionBar({
    post,
    onReact,
    onComment
}) {

    return (

        <div className="reaction-bar">

            <button
                className="reaction-btn"
                onClick={() => onReact(post.postId, "LIKE")}
            >
                <FaRegThumbsUp className="icon like" />
                <span>Like</span>
            </button>

            <button
                className="reaction-btn"
                onClick={() => onReact(post.postId, "LOVE")}
            >
                <FaHeart className="icon love" />
                <span>Love</span>
            </button>

            <button
                className="reaction-btn"
                onClick={() => onReact(post.postId, "HAHA")}
            >
                <FaLaughSquint className="icon haha" />
                <span>Haha</span>
            </button>

            <button
                className="reaction-btn"
                onClick={() => onComment(post.postId)}
            >
                <FaRegCommentDots className="icon comment" />
                <span>Comment</span>
            </button>

        </div>

    );

}