import React, { useState } from "react";
import axios from "axios";
import "../../css/TourMusicRecommended.css";

const defaultPlaylist = [
  { title: "like JENNIE", cover: "https://i.scdn.co/image/ab67616d0000b2735a43918ea90bf1e44b7bdcfd", url: "https://open.spotify.com/track/0DC62SYIRKMFgx2f7OyvwD?si=0356e9bea8be4ffe" },
  { title: "Air", cover: "https://i.scdn.co/image/ab67616d0000b27338d7a50443e2a6043d6da247", url: "https://open.spotify.com/track/6OOEQb3Su7Khcw9rDcJ07L?si=0cbaf287013b493d" },
  { title: "APT.", cover: "https://i.scdn.co/image/ab67616d0000b27336032cb4acd9df050bc2e197", url: "https://open.spotify.com/track/2vDkR3ctidSd17d2CygVzS?si=73dce278963d4403" },
  { title: "How Sweet",cover:"https://i.scdn.co/image/ab67616d0000b273b657fbb27b17e7bd4691c2b2",url:"https://open.spotify.com/track/38tXZcL1gZRfbqfOG0VMTH?si=c005c16487874bf2"},
  { title: "Supernova",cover:"https://i.scdn.co/image/ab67616d0000b273115d1e2cfde4e387f0a13ce2",url:"https://open.spotify.com/track/18nZWRpJIHzgb1SQr4ncwb?si=a95ac66edc034c07"}
];

const MusicRecommendation: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [location, setLocation] = useState<string | null>(null);
  // const [musicList, setMusicList] = useState<{ title: string; cover: string; url: string }[]>(null);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<string | null>(null);
  const [musicList, setMusicList] = useState<{ title: string; cover: string; url: string }[] | null>(null);

  // ✅ 위치 정보 가져오기
  const fetchLocation = async (latitude: number, longitude: number) => {
    try {
      const KAKAO_API_KEY = "0b998fb74842d1e39d265724fb1257fc";
      const response = await axios.get(
        `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`,
        { headers: { Authorization: `KakaoAK ${KAKAO_API_KEY}` } }
      );

      const region = response.data.documents[0]?.region_1depth_name || "알 수 없음";
      console.log("🔍 현재 위치:", region);
      setLocation(region);

      // 위치 정보를 기반으로 날씨 정보 가져오기
      fetchWeather(latitude, longitude);
    } catch (error) {
      console.error("❌ 위치 변환 실패:", error);
      setLocation(null); // 위치 정보를 못 가져와도 기본 음악을 표시
      fetchWeatherRecommendations("Clear"); // 기본 날씨 설정
      setLoading(false);
    }
  };

  // ✅ 날씨 정보를 가져오기
  const fetchWeather = async (latitude: number, longitude: number) => {
    try {
      const API_KEY = 'aa2d59dd0a87d732b6e046ec34f9b53c';
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=kr`
      );
      const weatherCondition = response.data.weather[0]?.main || "Clear";
      console.log("🌤️ 날씨 상태:", weatherCondition);
      setWeather(weatherCondition);

      // 날씨에 맞는 음악 추천
      fetchWeatherRecommendations(weatherCondition);
    } catch (error) {
      console.error("❌ 날씨 정보 가져오기 실패:", error);
      setWeather(null);
      fetchWeatherRecommendations("Clear"); // 기본 날씨 설정
      setLoading(false);
    }
  };

  // ✅ 날씨 기반 추천 음악 가져오기
  const fetchWeatherRecommendations = async (weather: string) => {
    setLoading(true);
    try {
      const url = `http://localhost:81/traveler/api/music/recommendMusic?weather=${weather}`;
      console.log("🎵 날씨 기반 음악 추천 API 요청 URL:", url);

      const response = await axios.get(url);
      console.log("✅ 추천 음악 API 응답:", response.data);

      if (!response.data || response.data.length === 0) {
        console.warn("⚠️ 음악 데이터를 찾을 수 없음. 기본 플레이리스트 표시.");
        setMusicList(defaultPlaylist);
        setLoading(false);
        return;
      }

      // 데이터 매핑
      const musicData = response.data.map((track: any) => ({
        title: track.name,
        cover: track.image,
        url: track.url,
      })).slice(0, 5); // 최대 5곡

      console.log("🎶 추천 음악 리스트:", musicData);
      setMusicList(musicData);
      setLoading(false);
    } catch (error) {
      console.error("❌ 음악 추천 API 요청 실패:", error);
      setMusicList(defaultPlaylist);
      setLoading(false);
    }
  };

  // ✅ 사용자 위치 가져오기
  const handleLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("위치 정보:", position.coords.latitude, position.coords.longitude);
        fetchLocation(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error("위치 정보를 가져올 수 없음", error);
        setLocation(null); // 위치 정보를 못 가져와도 기본 음악을 표시
        fetchWeatherRecommendations("Clear"); // 기본 날씨 설정
        setLoading(false);
      }
    );
  };

  return (
    <div className={`music-recommended-overlay active`}>
      <div className="music-recommended-modal">
        <div className="music-recommended-header">
          <h2>🎵 여행지별 추천 음악</h2>
          {onClose && <button onClick={onClose}>❌</button>}
        </div>

        <button className="music-recommended-location-btn" onClick={handleLocation}>
          위치 정보 보내기
        </button>

        {loading ? (
          <p className="music-recommended-location">위치 정보를 가져오는 중...</p>
        ) : (
          <>
            {location && <p className="music-recommended-location">현재 위치: {location}</p>}
            {weather && <p className="music-recommended-location">날씨 상태: {weather}</p>}
            <div className="music-recommended-list">
            <div className="music-recommended-list">
            {musicList && musicList.length > 0 ? (
              musicList.map((music, index) => (
                <div key={index} className="music-recommended-card">
                  <img src={music.cover} alt={music.title} className="music-recommended-cover" />
                  <div className="music-recommended-info">
                    <h3>{music.title}</h3>
                  </div>
                  <a href={music.url} target="_blank" rel="noopener noreferrer">
                    <button className="music-recommended-play-btn">▶</button>
                  </a>
                </div>
              ))
            ) : (
              <p className="music-recommended-location">음악 추천을 위해 위치 정보를 받아주세요!</p>
            )}
          </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MusicRecommendation;
