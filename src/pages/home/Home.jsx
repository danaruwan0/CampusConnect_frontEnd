import React, { useEffect, useState } from "react";
import "./home.css";
import Navbar from "../../components/navbar/Navbar";
import SideNavBar from "../../components/sideNavBar/SideNavBar";
import PostCard from "../../components/postCard/PostCard";
import CreatePostModal from "../../components/createPost/CreatePostModal";

import { getFeed, reactPost, sharePost } from "../../api/postApi";
import { getSuggestions, followUser } from "../../api/followApi";
import noSuggestions from "../../assets/No suggestions.png";

import Loader from "../../components/loader/Loader";
import Suggestion from "../../components/suggestion/Suggestion";

export default function Home() {


    const userId =
        Number(localStorage.getItem("userId"));

    // ==========================
    // STATES
    // ==========================

    const [feed, setFeed] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(false);
    const [showCreatePost, setShowCreatePost] = useState(false);

    // LOAD HOME DATA

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {

        try {

            setLoading(true);
            const [
                posts,
                users
            ] = await Promise.all([
                getFeed(),
                getSuggestions(userId)

            ]);

            setFeed(posts || []);
            setSuggestions(users || []);

        } catch (error) {

            console.log(
                "HOME LOAD ERROR : ",
                error
            );

        } finally {
            setLoading(false);

        }

    };


    // FOLLOW USER

    const handleFollow = async (targetId) => {

        try {
            await followUser(
                userId,
                targetId
            );
            loadData();

        } catch (error) {

            console.log(error);

        }

    };

    // ==========================
    // REACTION
    // ==========================

    const handleReact = async (
        postId,
        type
    ) => {


        try {

            await reactPost(
                postId,
                userId,
                type
            );

            setFeed(prev =>

                prev.map(post =>

                    post.postId === postId

                        ?

                        {
                            ...post,

                            reactionCount:
                                (post.reactionCount || 0) + 1

                        }
                        :
                        post

                )

            );



        } catch (error) {
            console.log(error);
        }

    };

    // ==========================
    // SHARE POST
    // ==========================

    const handleShare = async (postId) => {

        try {
            await sharePost(
                postId,
                userId
            );

            loadData();

        } catch (error) {

            console.log(error);

        }


    };

    // ==========================
    // COMMENT PLACEHOLDER
    // ==========================

    const handleComment = () => { };

    // ==========================
    // LOADING UI
    // ==========================

    if (loading) {


        return (

            <>
                <Navbar
                    onCreatePost={() =>
                        setShowCreatePost(true)
                    }

                    onMenuClick={() =>
                        setShowMenu(true)
                    }

                />

                <div className="loading-text">

                    {/* Loading feed... */}

                    <Loader
                        text="Loading Feed..."
                    />

                </div>

            </>

        );

    }


    return (

        <div className="home-page">

            {/* ======================
                 NAVBAR
            ======================= */}

            <Navbar

                onCreatePost={() =>
                    setShowCreatePost(true)
                }


                onMenuClick={() =>
                    setShowMenu(true)
                }

            />

            {/* ======================
                 MOBILE OVERLAY
            ======================= */}


            {
                showMenu &&

                <div

                    className="sidebar-overlay"

                    onClick={() =>
                        setShowMenu(false)
                    }

                />

            }



            {/* ======================
                 MAIN CONTENT
            ======================= */}


            <Suggestion />

            <div className="home-container">


                {/* ======================
                     LEFT SIDEBAR
                ======================= */}


                <aside className={`left-card ${showMenu ? "show" : ""}`}>

                    <SideNavBar
                        open={showMenu}
                        onClose={() => setShowMenu(false)}
                    />

                </aside>

                {/* ======================
                     FEED
                ======================= */}


                <main className="feed">


                    {
                        feed.length === 0

                            ?

                            (

                                <div className="empty-feed">

                                    <h3>
                                        No Posts Yet
                                    </h3>

                                    <p>
                                        Start sharing something with your campus community.
                                    </p>


                                </div>


                            )

                            :

                            feed.map(post => (


                                <PostCard

                                    key={
                                        post.postId
                                    }

                                    post={post}

                                    currentUserId={
                                        userId
                                    }

                                    onReact={
                                        handleReact
                                    }

                                    onComment={
                                        handleComment
                                    }

                                    onShare={
                                        handleShare
                                    }
                                />
                            ))
                    }
                </main>


                {/* ======================
                     RIGHT PANEL
                ======================= */}

                <aside className="right-card">

                    <h3>
                        People You May Know
                    </h3>

                    <div className="suggestions-list">

                        {
                            suggestions.length === 0

                                ?

                                (
                                    <div className="no-suggestions">

                                        <img
                                            src={noSuggestions}
                                            alt="No Suggestions"
                                            className="no-suggestions-img"
                                        />

                                        <h4>
                                            No Suggestions
                                        </h4>

                                        <p>
                                            You're connected with everyone for now.
                                        </p>

                                    </div>
                                )

                                :

                                suggestions.map(user => (

                                    <div
                                        className="suggestion"
                                        key={user.userId}
                                    >

                                        <div>

                                            <p>
                                                {user.fullName}
                                            </p>

                                            <small>
                                                {user.email}
                                            </small>

                                        </div>

                                        <button
                                            onClick={() =>
                                                handleFollow(user.userId)
                                            }
                                        >
                                            Follow
                                        </button>

                                    </div>

                                ))
                        }

                    </div>

                </aside>
            </div>

            {/* ======================
                 CREATE POST
            ======================= */}
            <CreatePostModal

                open={
                    showCreatePost
                }

                onClose={() =>
                    setShowCreatePost(false)
                }

                onSuccess={() => {
                    loadData();
                    setShowCreatePost(false);
                }}
            />
        </div>

    );

}