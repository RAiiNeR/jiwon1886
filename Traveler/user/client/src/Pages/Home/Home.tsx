// 2025.01.21. 19:35 생성자: 이학수, HTML템플릿을 리엑트로 조정
import React, { useEffect, useState } from 'react'
import { appear_animate, handleScroll, updateHeight } from '../../Comm/CommomFunc';
import { Link } from 'react-router-dom';
import GalleryCarouselTour from '../../Comm/GalleryCarouselTour';
import MusicRecommendation from '../Music/MusicRecommendation';
import axios from 'axios';
import '../../css/BackpackList.css'

interface BackPackVO {
    NUM: number;           // 게시글 번호
    MEMBERNAME: string;    // 작성자 이름
    IMG_NAMES: string;    // 이미지 파일 리스트
    TAG: string[];         // 태그 리스트
    TITLE: string;         // 제목
    MEMBERNUM: number;     // 작성자 번호
    CONTENT: string;       // 내용
    HIT: number;
    CDATE: string;
    HEART: number;
}

const Home: React.FC = () => {
    const [backpack, setBackpack] = useState<BackPackVO[]>([]);
    const [isMusicModalOpen, setIsMusicModalOpen] = useState(false); // 모달 상태 관리
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
    const [currentPage, setCurrentPage] = useState(1); // 기본 1값을 초기화
    const itemsPerPage = 8; // 페이지당 항목 수
    const pagePerBlock = 5; // 한 블럭에 표시할 페이지 수
    const [title, setTitle] = useState(''); // 제목 검색

    const filePath = `${process.env.REACT_APP_FILES_URL}/img/backpack`;
    const getBackpackList = async () => {
        console.log(currentPage)
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/backpack/search`, {
                params: {
                    page: currentPage,
                    size: itemsPerPage,
                    title: title,
                },
            });
            console.log('API 응답 데이터:', response.data); // 응답 구조 확인
            const data: any = [...response.data.content];
            setBackpack(data.map((d: any) => {
                return {
                    ...d, memberName: d.name, memberNum: d.num,
                    // TAG: d.TAG ? d.TAG.split(",") : []
                    TAG: d.TAG ? (Array.isArray(d.TAG) ? d.TAG : d.TAG.split(",")) : []
                }
            }));
            setTotalPages(response.data.total_pages); // 전체 페이지 수는 기본 1로 설정 (백엔드에서 제공되지 않음)
        } catch (error) {
            console.error('API 호출 오류:', error);
        }
    };

    useEffect(() => {
        getBackpackList();
    }, [currentPage]); // currentPage 또는 title가 변경된 때만 게시글 리스트을 가져오기

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    };

    useEffect(() => {
        // 요소의 [data-scrollax] 옵션을 분석 적용
        handleScroll()
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        // js-fullheight 클래스를 가진 요소의 높이를 화면의 크기로 갱신
        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => {
            window.removeEventListener("resize", updateHeight);
        };
    }, []);

    useEffect(() => {
        // ftco-animate 클래스를 가진 요소에 등장 효과 적용
        appear_animate()
    }, []);

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
            <div className="hero-wrap js-fullheight" style={{ backgroundImage: "url('./images/bg_1.jpg')" }}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="row no-gutters slider-text js-fullheight align-items-center justify-content-start" data-scrollax-parent="true">
                        <div className="col-md-9 ftco-animate" data-scrollax={"{\"properties\": {\"translateY\": \"70%\"}}"}>
                            <h1 className="mb-4" data-scrollax={"{\"properties\": {\"translateY\": \"30%\", \"opacity\": 1.6}}"}><strong>여행,<br /></strong> 떠나는 순간 시작된다!</h1>
                            <p data-scrollax={"{\"properties\": {\"translateY\": \"30%\", \"opacity\": 1.6}}"}><strong>새로운 여행! 여행해 듀오와 함께합시다!</strong></p>
                            {/* <SearchBar />
                            <p><strong>🔍 또는 주요 추천 정보를 둘러보세요</strong></p> */}
                            <p className="browse d-md-flex">
                                {/* <span className="d-flex justify-content-md-center align-items-md-center"><Link to="#"><i className="flaticon-fork"></i>식당</Link></span> */}
                                <span className="d-flex justify-content-md-center align-items-md-center">  <Link to="http://localhost:3001/traveler/hotels" className="d-flex align-items-center gap-2" style={{ fontSize: "15px" }}>
                                <i className="flaticon-hotel"></i>숙박</Link></span>
                                <span className="d-flex justify-content-md-center align-items-md-center"><Link to="http://localhost:3001/traveler/tour"  className="d-flex align-items-center gap-2" style={{ fontSize: "15px" }}><i className="flaticon-meeting-point"></i>지역</Link></span>
                                {/* <span className="d-flex justify-content-md-center align-items-md-center"><Link to="#"><i className="flaticon-shopping-bag"></i>쇼핑</Link></span> */}
                                <span className="d-flex justify-content-md-center align-items-md-center"><Link to="/traveler/Weather/weather"  className="d-flex align-items-center gap-2" style={{ fontSize: "15px" }}><i className="icon-wb_sunny"></i>날씨</Link></span>
                                <span className="d-flex justify-content-md-center align-items-md-center">
                                    <button
                                        onClick={() => setIsMusicModalOpen(true)}
                                        style={{
                                            backgroundColor: "#ff6b6b",
                                            color: "white",
                                            padding: "10px 16px",
                                            border: "none",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            fontSize: "16px",
                                            fontWeight: "bold",
                                            transition: "all 0.3s ease-in-out",
                                            boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.2)"
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e85050"}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#ff6b6b"}
                                    >
                                        🎵 노래 추천받기
                                    </button>
                                </span>
                                <span className="d-flex justify-content-md-center align-items-md-center">
                                    <Link
                                        to="/traveler/tour/recommended"
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "#ff6b6b",
                                            color: "white",
                                            padding: "10px 16px",
                                            borderRadius: "8px",
                                            fontSize: "16px",
                                            fontWeight: "bold",
                                            textDecoration: "none",
                                            transition: "all 0.3s ease-in-out",
                                            boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.2)"
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e85050"}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#ff6b6b"}
                                    >
                                        🧳 여행지 추천받기
                                    </Link>

                                </span>
                                <span className="d-flex justify-content-md-center align-items-md-center">
                                    <Link
                                        to="/traveler/rate"
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "#ff6b6b",
                                            color: "white",
                                            padding: "10px 16px",
                                            borderRadius: "8px",
                                            fontSize: "16px",
                                            fontWeight: "bold",
                                            textDecoration: "none",
                                            transition: "all 0.3s ease-in-out",
                                            boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.2)"
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e85050"}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#ff6b6b"}
                                    >
                                        💵 실시간 환율
                                    </Link>
                                    <Link
                                        to="/traveler/mypay"
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "#ff6b6b",
                                            color: "black",
                                            margin:"10px",
                                            padding: "10px 16px",
                                            borderRadius: "8px",
                                            fontSize: "16px",
                                            fontWeight: "bold",
                                            textDecoration: "none",
                                            transition: "all 0.3s ease-in-out",
                                            boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.2)"
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e85050"}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#ff6b6b"}
                                    >
                                        🚌 버스 예매 내역
                                    </Link>
                                </span>
                                {/* 모달이 열릴 때만 TourMusicRecommended 표시 */}
                                {isMusicModalOpen && <MusicRecommendation onClose={() => setIsMusicModalOpen(false)} />}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <section className="ftco-section services-section bg-light">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-md-3 d-flex align-self-stretch ftco-animate">
                            <div className="media block-6 services d-block text-center">
                                <div className="d-flex justify-content-center"><div className="icon"><span className="flaticon-guarantee"></span></div></div>
                                <div className="media-body p-2 mt-2">
                                    <h3 className="heading mb-3">💰 최저가 보장</h3>
                                    <p>믿을 수 있는 가격과 서비스로 최고의 여행을 만들어 드립니다.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 d-flex align-self-stretch ftco-animate">
                            <div className="media block-6 services d-block text-center">
                                <div className="d-flex justify-content-center"><div className="icon"><span className="flaticon-like"></span></div></div>
                                <div className="media-body p-2 mt-2">
                                    <h3 className="heading mb-3">💑 여행해 듀오</h3>
                                    <p>당신의 성향과 맞는 새로운인연과 함께 여행해봐요!</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 d-flex align-self-stretch ftco-animate">
                            <div className="media block-6 services d-block text-center">
                                <div className="d-flex justify-content-center"><div className="icon"><span className="flaticon-detective"></span></div></div>
                                <div className="media-body p-2 mt-2">
                                    <h3 className="heading mb-3">🧳 최고의 여행 전문가</h3>
                                    <p>전문가들이 엄선한 여행지를 추천해 드립니다.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 d-flex align-self-stretch ftco-animate">
                            <div className="media block-6 services d-block text-center">
                                <div className="d-flex justify-content-center"><div className="icon"><span className="flaticon-support"></span></div></div>
                                <div className="media-body p-2 mt-2">
                                    <h3 className="heading mb-3">🤝 고객 지원팀 운영</h3>
                                    <p>24시간 챗봇 기능 지원으로 언제든지 도움을 받을 수 있습니다.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="ftco-section ftco-destination">
                <div className="container">
                    <div className="row justify-content-start mb-5 pb-3">
                        <div className="col-md-7 heading-section ftco-animate fadeInUp ftco-animated">
                            <span className="subheading">주목할만한</span>
                            <h2 className="mb-4"><strong>추천하는</strong> 지역</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <GalleryCarouselTour data={[1, 2, 3, 4, 5, 6]} />
                        </div>
                    </div>
                </div>
            </section>
           
          
            {/* <!-- loader --> */}
            <div id="ftco-loader" className="show fullscreen"><svg className="circular" width="48px" height="48px"><circle className="path-bg" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke="#eeeeee" /><circle className="path" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke-miterlimit="10" stroke="#F96D00" /></svg></div>
        </div >
    )
}

export default Home