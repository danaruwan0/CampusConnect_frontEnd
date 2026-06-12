import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import "./home.css";

import {
  FiTrendingUp,
  FiMessageCircle,
  FiBookmark,
  FiUser,
  FiHeart,
  FiMessageSquare,
  FiSend
} from "react-icons/fi";

import {
  FaThumbsUp,
  FaHeart,
  FaLaughSquint,
  FaSadTear,
  FaAngry
} from "react-icons/fa";

export default function Home() {
  const [activeReaction, setActiveReaction] = useState({});

  const posts = [
    {
      id: 1,
      user: "Kasun Perera",
      time: "2 hours ago",
      category: "React / Tech",
      text: "React project progress update 🚀",
      image: "https://picsum.photos/800/500?random=1"
    },
    {
      id: 2,
      user: "Nimal Silva",
      time: "3 hours ago",
      category: "Education",
      text: "Campus life moment 🎓",
      image: "https://picsum.photos/800/500?random=2"
    },
    {
      id: 3,
      user: "Amal Fernando",
      time: "5 hours ago",
      category: "Java",
      text: "Java OOP concepts revision ☕",
      image: "https://picsum.photos/800/500?random=3"
    },
    {
      id: 4,
      user: "Tharushi",
      time: "6 hours ago",
      category: "UI/UX",
      text: "New UI design inspiration 🎨",
      image: "https://picsum.photos/800/500?random=4"
    },
    {
      id: 5,
      user: "Sandun",
      time: "7 hours ago",
      category: "Hackathon",
      text: "Hackathon registration open 💻",
      image: "https://picsum.photos/800/500?random=5"
    },
    {
      id: 6,
      user: "Rashmi",
      time: "8 hours ago",
      category: "Exam",
      text: "Exam preparation tips 📚",
      image: "https://picsum.photos/800/500?random=6"
    },
    {
      id: 7,
      user: "Kavindu",
      time: "9 hours ago",
      category: "HTML/CSS",
      text: "Frontend basics revision 🌐",
      image: "https://picsum.photos/800/500?random=7"
    },
    {
      id: 8,
      user: "Dilshan",
      time: "10 hours ago",
      category: "Group Study",
      text: "Study group session 👨‍🎓",
      image: "https://picsum.photos/800/500?random=8"
    },
    {
      id: 9,
      user: "Pabasara",
      time: "12 hours ago",
      category: "Project",
      text: "Final year project ideas 💡",
      image: "https://picsum.photos/800/500?random=9"
    },
    {
      id: 10,
      user: "Nadeesha",
      time: "1 day ago",
      category: "Presentation",
      text: "Project presentation done 🎤",
      image: "https://picsum.photos/800/500?random=10"
    }
  ];

  const setReaction = (postId, reaction) => {
    setActiveReaction((prev) => ({
      ...prev,
      [postId]: reaction
    }));
  };

  return (
    <div className="home">
      <Navbar />

      <div className="home-content">

        {/* LEFT SIDEBAR */}
        <div className="column left-column">
          <div className="user-card">
            <img
              src="https://i.pravatar.cc/120"
              alt="user"
              className="user-image"
            />
            <h3>Dananjaya</h3>
            <p>dananjaya@campus.edu</p>
          </div>

          <div className="menu-links">
            <Link to="/trending" className="menu-link">
              <FiTrendingUp />
              Trending
            </Link>

            <Link to="/message" className="menu-link">
              <FiMessageCircle />
              Messages
            </Link>

            <Link to="/save" className="menu-link">
              <FiBookmark />
              Saved
            </Link>

            <Link to="/profile" className="menu-link">
              <FiUser />
              Profile
            </Link>
          </div>
        </div>

        {/* CENTER */}
        <div className="column center-column">
          {posts.map((post) => (
            <div className="post-card" key={post.id}>

              <div className="post-header">
                <img
                  src={`https://i.pravatar.cc/50?img=${post.id}`}
                  alt={post.user}
                  className="post-user-image"
                />

                <div>
                  <h4>{post.user}</h4>
                  <span>
                    {post.time} • {post.category}
                  </span>
                </div>
              </div>

              <p className="post-text">{post.text}</p>

              <img
                src={post.image}
                alt="post"
                className="post-image"
              />

              {/* REACTIONS */}
              <div className="reaction-bar">

                <button
                  onClick={() => setReaction(post.id, "Like")}
                  className={`reaction-btn like ${
                    activeReaction[post.id] === "Like"
                      ? "active-reaction"
                      : ""
                  }`}
                >
                  <FaThumbsUp />
                </button>

                <button
                  onClick={() => setReaction(post.id, "Love")}
                  className={`reaction-btn love ${
                    activeReaction[post.id] === "Love"
                      ? "active-reaction"
                      : ""
                  }`}
                >
                  <FaHeart />
                </button>

                <button
                  onClick={() => setReaction(post.id, "Laugh")}
                  className={`reaction-btn laugh ${
                    activeReaction[post.id] === "Laugh"
                      ? "active-reaction"
                      : ""
                  }`}
                >
                  <FaLaughSquint />
                </button>

                <button
                  onClick={() => setReaction(post.id, "Sad")}
                  className={`reaction-btn sad ${
                    activeReaction[post.id] === "Sad"
                      ? "active-reaction"
                      : ""
                  }`}
                >
                  <FaSadTear />
                </button>

                <button
                  onClick={() => setReaction(post.id, "Angry")}
                  className={`reaction-btn angry ${
                    activeReaction[post.id] === "Angry"
                      ? "active-reaction"
                      : ""
                  }`}
                >
                  <FaAngry />
                </button>

                <span className="react-text">
                  {activeReaction[post.id] || "React"}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="post-actions">
                <button>
                  <FiHeart />
                  Like
                </button>

                <button>
                  <FiMessageSquare />
                  Comment
                </button>

                <button>
                  <FiSend />
                  Share
                </button>
              </div>

              {/* COMMENT BOX */}
              <div className="comment-box">
                <input
                  type="text"
                  placeholder="Write a comment..."
                />

                <button>Post</button>
              </div>

            </div>
          ))}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="column right-column">
          <h3>Trending</h3>

          <ul className="trending-list">
            <li>#ReactJS</li>
            <li>#Java</li>
            <li>#Exam2026</li>
            <li>#CampusLife</li>
          </ul>

          <h3>Suggestions</h3>

          <div className="suggestion-card">
            <img
              src="https://i.pravatar.cc/45?img=11"
              alt="Nimal"
            />
            <span>Nimal</span>
            <button>Follow</button>
          </div>

          <div className="suggestion-card">
            <img
              src="https://i.pravatar.cc/45?img=12"
              alt="Kasun"
            />
            <span>Kasun</span>
            <button>Follow</button>
          </div>
        </div>

      </div>
    </div>
  );
}