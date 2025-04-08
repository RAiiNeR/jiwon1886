// 2025.01.24. 15:15 생성자: 이학수, HTML템플릿을 리엑트로 조정
import React, { useEffect, useState } from 'react'
import { appear_animate, handleScroll, updateHalfHeight } from '../../Comm/CommomFunc';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ko } from "date-fns/locale/ko"; // 한국어 로케일 가져오기
import { Link, useParams } from 'react-router-dom';
import ModalVideo from 'react-modal-video';
import ImgCarouselTour from '../../Comm/ImgCarouselTour';
import TourSchedule from './TourSchedule';
import axios from 'axios';
import Modal from './Modal';
import Pagenation from '../../Comm/Pagenation';
import ReviewList from './ReviewList';
import { parseJwt } from '../../Comm/jwtUtils';

registerLocale("ko", ko);
// 🟢 투어 일정 아이템 (각 날짜별 일정 항목)
interface ScheduleItem {
    title: string;
    type: string;
    description: string;
}
interface TourImage {
    tour_info_num: number;
    img_name: string;
}

interface Review {
    reviewId: number;
    userName: string;
    rating: number;
    content: string;
    createdAt: string;
    sentiment: "positive" | "negative";
}
// 🟢 날짜별 일정 데이터 (ex: { 1: [일정1, 일정2], 2: [일정3] })
interface ScheduleData {
    [day: number]: ScheduleItem[];
}

// 🟢 투어 상세 정보 (백엔드에서 가져오는 데이터 구조)
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
    video_link: string | null;
    images: TourImage[];
    schedules: ScheduleItem[];
    tdate: string;
}

