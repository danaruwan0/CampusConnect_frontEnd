import React from "react";
import "./profile.css";
import Navbar from "../../components/navbar/Navbar";

import {
  FiMail,
  FiBookOpen,
  FiCode,
  FiUsers,
  FiEdit
} from "react-icons/fi";

export default function Profile() {
  return (
    <div className="profile-page">

      <Navbar />

      <div className="profile-container">

        {/* Cover Section */}

        <div className="cover-section">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            alt="cover"
            className="cover-image"
          />

          <div className="profile-info">
            <img
              src="https://i.pravatar.cc/200"
              alt="profile"
              className="profile-image"
            />

            <div className="profile-details">
              <h2>Dananjaya Sandaruwan</h2>
              <p>Higher National Diploma in Information Technology</p>
            </div>

            <button className="edit-btn">
              <FiEdit />
              Edit Profile
            </button>

          </div>
        </div>

        {/* Content */}

        <div className="profile-content">

          {/* LEFT */}

          <div className="profile-left">

            <div className="card">
              <h3>About</h3>

              <p>
                Passionate software developer interested in
                Full Stack Development, UI/UX Design and
                Cloud Technologies.
              </p>

              <div className="info-item">
                <FiMail />
                <span>dananjaya@campus.edu</span>
              </div>

            </div>

            <div className="card">
              <h3>Skills</h3>

              <div className="skills">
                <span>React</span>
                <span>Spring Boot</span>
                <span>Java</span>
                <span>MySQL</span>
                <span>JavaScript</span>
                <span>HTML</span>
                <span>CSS</span>
                <span>Git</span>
              </div>
            </div>

          </div>

          {/* RIGHT */}

          <div className="profile-right">

            <div className="stats-grid">

              <div className="stat-card">
                <h2>45</h2>
                <p>Posts</p>
              </div>

              <div className="stat-card">
                <h2>320</h2>
                <p>Followers</p>
              </div>

              <div className="stat-card">
                <h2>180</h2>
                <p>Following</p>
              </div>

            </div>

            <div className="card">

              <h3>
                <FiBookOpen />
                Followed Courses
              </h3>

              <ul className="course-list">
                <li>Software Engineering</li>
                <li>Database Management Systems</li>
                <li>Web Development</li>
                <li>Mobile Application Development</li>
                <li>Cloud Computing</li>
              </ul>

            </div>

            <div className="card">

              <h3>
                <FiCode />
                Academic Interests
              </h3>

              <p>
                Full Stack Development, Artificial Intelligence,
                Cyber Security, UI/UX Design and Cloud Architecture.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}