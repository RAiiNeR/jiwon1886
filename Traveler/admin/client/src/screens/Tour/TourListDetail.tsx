import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ModalVideo from 'react-modal-video';
import 'react-modal-video/css/modal-video.min.css';
import { Carousel } from 'react-bootstrap';
import ReviewTask from '../../components/Projects/ReviewTask';
import RecommendTask from '../../components/Projects/RecommendTask';
import axios from 'axios';

interface Tour {
  name: string;
  content: string;
  location: string;
  theme: string;
  video_link: string;
  thumbnail: string;
  images: { img_name: string }[];
  rating: number;
  schedules: { day: number; place: string; content: string }[];
}

const TourListDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isOpen, setIsOpen] = useState(false);
  const [tour, setTour] = useState<Tour | null>(null);
  const [reviews, setReviews] = useState();
  const [totalPages, setTotalPages] = useState(0); 
  const [currentPage, setCurrentPage] = useState(1);

  const openModal = () => {
    setIsOpen(true);
  };
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
  };
  useEffect(() => {
    const fetchTourDetail = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/tours/${id}`);
        console.log("✅ 투어 데이터:", response.data);
        setTour(response.data);
      } catch (error) {
        console.error("❌ 투어 정보를 불러오는 중 오류 발생:", error);
      }
    };

    fetchTourDetail();
  }, [id]);

  if (!tour) {
    return <p className="text-center mt-5">⏳ 투어 정보를 불러오는 중...</p>;
  }

  

  return (
    <div>
      <section className="ftco-section ftco-degree-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-9">
              <div className="row">
                {/* 이미지 캐러셀 */}
                <div className="img-carousel-test">
                  <Carousel controls={true}>
                    {tour.images.length > 0 ? (
                      tour.images.map((image, index) => (
                        <Carousel.Item key={index}>
                          <img
                            src={`${process.env.REACT_APP_FILES_URL}/img/tour/${image.img_name}`}
                            alt={`Slide ${index + 1}`}
                            style={{ width: "100%", height: "500px", objectFit: "cover" ,borderRadius: "10px"}}
                          />
                        </Carousel.Item>
                      ))
                    ) : (
                      <Carousel.Item>
                        <img
                          src="/imgs/default-image.jpg"
                          alt="기본 이미지"
                          style={{ width: "100%", height: "500px", objectFit: "cover" , borderRadius: "10px" }}
                        />
                      </Carousel.Item>
                    )}
                  </Carousel>
                </div>

                {/* 제목 & 설명 */}
                <div className="col-md-12 hotel-single mt-4 mb-5">
                  <h2>{tour.name}</h2>
                  <p className="rate mb-3">
                    <span className="loc">
                      <i className="icon-map"></i> {tour.location}
                    </span>
                  </p>

                  {/* 별점 표시 */}
                  <div className="d-flex align-items-center mb-3">
                    <span className="me-3">
                      {[...Array(Math.floor(tour.rating))].map((_, i) => (
                        <i key={i} className="bi bi-star-fill text-warning"></i>
                      ))}
                      {tour.rating % 1 !== 0 && <i className="bi bi-star-half text-warning"></i>}
                      <span style={{ color: "red", marginLeft: "10px" }}>{tour.rating} / 5 별점</span>
                    </span>
                  </div>

                  {/* 설명 부분 */}
                  <div className="p-4 mb-4" style={{ border: "1px solid #ddd", borderRadius: "10px", boxShadow: "2px 2px 10px rgba(0,0,0,0.1)" }}>
                    <h5>여행 설명</h5>
                    <p style={{ lineHeight: "1.8" }}>{tour.content}</p>
                  </div>

                  {/* 일정 목록 */}
                  <div className="mb-5">
                    <h5 className="mb-3">📅 여행 일정</h5>
                    <table className="table table-bordered">
                      <thead>
                        <tr className="table-primary">
                          <th>날짜</th>
                          <th>장소</th>
                          <th>내용</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tour.schedules.map((schedule, index) => (
                          <tr key={index} className={index % 2 === 0 ? "table-light" : "table-secondary"}>
                            <td>{schedule.day}일차</td>
                            <td>{schedule.place}</td>
                            <td>{schedule.content}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 비디오 미리보기 */}
                {tour.video_link && (
                  <div className="col-md-12 hotel-single mb-5 mt-4">
                    <h4 className="mb-4">여행지 미리 둘러보기</h4>
                    <div className="block-16" style={{ display: "flex", justifyContent: "center", position: "relative" }}>
                      <figure style={{ position: "relative", display: "inline-block" }}>
                        <img
                          src={tour.thumbnail ? `${process.env.REACT_APP_FILES_URL}/img/tour/${tour.thumbnail}` : "/imgs/default-image.jpg"}
                          alt="placeholder"
                          className="img-fluid"
                          onClick={openModal}
                          style={{ cursor: "pointer", width: 600, height: 400, margin: "0 auto" }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={openModal}
                        >
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </figure>
                    </div>
                  </div>
                )}

                {/* 리뷰 및 추천 섹션 */}
                <div className="management mt-5">
                  <h3 style={{ marginBottom: "10px" }}>관리</h3>
                  <div className="row d-flex justify-content-between">
                    <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12">
                      <ReviewTask tourNum={Number(id)}/>
                    </div>
                    {/* <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12">
                      <RecommendTask />
                    </div> */}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Video */}
      {tour.video_link && (
        <ModalVideo
        channel="youtube"
        isOpen={isOpen}
        videoId={getYouTubeVideoId(tour.video_link) || tour.video_link}
        onClose={() => setIsOpen(false)}
      />
        //  <ModalVideo
        //               channel="vimeo" // vimeo 플랫폼 설정
        //               isOpen={isOpen}
        //               videoId="45830194" // Vimeo의 비디오 ID
        //               onClose={() => setIsOpen(false)}
        //           />
      )}
    </div>
  );
};

export default TourListDetail;
