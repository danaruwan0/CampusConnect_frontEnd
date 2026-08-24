import React from "react";
import "./weather.css";

export default function HourlyCard({item}) {

    return (

        <div className="hourly-card">

            <p>
                {item.time}
            </p>


            <img
                src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                alt="weather"
            />


            <h3>
                {item.temperature}°C
            </h3>


        </div>

    );

}