const TourDetail: React.FC = () => {
    // 차후 사용시 주석 해제
    // const num = useParams()
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState(1);
    const [tourData, setTourData] = useState<TourData | null>(null);
    const [tourSchedule, setTourSchedule] = useState<Record<number, ScheduleItem[]>>({});
    const [rating, setRating] = useState<number>(0);
    const [review, setReview] = useState<string>("");
    const [reviews, setReviews] = useState<Review[]>([]);
    const { tourId } = useParams<{ tourId: string }>();  // ✅ URL에서 tourId 가져오기
    const [loading, setLoading] = useState(true);  // ✅ 로딩 상태
    const [similarTours, setSimilarTours] = useState<TourData[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userToken, setUserToken] = useState<number | null>(null);

    // ✅ 로그인 여부 확인
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = parseJwt(token);
                if (decodedToken && decodedToken.num) {
                    setIsLoggedIn(true);
                    setUserToken(decodedToken.num);
                } else {
                    console.error("토큰에서 사용자 번호를 찾을 수 없습니다.");
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("토큰 파싱 오류:", error);
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const fetchReviews = async (tourId: string, page: number) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/reviews/${tourId}?page=${page}`);
            setReviews(response.data.reviews);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error("❌ 리뷰 데이터를 불러오는 중 오류 발생:", error);
            setLoading(false);
        }
    };


    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    useEffect(() => {
        if (!tourId) return;

        axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/tours/${tourId}`) // ✅ 경로를 "/api/tours/${tourId}"로 수정
            .then((response) => {
                //console.log("API 응답:", response.data);
                setTourData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("투어 데이터를 불러오는 중 오류 발생:", error);
                setLoading(false);
            });
        fetchReviews(tourId, currentPage);
    }, [tourId, currentPage]);


    useEffect(() => {
        if (!tourData) return;

        axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/tours/similar?theme=${tourData.theme}`) // ✅ 경로 수정
            .then((response) => {
                //console.log("🎯 비슷한 여행지 데이터:", response.data);
                const filteredTours = response.data
                    .filter((tour: TourData) => tour.num !== tourData.num) // ✅ 현재 투어 제외
                    .slice(0, 3); // ✅ 상위 3개만 선택
                setSimilarTours(filteredTours);
            })
            .catch((error) => console.error("비슷한 여행지를 불러오는 중 오류 발생:", error));

    }, [tourData]);

    // 리뷰 제출 핸들러 => 리뷰 보기로 기능 변경 필요
    const handleSubmit = () => {
        if (!review.trim()) return alert("아직 등록된 리뷰가 없습니다!");
        setReviews([...reviews,]);
        setRating(0);
        setReview("");
    };
    const getYouTubeVideoId = (url: string | null) => {
        if (!url) return null;
        const match = url.match(/[?&]v=([^&]+)/);
        return match ? match[1] : null;
    }

    const openModal = () => {
        setIsOpen(true);
    };

    const isopenModal = () => {
        setIsOpenModal(true);
    };



    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/tours/${tourId}/schedules`)
            .then((res) => setTourSchedule(res.data))
            .catch((err) => console.error('일정 데이터 로드 실패:', err));
    }, [tourId]);

    useEffect(() => {
        // 요소의 [data-scrollax] 옵션을 분석 적용
        handleScroll()
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        // ftco-animate 클래스를 가진 요소에 등장 효과 적용
        appear_animate()
    }, []);

    useEffect(() => {
        // js-halfheight 클래스를 가진 요소의 높이를 화면의 크기의 반으로 갱신
        updateHalfHeight();
        window.addEventListener("resize", updateHalfHeight);
        return () => {
            window.removeEventListener("resize", updateHalfHeight);
        };
    }, []);
    return (
        <div>
            <div className="hero-wrap js-halfheight" style={{ backgroundImage: `url(${process.env.REACT_APP_FILES_URL}/img/tour/${tourData?.thumbnail})` }}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="row no-gutters slider-text js-halfheight align-items-center justify-content-center" data-scrollax-parent="true">
                        <div className="col-md-9 ftco-animate text-center" data-scrollax={"{\"properties\": {\"translateY\": \"70%\"}}"}>
                            <p className="breadcrumbs" data-scrollax={"{\"properties\": {\"translateY\": \"30%\", \"opacity\": 1.6}}"}><span className="mr-2"><Link to="/traveler/home">Home</Link></span> <span className="mr-2"><Link to="/traveler/tour">Tour</Link></span></p>
                            <h1 className="mb-3 bread" data-scrollax={"{\"properties\": {\"translateY\": \"30%\", \"opacity\": 1.6}}"}>
                                {tourData?.name || "여행지 이름"}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
            <section className="ftco-section ftco-degree-bg">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 sidebar">
                            <div className="sidebar-wrap bg-light ftco-animate">
                                <div className="form-group text-center">
                                    <Link to="/traveler/tour/recommended" className="btn btn-info py-3 px-5 w-100" >
                                        AI 여행지 추천 !
                                    </Link>
                                </div>
                                <h3 className="heading mb-4">여행지 검색</h3>
                                <form action="#">
                                    <div className="fields">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control search-input"
                                                placeholder="검색어를 입력하세요"
                                                style={{ color: "black" }} // 입력값은 검은색
                                            />
                                        </div>
                                        <div className="form-group">
                                            <div className="select-wrap one-third">
                                                <div className="icon" color='gray'><span className="ion-ios-arrow-down"></span></div>
                                                <select name="" id="" className="form-control">
                                                    <option value="">일반</option>
                                                    <option value="">테마</option>
                                                    <option value="">지역</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <input type="submit" value="검색" className="btn btn-primary py-3 px-5" />
                                        </div>
                                    </div>

                                </form>

                                <h3 className="heading mb-4">Star Rating</h3>
                                <form method="post" className="star-rating">
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                        <label className="form-check-label" htmlFor="exampleCheck1">
                                            <p className="rate"><span><i className="icon-star"></i><i className="icon-star"></i><i className="icon-star"></i><i className="icon-star"></i><i className="icon-star"></i></span></p>
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                        <label className="form-check-label" htmlFor="exampleCheck1">
                                            <p className="rate"><span><i className="icon-star"></i><i className="icon-star"></i><i className="icon-star"></i><i className="icon-star"></i><i className="icon-star-o"></i></span></p>
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                        <label className="form-check-label" htmlFor="exampleCheck1">
                                            <p className="rate"><span><i className="icon-star"></i><i className="icon-star"></i><i className="icon-star"></i><i className="icon-star-o"></i><i className="icon-star-o"></i></span></p>
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                        <label className="form-check-label" htmlFor="exampleCheck1">
                                            <p className="rate"><span><i className="icon-star"></i><i className="icon-star"></i><i className="icon-star-o"></i><i className="icon-star-o"></i><i className="icon-star-o"></i></span></p>
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                        <label className="form-check-label" htmlFor="exampleCheck1">
                                            <p className="rate"><span><i className="icon-star"></i><i className="icon-star-o"></i><i className="icon-star-o"></i><i className="icon-star-o"></i><i className="icon-star-o"></i></span></p>
                                        </label>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-9">
                            <div className="row">
                                <div className="col-md-12 ftco-animate">
                                    <ImgCarouselTour data={tourData?.images.map(img => img.img_name) || []} />
                                </div>
                                <div className="col-md-12 hotel-single mt-4 mb-5 ftco-animate">

                                    <span>당신에게 딱 맞는 여행을 찾아보세요</span>
                                    <h2>{tourData?.name}</h2>
                                    <p className="rate mb-5">
                                        <span className="loc"><Link to="#"><i className="icon-map"></i>{tourData?.location}</Link></span>
                                        <span className="star" style={{ color: "#f85959", fontWeight: "bold", fontSize: "11px" }}>
                                            {[...Array(5)].map((_, index) => (
                                                <i key={index} className={index < (tourData?.rating || 0) ? "icon-star" : "icon-star-o"}></i>
                                            ))}
                                            {tourData?.rating} / 5 별점
                                        </span>
                                        <span className="ml-3" style={{ color: "#555", fontSize: "12px" }}>
                                            <i className="icon-eye"></i> {tourData?.hit?.toLocaleString()} 조회
                                        </span>
                                    </p>
                                    <p>{tourData?.content || "여행지 설명이 없습니다."}</p>
                                </div>
                                <div className="col-md-12 hotel-single ftco-animate mb-5 mt-4">
                                    <TourSchedule schedules={tourSchedule} />
                                    <h4 className="mb-4">여행지 미리 둘러보기</h4>

                                    <div className="block-16">
                                        <figure style={{ position: "relative", cursor: "pointer" }} onClick={openModal}>
                                            <img
                                                src={tourData?.thumbnail ? `${process.env.REACT_APP_FILES_URL}/img/tour/${tourData.thumbnail}` : `${process.env.REACT_APP_FILES_URL}/img/tour/default-thumbnail.jpg`}
                                                alt="여행지 미리보기"
                                                className="img-fluid"
                                                style={{ width: "100%", height: "400px", objectFit: "cover", borderRadius: "10px" }}
                                            />
                                            <div className="play-button popup-vimeo">
                                                <span className="icon-play"></span>
                                            </div>
                                        </figure>
                                    </div>
                                    <div className="col-md-12 hotel-single ftco-animate mb-5 mt-4">
                                        <ReviewList tourId={tourId as string} />



                                        {isLoggedIn ? (
                                            <button onClick={() => setIsOpenModal(true)} className="btn btn-primary mt-3">
                                                리뷰 작성
                                            </button>
                                        ) : (
                                            <p style={{ color: "red", fontWeight: "bold", marginTop: "10px" }}>
                                                🚨 리뷰를 작성하려면 로그인이 필요합니다.
                                            </p>
                                        )}


                                        {/* ✅ 리뷰 작성 모달 */}
                                        <Modal
                                            isOpenModal={isOpenModal}
                                            onClose={() => setIsOpenModal(false)}
                                            tourNum={Number(tourId)}
                                            fetchAverageRating={() => fetchReviews(tourId as string, currentPage)}
                                            fetchReviews={() => fetchReviews(tourId as string, currentPage)} // ✅ 함수 호출 시 매개변수 전달
                                        />

                                    </div>
                                </div>
                                <div className="col-md-12 hotel-single ftco-animate mb-5 mt-4">
                                    <h4 className="mb-4">비슷한 테마의 다른 여행지</h4>
                                    <div className="row">
                                        {similarTours.length === 0 ? (
                                            <p>비슷한 여행지가 없습니다.</p>
                                        ) : (
                                            similarTours.map((tour) => (
                                                <div key={tour.num} className="col-md-4">
                                                    <div className="destination">
                                                        <Link to={`/traveler/tour/${tour.num}`} className="img img-2"
                                                            style={{ backgroundImage: `url(${process.env.REACT_APP_FILES_URL}/img/tour/${tour.thumbnail})` }}>
                                                        </Link>
                                                        <div className="text p-3">
                                                            <div className="d-flex">
                                                                <div className="one">
                                                                    <h3><Link to={`/traveler/tour/${tour.num}`}>{tour.name}</Link></h3>
                                                                    <p className="rate">
                                                                        {[...Array(5)].map((_, index) => (
                                                                            <i key={index} className={index < tour.rating ? "icon-star" : "icon-star-o"}></i>
                                                                        ))}
                                                                        <span> {tour.rating} / 5</span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <p>{tour.content.length > 10 ? `${tour.content.slice(0, 12)}...` : tour.content}</p>
                                                            <hr />
                                                            <p className="bottom-area d-flex">
                                                                <span><i className="icon-map-o"></i> {tour.location}</span>
                                                                <span className="ml-auto"><Link to={`/traveler/tour/${tour.num}`}>상세보기</Link></span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>


                                {/* <div className="col-md-12 hotel-single ftco-animate mb-5 mt-5">
                                    <h4 className="mb-4">이용할만한 근처 숙소</h4>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="destination">
                                                <Link to="/traveler/hotels/1" className="img img-2" style={{ backgroundImage: "url(/images/hotel-1.jpg)" }}></Link>
                                                <div className="text p-3">
                                                    <div className="d-flex">
                                                        <div className="one">
                                                            <h3><Link to="/traveler/hotels/1">Hotel, Italy</Link></h3>
                                                            <p className="rate">
                                                                <i className="icon-star"></i>
                                                                <i className="icon-star"></i>
                                                                <i className="icon-star"></i>
                                                                <i className="icon-star"></i>
                                                                <i className="icon-star-o"></i>
                                                                <span>8 Rating</span>
                                                            </p>
                                                        </div>
                                                        <div className="two">
                                                            <span className="price per-price">$40<br /><small>/night</small></span>
                                                        </div>
                                                    </div>
                                                    <p>Far far away, behind the word mountains, far from the countries</p>
                                                    <hr />
                                                    <p className="bottom-area d-flex">
                                                        <span><i className="icon-map-o"></i> Miami, Fl</span>
                                                        <span className="ml-auto"><Link to="#">상세보기</Link></span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="destination">
                                                <Link to="/traveler/hotels/1" className="img img-2" style={{ backgroundImage: "url(/images/hotel-2.jpg)" }}></Link>
                                                <div className="text p-3">
                                                    <div className="d-flex">
                                                        <div className="one">
                                                            <h3><Link to="/traveler/hotels/1">Hotel, Italy</Link></h3>
                                                            <p className="rate">
                                                                <i className="icon-star"></i>
                                                                <i className="icon-star"></i>
                                                                <i className="icon-star"></i>
                                                                <i className="icon-star"></i>
                                                                <i className="icon-star-o"></i>
                                                                <span>8 Rating</span>
                                                            </p>
                                                        </div>
                                                        <div className="two">
                                                            <span className="price per-price">$40<br /><small>/night</small></span>
                                                        </div>
                                                    </div>
                                                    <p>Far far away, behind the word mountains, far from the countries</p>
                                                    <hr />
                                                    <p className="bottom-area d-flex">
                                                        <span><i className="icon-map-o"></i> Miami, Fl</span>
                                                        <span className="ml-auto"><Link to="#">상세보기</Link></span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="destination">
                                                <Link to="/traveler/hotels/1" className="img img-2" style={{ backgroundImage: "url(/images/hotel-3.jpg)" }}></Link>
                                                <div className="text p-3">
                                                    <div className="d-flex">
                                                        <div className="one">
                                                            <h3><Link to="/traveler/hotels/1">Hotel, Italy</Link></h3>
                                                            <p className="rate">
                                                                <i className="icon-star"></i>
                                                                <i className="icon-star"></i>
                                                                <i className="icon-star"></i>
                                                                <i className="icon-star"></i>
                                                                <i className="icon-star-o"></i>
                                                                <span>8 Rating</span>
                                                            </p>
                                                        </div>
                                                        <div className="two">
                                                            <span className="price per-price">$40<br /><small>/night</small></span>
                                                        </div>
                                                    </div>
                                                    <p>Far far away, behind the word mountains, far from the countries</p>
                                                    <hr />
                                                    <p className="bottom-area d-flex">
                                                        <span><i className="icon-map-o"></i> Miami, Fl</span>
                                                        <span className="ml-auto"><Link to="#">상세보기</Link></span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal Video */}
            {tourData?.video_link && (
                <ModalVideo
                    channel="youtube"
                    isOpen={isOpen}
                    videoId={getYouTubeVideoId(tourData.video_link) || ""}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </div>
    )
}

export default TourDetail

