import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/weather.css';
import { useNavigate } from 'react-router-dom';

// 날씨 데이터 타입 정의
interface WeatherData {
  name: string;
  main: { temp: number; humidity: number };
  weather: { description: string; icon: string }[];
}

interface ForecastData {
  dt_txt: string; // 예보 날짜
  main: { temp: number };
  weather: { description: string; icon: string }[];
}

const Weather: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const API_KEY = 'aa2d59dd0a87d732b6e046ec34f9b53c';

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    try {
      const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=kr`;
      const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=kr`;

      // 현재 날씨와 5일 예보 동시 요청
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get<WeatherData>(weatherURL),
        axios.get<{ list: ForecastData[] }>(forecastURL),
      ]);

      console.log("현재 날씨 데이터:", weatherRes.data);
      console.log("5일 예보 데이터:", forecastRes.data.list);

      setWeatherData(weatherRes.data);

      // 날짜별로 대표적인 예보 데이터만 필터링
      const dailyForecast = forecastRes.data.list
        .filter((item) => item.dt_txt.includes("12:00:00")) // 매일 12시 예보만 선택
        .slice(0, 5); // 5일치만 가져오기

      setForecastData(dailyForecast);
      setError(null);
    } catch (err) {
      setError('날씨 정보를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [city]);

  return (
    <div className="weather-container">
      <h1 className="weather-header">실시간 날씨</h1>
      <select className="weather-select" onChange={(e) => setCity(e.target.value)} value={city}>
        <option value="">지역을 선택하세요</option>
        <option value="Seoul">서울</option>
        <option value="Busan">부산</option>
        <option value="Incheon">인천</option>
        <option value="Daegu">대구</option>
        <option value="Mokpo">목포</option>
        <option value="Gwangju">광주</option>
        <option value="Jeju">제주도</option>
      </select>

      {loading && <p>불러오는 중...</p>}
      {error && <p>{error}</p>}

      <div className="weather-content">
        {/* 현재 날씨 */}
        {weatherData && !loading && (
          <div className="weather-info">
            <h2>{weatherData.name} 날씨</h2>
            <img src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} alt={weatherData.weather[0].description} /> {/* 날씨 아이콘 추가 */}
            <p>온도: {weatherData.main.temp}°C</p>
            <p>상태: {weatherData.weather[0].description}</p>
            <p>습도: {weatherData.main.humidity}%</p>
          </div>
        )}

        {/* 5일간 일기예보 */}
        {forecastData.length > 0 && (
          <div className="weather-forecast-info">

            <h2 className='weekly-forecast-title'>주간</h2>
            <ul>
              {forecastData.map((forecast, index) => {
                const date = new Date(forecast.dt_txt.split(" ")[0]); // 날짜 객체 생성
                const dayOfWeek = date.toLocaleDateString("ko-KR", { weekday: "long" }); // 요일 계산
                return (
                  <li key={index}>
                    <p>{forecast.dt_txt.split(" ")[0]} ({dayOfWeek})</p> {/* 날짜와 요일 표시 */}
                    <img src={`http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`} alt={forecast.weather[0].description} />
                    <p>온도: {forecast.main.temp}°C</p>
                    <p>상태: {forecast.weather[0].description}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <button className="btn btn-primary" onClick={() => navigate(-1)}>이전 페이지로</button>
    </div>
  );
};

export default Weather;
