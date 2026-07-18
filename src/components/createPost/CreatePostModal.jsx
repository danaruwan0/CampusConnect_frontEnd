import React, { useEffect, useState } from "react";

import "./createPostModal.css";
import defaultProfile from "../../assets/Default profile.jpg";

import { createPost } from "../../api/postApi";
import { getProfile } from "../../api/profileApi";

import {
    FaTimes,
    FaImage,
    FaVideo,
    FaPaperPlane,
    FaTrash
} from "react-icons/fa";

export default function CreatePostModal({

    open,
    onClose,
    onSuccess

}) {

    const userId = Number(localStorage.getItem("userId"));

    const [profile, setProfile] = useState(null);

    const [title, setTitle] = useState("");

    const [content, setContent] = useState("");

    const [file, setFile] = useState(null);

    const [preview, setPreview] = useState("");

    const [fileType, setFileType] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (open) {

            loadProfile();

        }

    }, [open]);

    const loadProfile = async () => {

        try {

            const data = await getProfile(userId);

            setProfile(data);

        } catch (err) {

            console.log(err);

        }

    };

    const handleFile = (e) => {

        const selected = e.target.files[0];

        if (!selected) return;

        setFile(selected);

        const objectUrl = URL.createObjectURL(selected);

        setPreview(objectUrl);

        if (selected.type.startsWith("image")) {

            setFileType("image");

        } else if (selected.type.startsWith("video")) {

            setFileType("video");

        }

    };

    const removeFile = () => {

        if (preview) {

            URL.revokeObjectURL(preview);

        }

        setFile(null);

        setPreview("");

        setFileType("");

    };

    const resetForm = () => {

        if (preview) {

            URL.revokeObjectURL(preview);

        }

        setTitle("");

        setContent("");

        setFile(null);

        setPreview("");

        setFileType("");

    };

    const handleSubmit = async () => {

        if (

            !title.trim() &&
            !content.trim() &&
            !file

        ) {

            alert("Please write something or upload image/video.");

            return;

        }

        try {

            setLoading(true);

            await createPost(

                userId,
                title,
                content,
                file

            );

            alert("Post Created Successfully!");

            resetForm();

            onSuccess();

            onClose();

        } catch (err) {

            console.log(err);

            alert("Failed to create post.");

        } finally {

            setLoading(false);

        }

    };

    if (!open) return null;

    return (
        <div
            className="create-post-overlay"
            onClick={() => {
                resetForm();
                onClose();
            }}
        >
            <div
                className="create-post-modal"
                onClick={(e) => e.stopPropagation()}
            >

                {/* HEADER */}
                <div className="create-post-header">
                    <h2>Create New Post</h2>

                    <button
                        className="close-btn"
                        onClick={() => {
                            resetForm();
                            onClose();
                        }}
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* USER */}
                <div className="create-post-user">
                    <img
                        src={profile?.profileImage || defaultProfile}
                        alt="profile"
                    />

                    <div>
                        <h4>{profile?.fullName}</h4>
                        <span>Public Post</span>
                    </div>
                </div>

                {/* TITLE */}
                <input
                    className="post-title"
                    type="text"
                    placeholder="Post title (Optional)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                {/* CONTENT */}
                <textarea
                    className="post-content"
                    rows="6"
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                {/* PREVIEW */}
                {preview && (
                    <div className="preview-box">

                        {fileType === "image" ? (
                            <img src={preview} alt="preview" />
                        ) : (
                            <video controls src={preview} />
                        )}

                        <button
                            className="remove-media-btn"
                            onClick={removeFile}   // ✅ FIXED
                        >
                            <FaTrash />
                        </button>

                    </div>
                )}

                {/* UPLOAD */}
                <label className="upload-area">
                    <input
                        hidden
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFile}
                    />

                    <div className="upload-icons">
                        <FaImage />
                        <FaVideo />
                    </div>

                    <p>
                        {file ? file.name : "Click to upload Image or Video"}
                    </p>
                </label>

                {/* BUTTONS */}
                <div className="post-buttons">

                    <button
                        className="cancel-post"
                        onClick={() => {
                            resetForm();
                            onClose();
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        className="submit-post"
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {loading ? "Posting..." : (
                            <>
                                <FaPaperPlane /> Create Post
                            </>
                        )}
                    </button>

                </div>

            </div>
        </div>
    );

}


