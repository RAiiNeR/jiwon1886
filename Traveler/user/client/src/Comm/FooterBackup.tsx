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
                                <h2 className="ftco-heading-2">dirEngine</h2>
                                <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
                                <ul className="ftco-footer-social list-unstyled float-md-left float-lft mt-5">
                                    <li className="ftco-animate"><a href="#"><span className="icon-twitter"></span></a></li>
                                    <li className="ftco-animate"><a href="#"><span className="icon-facebook"></span></a></li>
                                    <li className="ftco-animate"><a href="#"><span className="icon-instagram"></span></a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="ftco-footer-widget mb-4 ml-md-5">
                                <h2 className="ftco-heading-2">Information</h2>
                                <ul className="list-unstyled">
                                    <li><a href="#" className="py-2 d-block">About</a></li>
                                    <li><a href="#" className="py-2 d-block">Service</a></li>
                                    <li><a href="#" className="py-2 d-block">Terms and Conditions</a></li>
                                    <li><a href="#" className="py-2 d-block">Become a partner</a></li>
                                    <li><a href="#" className="py-2 d-block">Best Price Guarantee</a></li>
                                    <li><a href="#" className="py-2 d-block">Privacy and Policy</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="ftco-footer-widget mb-4">
                                <h2 className="ftco-heading-2">Customer Support</h2>
                                <ul className="list-unstyled">
                                    <li><a href="#" className="py-2 d-block">FAQ</a></li>
                                    <li><a href="#" className="py-2 d-block">Payment Option</a></li>
                                    <li><a href="#" className="py-2 d-block">Booking Tips</a></li>
                                    <li><a href="#" className="py-2 d-block">How it works</a></li>
                                    <li><a href="#" className="py-2 d-block">Contact Us</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="ftco-footer-widget mb-4">
                                <h2 className="ftco-heading-2">Have a Questions?</h2>
                                <div className="block-23 mb-3">
                                    <ul>
                                        <li><span className="icon icon-map-marker"></span><span className="text">203 Fake St. Mountain View, San Francisco, California, USA</span></li>
                                        <li><a href="#"><span className="icon icon-phone"></span><span className="text">+2 392 3929 210</span></a></li>
                                        <li><a href="#"><span className="icon icon-envelope"></span><span className="text">info@yourdomain.com</span></a></li>
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