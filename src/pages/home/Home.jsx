import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import "./home.css";

// import { getFeed } from "../../api/postApi";
import { getFeed, reactPost, removeReaction, sharePost } from "../../api/postApi";
import { getSuggestions, followUser } from "../../api/followApi";
import { getProfile } from "../../api/profileApi";
import PostCard from "../../components/postCard/PostCard";

// defaultProfile image
import defaultProfile from "../../assets/Default profile.jpg";
import noSuggestions from "../../assets/No suggestions.png";



export default function Home() {

    const userId = Number(localStorage.getItem("userId"));

    const [profile, setProfile] = useState(null);
    const [feed, setFeed] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleComment = () => { };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {

            console.log("USER ID:", userId);

            setLoading(true);

            const [p, f, s] = await Promise.all([
                getProfile(userId),
                getFeed(),
                getSuggestions(userId)
            ]);

            console.log("PROFILE :", p);

            setProfile(p);
            setFeed(f || []);
            setSuggestions(s || []);

        } catch (err) {
            console.log("HOME LOAD ERROR:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async (targetId) => {
        try {
            await followUser(userId, targetId);
            loadData();
        } catch (err) {
            console.log(err);
        }
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <h3 style={{ textAlign: "center", marginTop: "50px" }}>
                    Loading feed...
                </h3>
            </div>
        );
    }

    console.log("USER ID:", userId);

    const handleReact = async (postId, type) => {

        try {

            await reactPost(postId, userId, type);

            setFeed(prevFeed =>

                prevFeed.map(post =>

                    post.postId === postId
                        ? {
                            ...post,
                            reactionCount: post.reactionCount + 1
                        }
                        : post

                )

            );

        } catch (err) {

            console.log(err);

        }

    };



    //new 
    const handleShare = async (postId) => {

        try {

            await sharePost(postId, userId);

            loadData();

        } catch (err) {

            console.log(err);

        }

    };


    return (
        <div>
            <Navbar />

            <div className="home-container">

                {/* LEFT PROFILE */}
                <div className="left-card">



                    <img
                        src={profile?.profileImage || defaultProfile}
                        alt="profile"
                        className="profile-img"
                        onError={(e) => {
                            e.target.src = defaultProfile;
                        }}
                    />

                    <h3>{profile?.fullName}</h3>
                    <p>{profile?.email}</p>

                    <p style={{ fontSize: "13px", color: "gray" }}>
                        {profile?.major || "Student"}
                    </p>

                </div>

                {/* FEED */}

                {/* FEED */}
                <div className="feed">

                    {feed.map(post => (

                        <PostCard
                            key={post.postId}
                            post={post}
                            currentUserId={userId}
                            onReact={handleReact}
                            onComment={handleComment}
                            // onShare={loadFeed}
                            onShare={handleShare}
                        />

                    ))}

                </div>



                {/* RIGHT SUGGESTIONS */}
                <div className="right-card">

                    {/* <div className="left-card"> */}



                        {/* <img
                            src={profile?.profileImage || defaultProfile}
                            alt="profile"
                            className="profile-img"
                            onError={(e) => {
                                e.target.src = defaultProfile;
                            }}
                        />

                        <h3>{profile?.fullName}</h3>
                        <p>{profile?.email}</p>

                        <p style={{ fontSize: "13px", color: "gray" }}>
                            {profile?.major || "Student"}
                        </p> */}

                    {/* </div> */}


                    <h3>People You May Know</h3>

                    {suggestions.length === 0 ? (

                        <div className="no-suggestions">

                            <img
                                src={noSuggestions}
                                alt="No Suggestions"
                                className="no-suggestions-img"
                            />


                            <h4>No Suggestions</h4>

                            <p>
                                You're connected with everyone for now.
                            </p>

                        </div>



                    ) : (

                        suggestions.map(user => (

                            <div key={user.userId} className="suggestion">

                                <div>

                                    <p style={{ margin: 0 }}>
                                        {user.fullName}
                                    </p>

                                    <small>{user.email}</small>

                                </div>

                                <button
                                    onClick={() => handleFollow(user.userId)}
                                >
                                    Follow
                                </button>

                            </div>

                        ))

                    )}


                </div>

            </div>
        </div>
    );
}