import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

interface TourCardProps {
  teamImage: string;
  images?: { img_name: string }[];
  thumbnail?: string;
  title: string;
  rating: number;
  location: string;
  duration: string;
  theme: string;
  id: number;
  onClickEdit: () => void;
  onClickDelete: () => void;
  periods?: string[];
}

const TourCard: React.FC<TourCardProps> = (props) => {
  const { theme, images, thumbnail, periods,location ,...restProps } = props;
  const defaultImage = thumbnail
    ? `${process.env.REACT_APP_FILES_URL}/img/tour/${thumbnail}`
    : props.teamImage;

  const logoMap: Record<string, string> = {
    EP: "icofont-airplane-alt",
    EJ: "icofont-film",
    IP: "icofont-paint",
    IJ: "icofont-music-alt",
  }
  const logoBgMap: Record<string, string> = {
    EP: "bg-info",
    EJ: "bg-primary",
    IP: "bg-success",
    IJ: "bg-warning",
  };
  const logo = logoMap[theme] || "icofont-ui-travel"; // 기본값
  const logoBg = logoBgMap[theme] || "bg-secondary"; // 기본값
  const [hover, setHover] = useState(false);
  const [hoverImage, setHoverImage] = useState<string>(defaultImage);
  const [tourperiod, setTourperiod] = useState("");
  const [imageKey, setImageKey] = useState(Date.now());
  const [reviewsCount, setReviewsCount] = useState<number>(0);

  useEffect(() => {
    // 랜덤 기간 설정
    if (periods && periods.length > 0) {
      const randomIndex = Math.floor(Math.random() * periods.length);
      setTourperiod(periods[randomIndex]);
    } else {
      setTourperiod("기간 정보 없음");
    }
  }, [periods]);

  useEffect(() => {
    // ✅ 백엔드에서 리뷰 개수 가져오기
    const fetchReviewCount = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACK_END_URL}/api/tours/${props.id}/review-count`
        );
        console.log(`🛠️ 리뷰 개수 (${props.id}):`, response.data);
        setReviewsCount(response.data);
      } catch (error) {
        console.error(`❌ 리뷰 개수 조회 실패 (투어 ID: ${props.id})`, error);
        setReviewsCount(0);
      }
    };
    fetchReviewCount();
  }, [props.id]);


  const handleMouseEnter = () => {
    setHover(true);
    if (images && images.length > 0) {
      const randomIndex = Math.floor(Math.random() * images.length);
      const newImageUrl = `${process.env.REACT_APP_FILES_URL}/img/tour/${images[randomIndex].img_name}?timestamp=${Date.now()}`;
      //console.log("🔍 Hover 이미지 변경:", newImageUrl);
      setHoverImage(newImageUrl);
      setImageKey(Date.now()); // 강제 리렌더링
    }
  };

  // 🖱️ 마우스 아웃 시 원래 썸네일로 복구 (✅ 썸네일 유지)
  const handleMouseLeave = () => {
    setHover(false);
    //console.log("🔙 원래 썸네일 복구:", defaultImage);
    setHoverImage(defaultImage);
    setImageKey(Date.now()); // 강제 리렌더링
  };


  const imageStyle: React.CSSProperties = {
    width: "350px",
    height: "200px",
    transition: "filter 0.3s ease-in-out",
    filter: hover ? "brightness(0.5)" : "brightness(1)", // hover 시 어두워짐
  };

  const iconStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    opacity: hover ? 1 : 0,
    transition: "opacity 0.3s ease-in-out",
    color: "white",
    fontSize: "30px",
    zIndex: 10,  // 아이콘이 항상 위에 보이도록 설정
  };

  return (
    <div className="card">
      <div className="card-body">
        {/* 상단 테마 및 아이콘 */}
        <div className="d-flex align-items-center justify-content-between mt-2">
          <h6 className="mb-0 fw-bold fs-6 mb-2">{props.title}</h6>
          <div className="lesson_name">
            <div className={`project-block ${logoBg}`}>
              <i className={logo}></i>
            </div>
            <span className="small text-muted project_name fw-bold">{props.theme}</span>
          </div>
          <div className="btn-group">
            <button type="button" className="btn btn-outline-secondary" onClick={props.onClickEdit}>
              <i className="icofont-edit text-success"></i>
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={props.onClickDelete}>
              <i className="icofont-ui-delete text-danger"></i>
            </button>
          </div>
        </div>

        {/* 이미지 및 호버 시 변경 */}
        <div className="d-flex align-items-center justify-content-center position-relative">
          <Link to={`${process.env.REACT_APP_BASE_URL}/tourlist/tour/detail/${props.id}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img key={imageKey} src={hoverImage} style={imageStyle} alt="Tour" />
            <span style={iconStyle}>
              <FaSearch />
            </span>
          </Link>
        </div>

        {/* 하단 정보 */}
        <div className="row g-2 pt-4">
          <div className="col-6">
            <div className="d-flex align-items-center">
              <i className="icofont-star"></i>
              <span className="ms-2">{props.rating.toFixed(1)} / 5</span>
            </div>
          </div>
          <div className="col-6">
            <div className="d-flex align-items-center">
              <i className="icofont-location-pin"></i> {/* 지역 아이콘 */}
              <span className="ms-2">{location}</span> {/* 지역 정보 표시 */}
            </div>
          </div>
        
        <div className="col-6">
          <div className="d-flex align-items-center">
            <i className="icofont-sand-clock"></i>
            <span className="ms-2">{props.duration}</span>
          </div>
        </div>
        <div className="col-6">
          <div className="d-flex align-items-center">
            <i className="icofont-ui-text-chat"></i>
            <span className="ms-2">{reviewsCount}개 리뷰</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
