import React, {useEffect, useState} from 'react'
import "./weather-bar.css"
import RainIcon from "../icons/RainIcon";
import SunIcon from "../icons/SunIcon";
import CloudIcon from "../icons/CloudIcon";

const WeatherBar = () => {
    const [forecast, setForecast] = useState([{label: "thu", rainChance: '11'},
        {label: "fri", rainChance: '40'}, {label: "sat", rainChance: '90'}]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/weather-forecast");
                if (!res.ok) return;
                const forecastData = await res.json();
                setForecast(forecastData);
            } catch (err) {
                console.warn("Nem sikerült lekérni az elorejelzest:", err);
            }
        }

        void fetchData();
    }, []);


    const getIcon = (chance) => {
        if (chance >= 50) return <RainIcon/>;
        if (chance >= 20) return <CloudIcon/>;
        return <SunIcon/>;
    };
    return (
        <div className="weather-bar">
            {forecast?.map((day, i) => (
                <div className="weather-day" key={i}>
                    <div className="label">{day.label}</div>
                    <div className="icon">{getIcon(day?.rainChance)}</div>
                    <div className="chance">{day?.rainChance}%</div>
                </div>
            ))}
        </div>
    )
}

export default WeatherBar;