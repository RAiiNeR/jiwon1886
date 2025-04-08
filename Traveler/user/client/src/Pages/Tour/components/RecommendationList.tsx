import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface Tour {
    num: number;
    name: string;
    location: string;
    thumbnail: string;
}

// ✅ place props의 타입을 명확하게 정의
interface RecommendationProps {
    place: string;
}

const RecommendationList: React.FC<RecommendationProps> = ({ place }) => {
    const [randomTour, setRandomTour] = useState<Tour | null>(null);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/tours`) // ✅ 백엔드에서 전체 투어 목록 가져오기
            .then((response) => {
                //console.log("✅ API 전체 응답 데이터:", response.data); // 🔥 전체 응답 로그
                //console.log("✅ API에서 받아온 투어 리스트 (content):", response.data.content); // 🔥 content만 출력
                const tours: Tour[] = response.data.content; // 투어 목록
               
                if (tours.length > 0) {
                    const randomIndex = Math.floor(Math.random() * tours.length);
                    setRandomTour(tours[randomIndex]); // ✅ 랜덤한 투어 선택
                } else{
                    console.warn("🚨 투어 리스트가 비어있음");
                }
            })
            .catch((error) => console.error("랜덤 추천 여행지 불러오기 실패:", error));
    }, []);

    return (
        <div style={{ flex: 1, minWidth: "300px", textAlign: "center" }}>
            <h3 className="tour-recommendation-title">랜덤 추천 여행지</h3>

            {randomTour ? (
                <div className="tour-destination">
                    <Link to={`/traveler/tour/${randomTour.num}`}
                        className="img img-2 d-flex justify-content-center align-items-center"
                        style={{
                            backgroundImage: `url(${process.env.REACT_APP_FILES_URL}/img/tour/${randomTour.thumbnail || "default.jpg"})`,
                            height: "200px",
                            backgroundSize: "cover",
                            borderRadius: "10px",
                            position: "relative",
                        }}>
                        <div className="icon d-flex justify-content-center align-items-center" 
                        style={{
                            width: "60px",
                            height: "60px",
                            backgroundColor: "#fff",
                            color:"black",
                            borderRadius: "50%",
                            opacity:"0.5"
                            }}>
                            <span className="icon-search2"></span>
                        </div>
                    </Link>
                    <div className="text p-3">
                        <h3 className="tour-recommendation-place">{randomTour.name}</h3>
                        <p className="tour-recommendation-text">
                            {`이번 여행 `} <strong>{randomTour.name}</strong> {`은(는) 어떠신가요?`}
                        </p>
                    </div>
                </div>
            ) : (
                <p>추천할 여행지를 찾는 중...</p>
            )}
        </div>
    );
};

export default RecommendationList;
