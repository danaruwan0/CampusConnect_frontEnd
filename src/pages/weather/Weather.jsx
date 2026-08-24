import React, { useEffect, useState } from "react";
import "./weather.css";

import Navbar from "../../components/navbar/Navbar";

import WeatherCard from "../../components/Weather/WeatherCard";
import HourlyCard from "../../components/Weather/HourlyCard";
import ForecastCard from "../../components/Weather/ForecastCard";

import { getWeather } from "../../services/weatherService";

import { WiDaySunny } from "react-icons/wi";

export default function Weather() {

    const [weather, setWeather] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [location, setLocation] = useState("Current Location");



    useEffect(() => {

        loadWeather();

    }, []);



    const loadWeather = () => {

        if (!navigator.geolocation) {

            setError("Geolocation is not supported.");

            setLoading(false);

            return;

        }

        navigator.geolocation.getCurrentPosition(

            async (position) => {

                try {

                    const latitude = position.coords.latitude;

                    const longitude = position.coords.longitude;

                    const data = await getWeather(
                        latitude,
                        longitude
                    );

                    setWeather(data);

                    setLocation(
                        `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`
                    );

                }
                catch (err) {

                    console.log(err);

                    setError("Unable to load weather.");

                }
                finally {

                    setLoading(false);

                }

            },

            () => {

                setError("Location permission denied.");

                setLoading(false);

            }

        );

    };



    return (

        <div>

            <Navbar />

            <div className="weather-page">

                <div className="weather-header">

                    <h1>
                         <WiDaySunny className="weather-title-icon" />
                        Campus Weather</h1>

                    <p>{location}</p>

                </div>


                {

                    loading ?

                        <div className="weather-loading">

                            Loading Weather...

                        </div>

                        :

                        error ?

                            <div className="weather-error">

                                {error}

                            </div>

                            :

                            <>

                                <WeatherCard
                                    current={weather.current}
                                />



                                <div className="weather-section">

                                    <h2>

                                        Hourly Forecast

                                    </h2>

                                    <div className="weather-hourly-container">

                                        {

                                            weather.hourly.map((item, index) => (

                                                <HourlyCard
                                                    key={index}
                                                    item={item}
                                                />

                                            ))

                                        }

                                    </div>

                                </div>



                                <div className="weather-section">

                                    <h2>

                                        7 Day Forecast

                                    </h2>

                                    <div className="weather-daily-container">

                                        {

                                            weather.daily.map((item, index) => (

                                                <ForecastCard
                                                    key={index}
                                                    item={item}
                                                />

                                            ))

                                        }

                                    </div>

                                </div>

                            </>

                }

            </div>

        </div>

    );

}