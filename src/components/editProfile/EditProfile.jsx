import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/navbar/Navbar";
import "./editProfile.css";

import defaultProfile from "../../assets/Default profile.jpg";

import {
    getProfile,
    updateProfile,
    uploadProfileImage,
    uploadCoverImage
} from "../../api/profileApi";

export default function EditProfile() {

    const navigate = useNavigate();

    const userId = Number(localStorage.getItem("userId"));

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [profileImageFile, setProfileImageFile] = useState(null);
    const [coverImageFile, setCoverImageFile] = useState(null);

    const [profilePreview, setProfilePreview] = useState(defaultProfile);

    const [coverPreview, setCoverPreview] = useState(
        "https://images.unsplash.com/photo-1503264116251-35a269479413"
    );

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        bio: "",
        major: "",
        batchYear: ""
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {

        try {

            setLoading(true);

            const data = await getProfile(userId);

            setFormData({
                fullName: data.fullName || "",
                email: data.email || "",
                bio: data.bio || "",
                major: data.major || "",
                batchYear: data.batchYear || ""
            });

            if (data.profileImage) {
                setProfilePreview(data.profileImage);
            }

            if (data.coverImage) {
                setCoverPreview(data.coverImage);
            }

        } catch (err) {

            console.log(err);
            alert("Failed to load profile.");

        } finally {

            setLoading(false);

        }

    };

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleProfileImage = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setProfileImageFile(file);

        setProfilePreview(URL.createObjectURL(file));

    };

    const handleCoverImage = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setCoverImageFile(file);

        setCoverPreview(URL.createObjectURL(file));

    };

    const saveProfile = async () => {

        try {

            setSaving(true);

            await updateProfile(userId, {

                fullName: formData.fullName,
                bio: formData.bio,
                major: formData.major,
                batchYear: formData.batchYear

            });

            if (profileImageFile) {

                const formDataImage = new FormData();

                formDataImage.append("file", profileImageFile);

                await uploadProfileImage(userId, formDataImage);

            }

            if (coverImageFile) {

                const formDataCover = new FormData();

                formDataCover.append("file", coverImageFile);

                await uploadCoverImage(userId, formDataCover);

            }

            alert("Profile Updated Successfully");

            navigate("/profile");

        } catch (err) {

            console.log(err);

            alert("Failed To Update Profile");

        } finally {

            setSaving(false);

        }

    };

    if (loading) {

        return (
            <>
                <Navbar />

                <div style={{ textAlign: "center", marginTop: "100px" }}>
                    <h2>Loading...</h2>
                </div>
            </>
        );

    }

    return (

        <>
            <Navbar />

            <div className="edit-profile-container">

                <div className="cover-section">

                    <img
                        src={coverPreview}
                        alt="Cover"
                        className="cover-preview"
                    />

                    <label className="upload-btn">

                        Change Cover Image

                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleCoverImage}
                        />

                    </label>

                </div>

                <div className="profile-section">

                    <img
                        src={profilePreview}
                        alt="Profile"
                        className="profile-preview"
                        onError={(e) => {
                            e.target.src = defaultProfile;
                        }}
                    />

                    <label className="upload-btn">

                        Change Profile Image

                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleProfileImage}
                        />

                    </label>

                </div>

                <div className="edit-form">

                    <div className="form-group">

                        <label>Full Name</label>

                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-group">

                        <label>Email</label>

                        <input
                            type="email"
                            value={formData.email}
                            disabled
                        />

                    </div>

                    <div className="form-group">

                        <label>Major</label>

                        <input
                            type="text"
                            name="major"
                            value={formData.major}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-group">

                        <label>Batch Year</label>

                        <input
                            type="text"
                            name="batchYear"
                            value={formData.batchYear}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-group">

                        <label>Bio</label>

                        <textarea
                            rows="5"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="button-group">

                        <button
                            className="save-btn"
                            onClick={saveProfile}
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>

                        <button
                            className="cancel-btn"
                            onClick={() => navigate("/profile")}
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            </div>

        </>

    );

}