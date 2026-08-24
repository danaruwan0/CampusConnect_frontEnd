import React from "react";
import "./weather.css";


export default function ForecastCard({item}) {


    return (

        <div className="forecast-card">


            <h3>
                {item.date}
            </h3>


            <img
                src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                alt="weather"
            />


            <p>
                {item.description}
            </p>


            <div className="temp">

                <b>
                    {item.maxTemp}°
                </b>

                <span>
                    {item.minTemp}°
                </span>

            </div>


        </div>

    );

}