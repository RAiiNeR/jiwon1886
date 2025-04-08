// 2025.01.22. 11:00 생성자: 이학수, 풋터 분리 
import React, { useEffect } from 'react'
import { appear_animate } from './CommomFunc'

const Footer: React.FC = () => {
    useEffect(() => {
        // 등장 효과 적용 함수 호출
        appear_animate()
    }, [])

    return (
        <div>
            <footer className="ftco-footer ftco-bg-dark ftco-section">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-md">
                            <div className="ftco-footer-widget mb-4">
                                <h2 className="ftco-heading-2">여행해 듀오</h2>
                                <p>국내 구석구석 숨은 명소부터 인기 여행지까지,  
       당신만의 특별한 여행을 떠나보세요.</p>
                                <ul className="ftco-footer-social list-unstyled float-md-left float-lft mt-5">
                                    <li className="ftco-animate"><a href="#"><span className="icon-twitter"></span></a></li>
                                    <li className="ftco-animate"><a href="#"><span className="icon-facebook"></span></a></li>
                                    <li className="ftco-animate"><a href="#"><span className="icon-instagram"></span></a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="ftco-footer-widget mb-4 ml-md-5">
                                <h2 className="ftco-heading-2">정보</h2>
                                <ul className="list-unstyled">
                                    <li><a href="#" className="py-2 d-block">회사소개</a></li>
                                    <li><a href="#" className="py-2 d-block">서비스</a></li>
                                    <li><a href="#" className="py-2 d-block">이용약관</a></li>
                                    <li><a href="#" className="py-2 d-block">파트너쉽</a></li>
                                    <li><a href="#" className="py-2 d-block">개인정보 보호 정책</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="ftco-footer-widget mb-4">
                                <h2 className="ftco-heading-2">고객 지원</h2>
                                <ul className="list-unstyled">
                                    <li><a href="#" className="py-2 d-block">자주 하는 질문</a></li>
                                    <li><a href="#" className="py-2 d-block">결제 방법</a></li>
                                    <li><a href="#" className="py-2 d-block">예약 팁</a></li>
                                    <li><a href="#" className="py-2 d-block">이용 방법</a></li>
                                    <li><a href="#" className="py-2 d-block">문의하기</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="ftco-footer-widget mb-4">
                                <h2 className="ftco-heading-2">고객 센터</h2>
                                <div className="block-23 mb-3">
                                    <ul>
                                        <li><span className="icon icon-map-marker"></span><span className="text">서울 서초구 서초대로77길 41 4층</span></li>
                                        <li><a href="#"><span className="icon icon-phone"></span><span className="text">0507-1395-6865</span></a></li>
                                        <li><a href="#"><span className="icon icon-envelope"></span><span className="text">tess@naver.com</span></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 text-center">

                            <p>
                                {/* <!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. --> */}
                                Copyright &copy;<script>document.write(new Date().getFullYear());</script> All rights reserved | This template is made with <i className="icon-heart" aria-hidden="true"></i> by <a href="https://colorlib.com" target="_blank">Colorlib</a>
                                {/* <!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. --> */}
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer