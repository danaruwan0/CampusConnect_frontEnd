import React from "react";
import "./weather.css";

import {
    WiThermometer,
    WiHumidity,
    WiStrongWind
} from "react-icons/wi";


import {
    FaTemperatureHigh,
    FaDroplet,
    FaWind
} from "react-icons/fa6";

export default function WeatherCard({ current }) {

    return (

        <div className="weather-card">

            <div className="weather-main">

                <img
                    src={`https://openweathermap.org/img/wn/${current.icon}@2x.png`}
                    alt="weather"
                />

                <div>

                    <h1>
                        {current.temperature}°C
                    </h1>

                    <p>
                        {current.description}
                    </p>

                </div>

            </div>


            <div className="weather-info">

                <div className="weather-info-card">
                    <FaTemperatureHigh className="weather-info-icon" />
                    <span>Feels Like</span>
                    <b>{current.feelsLike}°C</b>
                </div>

                <div className="weather-info-card">
                    <FaDroplet className="weather-info-icon" />
                    <span>Humidity</span>
                    <b>{current.humidity}%</b>
                </div>

                <div className="weather-info-card">
                    <FaWind className="weather-info-icon" />
                    <span>Wind Speed</span>
                    <b>{current.windSpeed} km/h</b>
                </div>

            </div>


        </div>

    );
}