import { Link } from "react-router-dom";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MenuIcon from "@mui/icons-material/Menu";
import "./navbar.css";

export default function Navbar() {
    return (
        <nav className="navbar">

            <div className="navbar-left">

                <button className="menu-btn">
                    <MenuIcon />
                </button>

                <h1 className="logo">
                    CampusConnect
                </h1>

            </div>

            <div className="navbar-center">

                <input
                    type="text"
                    placeholder="Search posts, students..."
                    className="search-input"
                />

            </div>

            <div className="navbar-right">

                <div className="notification">

                    <NotificationsNoneIcon />

                    <span className="notification-badge">
                        3
                    </span>

                </div>

                <Link to="/profile">
                    <img
                        src="https://i.pravatar.cc/150"
                        alt="profile"
                        className="profile-image"
                    />
                </Link>

            </div>

        </nav>
    );
}