// 2025.01.24. 19:00 생성자: 이학수, HTML템플릿을 리엑트로 조정
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { appear_animate, handleScroll, updateHalfHeight } from '../../Comm/CommomFunc';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ko } from "date-fns/locale/ko"; // 한국어 로케일 가져오기
import ChartComponent from "./components/ChartComponent";
import RecommendationList from './components/RecommendationList';
import "../../css/tour.css";
import axios from 'axios';
import Pagenation from '../../Comm/Pagenation';
import ChartComponent2 from './components/ChartComponent2';
registerLocale("ko", ko);
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
    images: { img_name: string }[]; // ✅ 추가
    schedules: { day: number; place: string; content: string }[]; // ✅ 추가
    reviewCount?: number;
}
interface RecommendationProps {
    place: string;
}

const Tour: React.FC = () => {
    const [selectedFDate, setSelectedFDate] = useState<Date | null>(null);
    const [tourList, setTourList] = useState<TourData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [recommendedPlace, setRecommendedPlace] = useState<string>("");
    const [selectedTDate, setSelectedTDate] = useState<Date | null>(null);
    const [hover, setHover] = useState(false);
    const [hover2, setHover2] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState<string>(""); // 검색어 상태
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const pageSize = 6; // 한 페이지에 6개씩
    const pageGroupSize = 5; // ✅ 5개씩 그룹으로 나눔
    const currentGroup = Math.floor(currentPage / pageGroupSize); // ✅ 현재 페이지 그룹

    const [satisfactionData, setSatisfactionData] = useState<{ categories: string[]; data: number[] }>({ categories: [], data: [] });
    const [visitData, setVisitData] = useState<{ categories: string[]; data: number[] }>({ categories: [], data: [] });
    const [sortBy, setSortBy] = useState<string>("latest");

    const handlePrevGroup = () => {
        setCurrentPage((currentGroup - 1) * pageGroupSize + (pageGroupSize - 1));
    };

    
    const handleNextGroup = () => {
        setCurrentPage((currentGroup + 1) * pageGroupSize);
    };

    const fetchReviewsForTours = async (tours: TourData[]): Promise<TourData[]> => {
        return await Promise.all(
            tours.map(async (tour) => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/tours/${tour.num}/review-count`);
                    console.log(`🛠️ 리뷰 개수 (${tour.num}):`, response.data);
                    return { ...tour, reviewCount: response.data };
                } catch (error) {
                    console.error(`❌ 리뷰 개수 조회 실패 (투어 ID: ${tour.num})`, error);
                    return { ...tour, reviewCount: 0 };
                }
            })
        );
    };

    const fetchAllTours = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/tours/all`, {
                params: { size: 1000 } // ✅ 충분히 큰 값을 설정하여 모든 데이터를 가져옴
            });
    
            if (!response.data) return;
    
            const allTours = response.data;
            const toursWithReviews = await fetchReviewsForTours(allTours);
    
            // ✅ 지역별 데이터 계산
            const regionalData = toursWithReviews.reduce((acc, tour) => {
                if (tour.rating === 0) return acc; // ✅ 별점이 0인 여행지는 제외
    
                if (!acc[tour.location]) {
                    acc[tour.location] = { totalRating: 0, totalReview: 0, count: 0 };
                }
                acc[tour.location].totalRating += tour.rating;
                acc[tour.location].totalReview += tour.reviewCount ?? 0;
                acc[tour.location].count += 1; // ✅ 평균을 내기 위해 개수 카운트
                return acc;
            }, {} as Record<string, { totalRating: number; totalReview: number; count: number }>);
    
            // ✅ 만족도(별점 평균) 상위 3개 (별점이 0인 데이터 제외)
            const sortedByRating = Object.entries(regionalData)
                .map(([location, data]) => ({
                    location,
                    avgRating: data.count > 0 ? data.totalRating / data.count : 0, // ✅ 개수 0일 경우 예외 처리
                }))
                .filter(item => item.avgRating > 0) // ✅ 별점 평균이 0 이상인 경우만 포함
                .sort((a, b) => b.avgRating - a.avgRating)
                .slice(0, 3);
    
            // ✅ 방문 수(리뷰 개수) 상위 3개
            const sortedByReview = Object.entries(regionalData)
                .map(([location, data]) => ({
                    location,
                    totalReview: data.totalReview, // ✅ 리뷰 개수는 합산
                }))
                .sort((a, b) => b.totalReview - a.totalReview)
                .slice(0, 3);
    
            // ✅ 차트 데이터 업데이트
            setSatisfactionData({
                categories: sortedByRating.map((item) => item.location),
                data: sortedByRating.map((item) => item.avgRating), // ✅ 별점 평균
            });
    
            setVisitData({
                categories: sortedByReview.map((item) => item.location),
                data: sortedByReview.map((item) => item.totalReview), // ✅ 리뷰 개수 합산
            });
    
        } catch (error) {
            console.error('❌ 전체 투어 데이터 로딩 실패:', error);
        }
    };
    
    useEffect(() => {
        fetchAllTours(); // ✅ 차트 데이터는 전체 데이터를 기준으로 설정
    }, []);
    


    useEffect(() => {
        // 요소의 [data-scrollax] 옵션을 분석 적용
        handleScroll()
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        // js-halfheight 클래스를 가진 요소의 높이를 화면의 크기 반으로 갱신
        updateHalfHeight();
        window.addEventListener("resize", updateHalfHeight);
        return () => {
            window.removeEventListener("resize", updateHalfHeight);
        };
    }, []);

    useEffect(() => {
        //console.log("📌 현재 totalPages 값:", totalPages);
    }, [totalPages]);

    useEffect(() => {
        // ftco-animate 클래스를 가진 요소에 등장 효과 적용
        appear_animate()
    }, [tourList]);

    const fetchTours = (page: number, keyword: string, sort: string) => {
    setTourList([]);
    setLoading(true);

    axios
        .get(`${process.env.REACT_APP_BACK_END_URL}/api/tours`, {
            params: {
                page: page,
                size: pageSize,
                keyword: keyword,
                sort: sort === 'latest' ? null : sort,
            },
        })
        .then((response) => {
            if (!response.data || !response.data.content) return;

            fetchReviewsForTours(response.data.content).then((updatedTours) => {
                let sortedTours = [...updatedTours];

                if (sort === 'rating,desc') {
                    sortedTours.sort((a, b) => b.rating - a.rating);
                } else if (sort === 'review,desc') {
                    sortedTours.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
                }

                setTourList(sortedTours);
                setTotalPages(response.data.totalPages ?? 1);
                setLoading(false);

            });
        })
        .catch((error) => {
            console.error('❌ API 요청 실패:', error.response ? error.response.data : error);
            setTourList([]);
            setLoading(false);
        });
};

    const handleSort = (sort: string) => {
        setSortBy(sort);
        setCurrentPage(1); // ✅ 정렬 시 첫 페이지로 이동
        fetchTours(1, searchKeyword, sort);
    };

    useEffect(() => {
        fetchTours(currentPage, searchKeyword, sortBy);
    }, [currentPage, sortBy]);

    // ✅ 검색 이벤트 핸들러
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1); // 검색 시 첫 페이지로 이동
        setTourList([]);
        fetchTours(1, searchKeyword, sortBy);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch(e);
        }
    };

    useEffect(() => {
        const allDestinations = ['서울', '제주도', '부산', '강원도'];
        const randomPlace = allDestinations[Math.floor(Math.random() * allDestinations.length)];
        setRecommendedPlace(randomPlace);
    }, []);


    const calculateRegionalAverages = (tours: TourData[]) => {
        const regionalData: { [key: string]: { ratingSum: number; reviewSum: number; count: number } } = {};
    
        tours.forEach((tour) => {
            if (!regionalData[tour.location]) {
                regionalData[tour.location] = { ratingSum: 0, reviewSum: 0, count: 0 };
            }
            regionalData[tour.location].ratingSum += tour.rating;
            regionalData[tour.location].reviewSum += tour.reviewCount ?? 0;
            regionalData[tour.location].count++;
        });
    
        const averages: { location: string; avgRating: number; avgReview: number }[] = [];
        for (const location in regionalData) {
            averages.push({
                location: location,
                avgRating: regionalData[location].ratingSum / regionalData[location].count,
                avgReview: regionalData[location].reviewSum,
            });
        }
    
        return averages;
    };

  

    useEffect(() => {
        // 로딩이 필요할때 로딩화면 출력, 설정한 시간만큼 출력
        setTimeout(function () {
            const ftco_loader = document.getElementById('ftco-loader')
            if (ftco_loader) {
                ftco_loader.className = 'fullscreen';
            }
        }, 1);
    }, [])
 
    return (
        <div>
            <div className="hero-wrap js-halfheight" style={{ backgroundImage: "url('./images/tr.png')" }}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="row no-gutters slider-text js-halfheight align-items-center justify-content-center" data-scrollax-parent="true">
                        <div className="col-md-9 ftco-animate text-center" data-scrollax={"{\"properties\": {\"translateY\": \"70%\"}}"}>
                            <p className="breadcrumbs" data-scrollax={"{\"properties\": {\"translateY\": \"30%\", \"opacity\": 1.6}}"}><span className="mr-2"><Link to="/traveler/home">Home</Link></span> <span>Tour</span></p>
                            <h1 className="mb-3 bread" data-scrollax={"{\"properties\": {\"translateY\": \"30%\", \"opacity\": 1.6}}"}>여행지</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tour-container">
                <div className="tour-chart-container">
                <ChartComponent title="만족도가 높은 여행지 TOP 3" categories={satisfactionData.categories} data={satisfactionData.data} label="만족도" />
                <ChartComponent2 title="최근 많이 가는 여행지 TOP 3" categories={visitData.categories} data={visitData.data} label="방문 수" />
                </div>
                <RecommendationList place={recommendedPlace} />

            </div>

            <section className="tour-list-user">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 sidebar ftco-animate">
                            <div className="sidebar-wrap bg-light ftco-animate">
                                <div className="form-group text-center">
                                    <Link to="/traveler/tour/recommended" className="btn btn-info py-3 px-5 w-100" >
                                        여행지 추천받기 !
                                    </Link>
                                </div>
                                <h3 className="heading mb-4">여행지 검색</h3>

                                <form onSubmit={handleSearch}>
                                    <div className="fields">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control search-input"
                                                placeholder="여행지 또는 지역 검색"
                                                value={searchKeyword}
                                                onChange={(e) => setSearchKeyword(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                style={{ color: "black" }} // 입력값은 검은색
                                            />
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
                                            {/* <button style={{
                                                background: hover ? "transparent" : "#2f89fc",
                                                border: "1.5px solid #2f89fc",
                                                color: hover ? "#2f89fc" : "white",
                                                borderRadius: "20px",
                                                padding: "6px 15px",
                                                fontSize: "14px",
                                                fontWeight: "bold",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease-in-out"
                                            }}
                                                onMouseEnter={() => setHover(true)}
                                                onMouseLeave={() => setHover(false)}
                                                onClick={() => handleSort("rating,desc")}
                                            >
                                                인기 순
                                            </button> */}
                                            <button style={{
                                                background: hover2 ? "transparent" : "#2f89fc",
                                                border: "1.5px solid #2f89fc",
                                                color: hover2 ? "#2f89fc" : "white",
                                                borderRadius: "20px",
                                                padding: "6px 15px",
                                                fontSize: "14px",
                                                fontWeight: "bold",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease-in-out"

                                            }}
                                                onMouseEnter={() => setHover2(true)}
                                                onMouseLeave={() => setHover2(false)}
                                                onClick={() => handleSort("review,desc")}
                                            >
                                                리뷰 많은 순
                                            </button>
                                        </div>
                                        <div className="form-group">
                                            <div className="select-wrap one-third">

                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <button type="submit" className="btn btn-primary py-3 px-5">검색</button>
                                        </div>
                                    </div>

                                </form>

                                {/* <h3 className="heading mb-4">Star Rating</h3>
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
                                </form> */}
                            </div>
                        </div>

                        <div className="col-lg-9">
                            <div className="row">
                                {!tourList || tourList.length === 0 ? (
                                    <p className="text-center">여행지를 찾을 수 없습니다.</p>
                                ) : (
                                    tourList.map((tour) => (
                                        <div key={tour.num} className="col-md-4 ftco-animate">
                                            <div className="destination">
                                                <Link to={`/traveler/tour/${tour.num}`}
                                                    className="img img-2 d-flex justify-content-center align-items-center"
                                                    style={{ backgroundImage: `url('${process.env.REACT_APP_FILES_URL}/img/tour/${tour.thumbnail}')` }}>
                                                    <div className="icon d-flex justify-content-center align-items-center">
                                                        <span className="icon-search2"></span>
                                                    </div>

                                                </Link>
                                                <div className="text p-3">
                                                    <h3><Link to={`/traveler/tour/${tour.num}`}>{tour.name}</Link></h3>

                                                    {/* 별점 표시 */}
                                                    <p className="rate" style={{ marginBottom: "0.5em" }}>
                                                        {[...Array(5)].map((_, i) => (
                                                            <i key={i} className={i < tour.rating ? "icon-star" : "icon-star-o"}></i>
                                                        ))}
                                                        <span style={{ color: "#f85959", fontWeight: "bold", fontSize: "11px" }}>
                                                            {tour.rating} / 5 별점
                                                        </span>

                                                    </p>

                                                    {/* 리뷰 개수를 별도의 <p> 태그로 처리 */}
                                                    <p style={{ marginBottom: "0.5em" }}>
                                                        <span style={{ color: "#2f89fc", fontSize: "13px", fontWeight: "bold" }}>
                                                            리뷰 {tour.reviewCount ?? 0} 개
                                                        </span>
                                                        <span className="ml-3" style={{ color: "#f85959", fontSize: "12px" }}>
                                                            <i className="icon-eye"></i> {tour?.hit?.toLocaleString()}
                                                        </span>

                                                    </p>
                                                    <p>{tour.content.length > 10 ? `${tour.content.slice(0,12)}...`:tour.content}</p>
                                                    <p className="days"><span>일정 : {tour.days} 일</span></p>
                                                    <hr />
                                                    {/* 위치 및 상세보기 링크 */}
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
                            <Pagenation page={currentPage} totalPages={totalPages} pageChange={setCurrentPage} />

                        </div>
                    </div>
                </div >
                <style>
                    {`
                        .search-input::placeholder {
                            color: lightgray !important;
                            opacity: 1;
                        }
                        .search-input {
                            color: black;
                        }
                    `}
                </style>
            </section >
        </div >
    )
}

export default Tour