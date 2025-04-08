import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/tourRecommended.css"; // ✅ 스타일 적용
import axios from "axios";

interface TourData {
    num: number;
    name: string;
    rating: number;
    content: string;
    days: number;
    location: string;
    thumbnail: string;
    hit: number;
    theme: string;
    images: { img_name: string }[];
    schedules: { day: number; place: string; content: string }[];
}

const TourRecommended: React.FC = () => {
    const [step, setStep] = useState(1);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
    const [selectedMbti, setSelectedMbti] = useState("");
    const progressPercentage = (step / 3) * 100;
    const navigate = useNavigate();

    const [recommendedTour, setRecommendedTour] = useState<TourData | null>(null);

    const handleComplete = () => {
        if (recommendedTour) {
            navigate(`/traveler/tour/${recommendedTour.num}`);  // ✅ 추천된 여행지 상세 페이지로 이동
        } else {
            alert("추천된 여행지가 없습니다!");
        }
    };


  

    const handleSubmit = async () => {
        if (!selectedRegion || selectedThemes.length !== 2 || !selectedMbti) {
            alert("모든 선택을 완료해주세요.");
            return;
        }
    
        const requestData = {
            location: selectedRegion,
            themes: selectedThemes,
            mbti: selectedMbti
        };
    
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/tours/recommend`, requestData);
            console.log("✅ 추천 여행지:", response.data);
    
            if (response.data) {
                setRecommendedTour(response.data); // ✅ 상태 업데이트만 수행
            } else {
                alert("추천된 여행지를 찾을 수 없습니다.");
            }
        } catch (error) {
            console.error("❌ 여행지 추천 실패:", error);
            alert("추천 여행지를 가져오는 데 실패했습니다.");
        }
    };
    
    // ✅ recommendedTour 값이 업데이트되면 자동 이동
    useEffect(() => {
        if (recommendedTour) {
            console.log("🔹 이동할 여행지 번호:", recommendedTour.num);
            navigate(`/traveler/tour/${recommendedTour.num}`);
        }
    }, [recommendedTour]); // ✅ recommendedTour 값이 변경될 때 실행
    
    // ✅ handleFinalSubmit에서 handleComplete 제거
    const handleFinalSubmit = async () => {
        await handleSubmit();  // ✅ 추천 여행지를 가져오는 함수 실행
    };
    
    


    const regions = [
        { name: "서울", image: "../images/seoul.jpg" },
        { name: "부산", image: "../images/busan.jpg" },
        { name: "강원도", image: "../images/kangwon.jpg" },
        { name: "제주도", image: "../images/jeju.jpg" },
    ];

    const themes = [
        { name: "바다", image: "../images/sea.jpg" },
        { name: "실내 여행지", image: "../images/indoor.jpg" },
        { name: "액티비티", image: "../images/activity.jpg" },
        { name: "문화 | 역사", image: "../images/culture.jpg" },
        { name: "테마파크", image: "../images/themepark.jpg" },
        { name: "맛집", image: "../images/market.jpg" },
    ];

    const mbtiOptions = [
        { name: "ISTJ", image: "../images/mbti/istj.jpg" },
        { name: "ISFJ", image: "../images/mbti/isfj.jpg" },
        { name: "INFJ", image: "../images/mbti/infj.jpg" },
        { name: "INTJ", image: "../images/mbti/intj.jpg" },
        { name: "ISTP", image: "../images/mbti/istp.jpg" },
        { name: "ISFP", image: "../images/mbti/isfp.jpg" },
        { name: "INFP", image: "../images/mbti/infp.jpg" },
        { name: "INTP", image: "../images/mbti/intp.jpg" },
        { name: "ESTP", image: "../images/mbti/estp.jpg" },
        { name: "ESFP", image: "../images/mbti/esfp.jpg" },
        { name: "ENFP", image: "../images/mbti/enfp.jpg" },
        { name: "ENTP", image: "../images/mbti/entp.jpg" },
        { name: "ESTJ", image: "../images/mbti/estj.jpg" },
        { name: "ESFJ", image: "../images/mbti/esfj.jpg" },
        { name: "ENFJ", image: "../images/mbti/enfj.jpg" },
        { name: "ENTJ", image: "../images/mbti/entj.jpg" },
    ];

    const toggleSelection = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, max: number = 2) => {
        if (list.includes(item)) {
            setList(list.filter((s) => s !== item));
        } else if (list.length < max) {
            setList([...list, item]);
        }
    };

    return (
        <div className="tour-recommended-container">
            <div className="tour-recommended-box">
                <div className="tour-recommended-progress-bar">
                    <div
                        className="tour-recommended-progress-fill"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>

                {/* Step 1: 여행지 선택 */}
                {step === 1 && (
                    <div>
                        <h3 className="tour-recommended-title">어디로 떠나볼까요?</h3>
                        <div className="tour-recommended-grid">
                            {regions.map((region) => (
                                <button
                                    key={region.name}
                                    className={`tour-recommended-grid-item ${selectedRegion === region.name ? "selected" : ""}`}
                                    onClick={() => setSelectedRegion(region.name)}
                                >
                                    <img src={region.image} alt={region.name} />
                                    <p>{region.name}</p>
                                </button>
                            ))}
                        </div>
                        <div className="tour-recommended-button-container">
                            <button className="tour-recommended-btn" onClick={() => setStep(2)} disabled={!selectedRegion}>다음</button>
                        </div>
                    </div>
                )}

                {/* Step 2: 여행 테마 선택 */}
                {step === 2 && (
                    <div>
                        <h4 className="tour-recommended-title">🎭 여행 스타일을 선택하세요! (2개 선택)</h4>
                        <div className="tour-recommended-grid">
                            {themes.map((theme) => (
                                <button
                                    key={theme.name}
                                    className={`tour-recommended-grid-item ${selectedThemes.includes(theme.name) ? "selected" : ""}`}
                                    onClick={() => toggleSelection(theme.name, selectedThemes, setSelectedThemes)}
                                >
                                    <img src={theme.image} alt={theme.name} />
                                    <p>{theme.name}</p>
                                </button>
                            ))}
                        </div>
                        <div className="tour-recommended-button-container">
                            <button className="tour-recommended-btn" onClick={() => setStep(1)}>이전</button>
                            <button className="tour-recommended-btn" onClick={() => setStep(3)} disabled={selectedThemes.length !== 2}>다음</button>
                        </div>
                    </div>
                )}

                {/* Step 3: MBTI 선택 */}
                {step === 3 && (
                    <div>
                        <h4 className="tour-recommended-title">🔍 MBTI를 선택하세요!</h4>
                        <div className="tour-recommended-grid">
                            {mbtiOptions.map((mbti) => (
                                <button
                                    key={mbti.name}
                                    className={`tour-recommended-grid-item ${selectedMbti === mbti.name ? "selected" : ""}`}
                                    onClick={() => setSelectedMbti(mbti.name)}
                                >
                                    <img src={mbti.image} alt={mbti.name} />
                                    <p>{mbti.name}</p>
                                </button>
                            ))}
                        </div>
                        <div className="tour-recommended-button-container">
                            <button className="tour-recommended-btn" onClick={() => setStep(2)}>이전</button>
                            <button className="tour-recommended-btn" onClick={handleFinalSubmit}>
                                완료
                            </button>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TourRecommended;
