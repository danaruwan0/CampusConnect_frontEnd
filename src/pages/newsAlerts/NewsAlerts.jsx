import React, { useEffect, useState } from "react";
import "./newsAlerts.css";

import Navbar from "../../components/navbar/Navbar";
import { getNews } from "../../services/newsService";

import {
    FiCpu,
    FiExternalLink,
    FiCalendar,
    FiRefreshCw,
    FiAlertCircle
} from "react-icons/fi";

import news_temp from "../../assets/demo_news.png";
import Loader from "../../components/loader/Loader";
import CommonNavBar from "../../components/commonNavBar/CommonNavBar";

export default function NewsAlerts() {

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

            {/* <Navbar /> */}
            <CommonNavBar />


            <div className="news-container">

                <div className="news-topbar">

                    <div className="news-title">

                        <FiCpu />

                        <h2>Technology News</h2>

                    </div>


                    <button
                        className="refresh-btn"
                        onClick={loadNews}
                        disabled={loading}
                    >

                        <FiRefreshCw />

                        Refresh

                    </button>

                </div>


                {loading ? (

                    <Loader text="Loading Technology News..." />

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

                                    <img
                                        src={item.image || news_temp}
                                        alt={item.title}
                                        onError={(e) => {
                                            e.currentTarget.src = news_temp;
                                        }}
                                    />

                                    <div className="news-source">

                                        {item.source?.name || "Technology"}

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