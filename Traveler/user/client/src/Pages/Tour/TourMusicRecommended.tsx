import React, { useState } from "react";
import axios from "axios"; // ✅ API 요청을 위한 axios 추가
import "../../css/TourMusicRecommended.css";

const TourMusicRecommended: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [location, setLocation] = useState<string | null>(null);
  const [musicList, setMusicList] = useState<{ id: string; title: string; artist: string; cover: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const getLastFmCountryName = (region: string) => {
    const countryMap: { [key: string]: string } = {
        "서울특별시": "Korea, Republic of",
        "경기도": "Korea, Republic of",
        "부산광역시": "Korea, Republic of",
        "인천광역시": "Korea, Republic of",
        "대구광역시": "Korea, Republic of",
        "대전광역시": "Korea, Republic of",
        "광주광역시": "Korea, Republic of",
        "울산광역시": "Korea, Republic of",
        "강원도": "Korea, Republic of",
        "충청북도": "Korea, Republic of",
        "충청남도": "Korea, Republic of",
        "전라북도": "Korea, Republic of",
        "전라남도": "Korea, Republic of",
        "경상북도": "Korea, Republic of",
        "경상남도": "Korea, Republic of",
        "제주특별자치도": "Korea, Republic of",
        "세종특별자치시": "Korea, Republic of",
        "대한민국": "Korea, Republic of",
    };

    return countryMap[region] || "Korea, Republic of"; // ✅ 기본값 설정
};





  // ✅ 1. 사용자 위치 가져오기 (카카오 로컬 API 사용)
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

        // ✅ K-POP 음악만 가져오도록 변경
        fetchMusicRecommendations(); 
    } catch (error) {
        console.error("❌ 위치 변환 실패:", error);
        setLocation("위치 정보를 가져올 수 없음");
        setLoading(false);
    }
};


  // ✅ 3. 위치 기반 추천 음악 가져오기 (Last.fm API 활용)
  const fetchMusicRecommendations = async () => {
    try {
        const MUSIC_API_KEY = "806168ad13327b45032754c5214d4c09"; // ✅ Last.fm API 키 입력
        const url = `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=k-pop&api_key=${MUSIC_API_KEY}&format=json`;

        console.log("🎵 K-POP API 요청 URL:", url);

        const response = await axios.get(url);
        console.log("✅ K-POP API 응답:", response.data);

        if (!response.data.tracks || !response.data.tracks.track.length) {
            console.warn("⚠️ K-POP 음악 데이터를 찾을 수 없음");
            setMusicList([]);
            return;
        }

        const musicData = response.data.tracks.track.map((track: any) => {
            const coverUrl = track.image[3]?.["#text"]; // ✅ 더 큰 해상도 이미지 요청
            const fallbackCover = "./images/default-music.jpg"; // ✅ 기본 이미지 (백업)

            return {
                id: track.mbid || track.url,
                title: track.name,
                artist: track.artist.name,
                cover: coverUrl && coverUrl.trim() !== "" ? coverUrl : fallbackCover, // ✅ 이미지 없으면 기본 이미지 사용
            };
        }).slice(0, 5); // ✅ 최대 5곡만 가져오기

        console.log("🎶 K-POP 추천 음악 리스트:", musicData);
        setMusicList(musicData);
        setLoading(false);
    } catch (error) {
        console.error("❌ K-POP API 요청 실패:", error);
        setMusicList([]);
        setLoading(false);
    }
};




  // ✅ 4. 사용자 위치 가져오기 함수
  const handleLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("📍 위치 정보:", position.coords.latitude, position.coords.longitude);
        fetchLocation(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error("❌ 위치 정보를 가져올 수 없음", error);
        setLocation("위치 정보를 가져올 수 없음");
        setLoading(false);
      }
    );
  };

  return (
    <div className={`music-recommended-overlay active`}>
      <div className="music-recommended-modal">
        <div className="music-recommended-header">
          <h2>🎵 여행지별 추천 음악</h2>
          <button className="music-recommended-close" onClick={onClose}>✖</button>
        </div>

        <button className="music-recommended-location-btn" onClick={handleLocation}>
          위치 정보 보내기
        </button>

        {loading ? (
          <p className="music-recommended-location">위치 정보를 가져오는 중...</p>
        ) : (
          <>
            {location && <p className="music-recommended-location">현재 위치: {location}</p>}
            <div className="music-recommended-list">
              {musicList.length > 0 ? (
                musicList.map((music) => (
                  <div key={music.id} className="music-recommended-card">
                    <img src={music.cover} alt={music.title} className="music-recommended-cover" />
                    <div className="music-recommended-info">
                      <h3>{music.title}</h3>
                      <p>{music.artist}</p>
                    </div>
                    <button className="music-recommended-play-btn">▶</button>
                  </div>
                ))
              ) : (
                <p className="music-recommended-location">해당 위치의 추천 음악을 찾을 수 없습니다.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TourMusicRecommended;
