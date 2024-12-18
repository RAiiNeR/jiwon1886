import React, { useEffect, useState } from 'react';
import './css/weather.css';
import axios from 'axios';

interface WeatherInfo {
    temperature: string;
    sky: string;
}

const weatherTranslations: { [key: string]: string } = {
    Sunny: "맑음",
    Rain: "비",
    Snow: "눈",
    Cloudy: "흐림",
    Overcast: "구름 많음",
    Thunderstorm: "뇌우",
    Drizzle: "이슬비",
    Fog: "안개",
    Clear: "매우 맑음",
    "Partly cloudy":"조금 흐림",
};

const weatherIcons: { [key: string]: string } = {
    맑음: "☀️",
    비: "🌧️",
    눈: "❄️",
    흐림: "☁️",
    "구름 많음": "🌥️",
    뇌우: "⛈️",
    이슬비: "🌦️",
    안개: "🌫️",
    "매우 맑음": "🌞",
    "조금 흐림": "🌥️",
};

const Weather: React.FC = () => {
    const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await axios.get(
                    `https://api.weatherapi.com/v1/current.json?key=bc85f9adc4504c328ee25143241012&q=37.4838,127.0327` // 서초구 중심 좌표
                );
                const data = response.data;

                const englishCondition = data.current.condition.text; // 영어 상태
                const koreanCondition = weatherTranslations[englishCondition] || englishCondition; // 한글 상태로 변환

                setWeatherInfo({
                    temperature: `${data.current.temp_c}°C`,
                    sky: koreanCondition, // 한글 상태 사용
                });
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        };

        fetchWeather();
    }, []);

    const weatherIcon = weatherInfo ? weatherIcons[weatherInfo.sky] || "❓" : "";

    return (
        <div className="weather">
            {weatherInfo ? (
                <>
                    <span className="weather-icon">{weatherIcon}</span>
                    <div className="weather-details">
                        <div className="weather-temperature">{weatherInfo.temperature}</div>
                        <div className="weather-sky">{weatherInfo.sky}</div>
                    </div>
                </>
            ) : (
                <div>날씨 정보를 가져오는 중...</div>
            )}
        </div>
    );
};

export default Weather;
