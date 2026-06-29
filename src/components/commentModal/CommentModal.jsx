import React, {
    useEffect,
    useState
} from "react";

import {
    getComments
} from "../../api/postApi";

export default function CommentModal({
    postId,
    open,
    onClose
}) {

    const [comments, setComments] =
        useState([]);

    useEffect(() => {

        if (open && postId) {
            loadComments();
        }

    }, [open, postId]);

    const loadComments = async () => {

        try {

            const data =
                await getComments(postId);

            setComments(data);

        } catch (err) {

            console.log(err);

        }
    };

    if (!open) return null;

    return (

        <div className="modal">

            <div className="modal-content">

                <h3>Comments</h3>

                {comments.map(comment => (

                    <div key={comment.id}>

                        <b>
                            {comment.user.fullName}
                        </b>

                        <p>
                            {comment.comment}
                        </p>

                    </div>

                ))}

                <button
                    onClick={onClose}
                >
                    Close
                </button>

            </div>

        </div>

    );
}