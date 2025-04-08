import axios from "axios";
import React, { useEffect, useState } from "react";
import Pagenation from "../../Comm/Pagenation";

interface Review {
    reviewId: number;
    userName: string;
    rating: number;
    content: string;
    createdAt: string;
    sentiment?: "긍정" | "부정" | "unknown";  // 감정 분석 결과 추가
}

interface ReviewListProps {
    tourId: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ tourId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchReviews();
    }, [tourId, currentPage]);

    // const isKorean = (text: string) => {
    //     const koreanRegex = /[가-힣]/; // 한글 포함 여부 확인
    //     return koreanRegex.test(text);
    // };
    const isJapanese = (text: string) => {
        const japaneseRegex = /[\u3040-\u30FF\u31F0-\u31FF\uFF66-\uFF9F]/; // 히라가나, 가타카나 포함 여부 확인
        return japaneseRegex.test(text);
    };
    

    // ✅ 리뷰 데이터를 가져오고 감정 분석 요청
    const fetchReviews = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/reviews/${tourId}?page=${currentPage}`);
            setReviews(response.data.reviews); // ✅ 백엔드에서 `sentiment` 포함하여 응답
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error("❌ 리뷰 데이터를 불러오는 중 오류 발생:", error);
            setLoading(false);
        }
    };
    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return new Intl.DateTimeFormat("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(date);
    };

    // ✅ 감정 분석 API 요청
    const analyzeSentiment = async (text: string) => {
        try {
            const response = await axios.post("http://localhost:9000/api/reviews/analyze-sentiment/", { text });
            return response.data.sentiment; // "positive" 또는 "negative" 반환
        } catch (error) {
            console.error("❌ 감정 분석 요청 실패:", error);
            return "unknown"; // 오류 발생 시 기본값 설정
        }
    };


    // ✅ 감정 분석 결과에 따라 아이콘 표시
    const getSentimentIcon = (sentiment: "긍정" | "부정" | "unknown") => {
        if (sentiment === "긍정") return <span style={{ color: "#28a745", fontSize: "20px" }}>😀</span>;
        if (sentiment === "부정") return <span style={{ color: "#dc3545", fontSize: "20px" }}>😡</span>;
        return <span style={{ color: "#6c757d", fontSize: "20px" }}>❓</span>;
    };

    return (
        <div>
            <h5>사용자 리뷰</h5>
            {loading ? (
                <p>⏳ 리뷰를 불러오는 중...</p>
            ) : reviews.length === 0 ? (
                <p>아직 리뷰가 없습니다.</p>
            ) : (
                reviews.map((review) => (
                    <div key={review.reviewId} className="review-item">
                        <p><hr /> {formatDate(review.createdAt)}</p>
                        <p>⭐ {review.rating} / 5</p>
                        <p>{review.content}</p>

                        {/* ✅ "unknown"이면 감정 분석 결과 안 보이게 처리 */}
                        {isJapanese(review.content) && review.sentiment && review.sentiment !== "unknown" && (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                                {/* ✅ 감정 분석 아이콘 표시 */}
                                {review.sentiment === "긍정" && <span style={{ color: "#28a745", fontSize: "20px" }}>😀</span>}
                                {review.sentiment === "부정" && <span style={{ color: "#dc3545", fontSize: "20px" }}>😡</span>}

                                {/* ✅ 감정 분석 결과 텍스트 표시 */}
                                <span style={{ fontWeight: "bold", color: review.sentiment === "긍정" ? "#28a745" : "#dc3545" }}>
                                    {review.sentiment === "긍정" ? "긍정적인 리뷰입니다." : "부정적인 리뷰입니다."}
                                </span>
                            </div>
                        )}
                    </div>
                ))
            )}

            {/* ✅ 페이징 처리 */}
            <div className="pagination">
                <Pagenation
                    page={currentPage}
                    totalPages={totalPages}
                    pageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default ReviewList;
