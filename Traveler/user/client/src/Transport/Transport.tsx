// 2025.02.05. 19:00 생성자:최의진, HTML템플릿을 리엑트로 조정
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { appear_animate, handleScroll, updateHalfHeight } from '../Comm/CommomFunc';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ko } from "date-fns/locale/ko"; // 한국어 로케일 가져오기
import '../css/transport.css'
registerLocale("ko", ko);


const Transport: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    useEffect(() => {
        // 요소의 [data-scrollax] 옵션을 분석 적용
        handleScroll()
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        // js-halfheight 클래스를 가진 요소의 높이를 화면의 크기로 갱신
        updateHalfHeight();
        window.addEventListener("resize", updateHalfHeight);
        return () => {
            window.removeEventListener("resize", updateHalfHeight);
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

    // const handleCategorySelect =(category:string) => {
    //     setSelectedCategory(category);
    // }
    return (
        <div>
            <div className="hero-wrap js-halfheight transport-Titleimg"
                style={{
                    backgroundImage: "url('./images/transport/trans1.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center', // 이미지 위치를 중앙에 맞추기
                    backgroundRepeat: 'no-repeat',
                    position: 'relative', // 요소의 위치를 상대적으로 설정
                    zIndex: -2,
                    backgroundColor: "rgba(0, 0, 0, 0.5)"
                }}
            >

                <div className="overlay" style={{ pointerEvents: 'none' }}></div>
                <div className="container">
                    <div className="row no-gutters slider-text js-halfheight align-items-center justify-content-center" data-scrollax-parent="true">
                        <div className="col-md-9 ftco-animate text-center" data-scrollax={"{\"properties\": {\"translateY\": \"70%\"}}"}>
                            {/* <p className="breadcrumbs" data-scrollax={"{\"properties\": {\"translateY\": \"30%\", \"opacity\": 1.6}}"}><span className="mr-2"><Link to="/traveler/home">Home</Link></span> <span>Tour</span></p> */}
                            <h1 className="mb-3 bread" data-scrollax={"{\"properties\": {\"translateY\": \"30%\", \"opacity\": 1.6}}"}>실시간 교통</h1>
                        </div>
                    </div>
                </div>
            </div>
            <section className="ftco-section ftco-degree-bg">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-9">
                            <div className="row">
                                {/* 카테고리 선택 버튼들 */}
                                <div className="col-12 text-center mb-4">
                                    {/* <button onClick={() => handleCategorySelect('bus')} className={`category-btn ${selectedCategory === 'bus' ? 'active' : ''}`}>고속버스</button>
                                <button onClick={() => handleCategorySelect('subway')} className={`category-btn ${selectedCategory === 'subway' ? 'active' : ''}`}>지하철</button>
                                <button onClick={() => handleCategorySelect('map')} className={`category-btn ${selectedCategory === 'map' ? 'active' : ''}`}>길찾기</button> */}
                                </div>
                                {/*고속버스 카테코리 */}
                                <div className="col-md-4 ftco-animate">
                                    <div className="destination">                                                       {/*images\transport\Busreservation.jpg */}
                                        <Link to="#" className="img img-2 d-flex justify-content-center align-items-center" style={{ backgroundImage: "url(./images/transport/Busreservation.jpg)" }}>
                                            <div className="icon d-flex justify-content-center align-items-center">
                                                <span className="icon-search2"></span>
                                            </div>
                                        </Link>
                                        <div className="text p-3">
                                            <div className="d-flex">
                                                <div className="one">
                                                    <h3><Link to="/traveler/Transport/busForm">고속버스 현황</Link></h3>
                                                </div>
                                            </div>
                                            <p className="bottom-area d-flex">
                                                <span className="ml-auto"><Link to="/traveler/Transport/busForm">조회하기</Link></span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {/*지하철 카테코리 */}
                                <div className="col-md-4 ftco-animate">
                                    <div className="destination">                                                                                                {/*images\transport\seoulsubway.jpg */}
                                        <Link to="#" className="img img-2 d-flex justify-content-center align-items-center" style={{ backgroundImage: "url(./images/transport/seoulsubway.jpg)" }}>
                                            <div className="icon d-flex justify-content-center align-items-center">
                                                <span className="icon-search2"></span>
                                            </div>
                                        </Link>
                                        <div className="text p-3">
                                            <div className="d-flex">
                                                <div className="one">
                                                    <h3><Link to="/traveler/Transport/Train">수도권 지하철</Link></h3>
                                                </div>
                                            </div>
                                            <p className="bottom-area d-flex">
                                                <span className="ml-auto"><Link to="/traveler/Transport/Train">확인하기</Link></span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </section >
        </div >
    )
}

export default Transport