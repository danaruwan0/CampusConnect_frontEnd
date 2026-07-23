import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/navbar/Navbar";
import "./editProfile.css";

import defaultProfile from "../../assets/Default profile.jpg";

import { getProfile, updateProfile, uploadProfileImage, uploadCoverImage } from "../../api/profileApi";

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

    //majors dropdown valuves
    const majors = [
        "HDIT Batch 1",
        "HDIT Batch 2",
        "HDIT Batch 3",
        "QS Batch 1",
        "QS Batch 2",
        "QS Batch 3",
        "CBIT Batch 1",
        "CBIT Batch 2"
    ];

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        major: "",
        batchYear: "",
        university: "",
        location: "",
        phone: "",
        bio: "",
        skills: "",
        githubUrl: "",
        linkedinUrl: "",
        website: ""
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
                major: data.major || "",
                batchYear: data.batchYear || "",
                university: data.university || "",
                location: data.location || "",
                phone: data.phone || "",
                bio: data.bio || "",
                skills: data.skills || "",
                githubUrl: data.githubUrl || "",
                linkedinUrl: data.linkedinUrl || "",
                website: data.website || ""

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
                batchYear: formData.batchYear,

                university: formData.university,
                location: formData.location,
                phone: formData.phone,
                skills: formData.skills,
                githubUrl: formData.githubUrl,
                linkedinUrl: formData.linkedinUrl,
                website: formData.website

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
                        <label>Campus Email</label>

                        <input
                            type="email"
                            value={formData.email}
                            disabled
                        />

                        <small className="field-note">
                            This is your verified campus email and cannot be changed.
                        </small>
                    </div>

                    <div className="form-group">

                        <label>
                            Major
                        </label>


                        <select
                            name="major"
                            value={formData.major}
                            onChange={handleChange}
                            className="select-input"
                        >

                            <option value="">
                                Select Your Major
                            </option>


                            {majors.map((major, index) => (
                                <option
                                    key={index}
                                    value={major}
                                >
                                    {major}
                                </option>
                            ))}


                        </select>

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

                    {/* //new add part */}

                    <div className="form-group">
                        <label>University</label>

                        <input
                            type="text"
                            name="university"
                            value={formData.university}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Location</label>

                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>

                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Skills</label>

                        <input
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder="Java, React, Spring Boot"
                        />
                    </div>

                    <div className="form-group">
                        <label>GitHub</label>

                        <input
                            type="url"
                            name="githubUrl"
                            value={formData.githubUrl}
                            onChange={handleChange}
                            placeholder="https://github.com/username"
                        />
                    </div>

                    <div className="form-group">
                        <label>LinkedIn</label>

                        <input
                            type="url"
                            name="linkedinUrl"
                            value={formData.linkedinUrl}
                            onChange={handleChange}
                            placeholder="https://linkedin.com/in/username"
                        />
                    </div>

                    <div className="form-group">
                        <label>Portfolio Website</label>

                        <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="https://yourwebsite.com"
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