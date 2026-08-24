import React, { useEffect, useState } from "react";
import "./newsAlerts.css";

import Navbar from "../../components/navbar/Navbar";
import { getNews } from "../../services/newsService";

import {
    FiCpu,
    FiExternalLink,
    FiCalendar,
    FiRefreshCw,
    FiAlertCircle,
    FiLoader
} from "react-icons/fi";

import news_temp from '../../assets/demo_news.png';

export default function NewsAlerts() {

    // Technology news only
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadNews = async () => {

        try {

            setLoading(true);

            const data = await getNews("technology");

            setNews(data || []);

        } catch (error) {

            console.error("Error loading news:", error);

            setNews([]);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadNews();

    }, []);

    return (

        <div className="news-page">

            <Navbar />

            <div className="news-container">

                {/* ================= HEADER ================= */}

                <div className="news-topbar">

                    <div className="news-title">

                        <FiCpu />

                        <h2>Technology News</h2>

                    </div>

                    <button
                        className="refresh-btn"
                        onClick={loadNews}
                    >

                        <FiRefreshCw />

                        Refresh

                    </button>

                </div>

                {/* ================= LOADING ================= */}

                {loading ? (

                    <div className="loading-box">

                        <FiLoader className="loading-icon" />

                        <h3>Loading Technology News...</h3>

                    </div>

                ) : news.length === 0 ? (

                    <div className="empty-news">

                        <FiAlertCircle />

                        <h2>No News Available</h2>

                        <p>

                            Technology news is currently unavailable.
                            Please try again later.

                        </p>

                    </div>

                ) : (

                    <div className="news-grid">

                        {news.map((item, index) => (

                            <div
                                className="news-card"
                                key={index}
                            >

                                <div className="news-image">

                                    {/* <img
                                        src={
                                            item.image ||
                                            "https://placehold.co/900x500?text=Technology+News"
                                        }
                                        alt={item.title}
                                        onError={(e) => {
                                            e.target.src =
                                                "https://placehold.co/900x500?text=Technology+News";
                                        }}
                                    /> */}


                                    <img
                                        src={item.image ||
                                            news_temp}
                                        alt={item.title}
                                        // className="register-image"

                                        onError={(e) => {
                                            e.target.src =
                                                "news_temp";
                                        }}
                                    />


                                    <div className="news-source">

                                        {item.source?.name ||
                                            "Technology"}

                                    </div>

                                </div>

                                <div className="news-body">

                                    <div className="news-date">

                                        <FiCalendar />

                                        {item.publishedAt
                                            ? item.publishedAt.substring(0, 10)
                                            : "Latest"}

                                    </div>

                                    <h3>

                                        {item.title}

                                    </h3>

                                    <p>

                                        {item.description ||
                                            "No description available for this article."}

                                    </p>

                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="read-more-btn"
                                    >

                                        Read Full Article

                                        <FiExternalLink />

                                    </a>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );

}