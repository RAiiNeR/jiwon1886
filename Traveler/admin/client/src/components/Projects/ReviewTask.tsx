import axios from "axios";
import React, { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";

interface Review {
  id: number;
  content: string;
  created_at: string;
  rating: number;
  user_name: string;
}
interface ReviewTaskProps {
  tourNum: number; // tourNum prop 추가
}
const ReviewTask: React.FC<ReviewTaskProps> = ({ tourNum }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/reviews/${tourNum}`); // tourNum 사용
        console.log("✅ 리뷰 데이터:", response.data);
        setReviews(response.data.reviews); // response.data.reviews로 수정
      } catch (error) {
        console.error("❌ 리뷰 정보를 불러오는 중 오류 발생:", error);
      }
    };

    fetchReviews();
  }, [tourNum]); // tourNum이 변경될 때마다 리뷰를 다시 가져옴

  const deleteReview = async (reviewId: number) => {
    if (!window.confirm("정말로 이 리뷰를 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`${process.env.REACT_APP_BACK_END_URL}/api/reviews/${reviewId}`);
      console.log(`🗑️ 리뷰 ${reviewId} 삭제 완료`);

      // 삭제 후 상태 업데이트 (리스트에서 해당 리뷰 제거)
      setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error("❌ 리뷰 삭제 중 오류 발생:", error);
      alert("리뷰 삭제에 실패했습니다.");
    }
  };



const avatars = {
  Avatar10: require("../../assets/images/xs/avatar10.jpg"),
  Avatar11: require("../../assets/images/xs/avatar11.jpg"),
  Avatar3: require("../../assets/images/xs/avatar3.jpg"),
  Avatar4: require("../../assets/images/xs/avatar4.jpg"),
  Avatar9: require("../../assets/images/xs/avatar9.jpg"),
  Avatar6: require("../../assets/images/xs/avatar6.jpg"),
};



return (
  <div className="card" style={{ width: "100%" }}>
    <div className="card-header py-3 border-bottom pb-2" style={{ height: "50px" }}>
      <h6 className="mb-0 fw-bold">리뷰 관리</h6>
    </div>
    <div className="card-body">
      <div className="flex-grow-1 mem-list">
        {reviews.map((review) => (
          <div key={review.id} className="py-2 d-flex align-items-center border-bottom">
            <div className="d-flex ms-2 align-items-center flex-fill">
              <div className="d-flex flex-column ps-2">
                <h6 className="fw-bold mb-0">{review.user_name}</h6>
                <span className="small text-muted">별점: {review.rating}</span>
                {review.content && <p>{review.content}</p>}
              </div>
            </div>
            <button
              type="button"
              className="btn light-danger-bg text-end"
              data-bs-toggle="modal"
              data-bs-target="#dremovetask"
              onClick={()=>deleteReview(review.id)}
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);
};

export default ReviewTask;
