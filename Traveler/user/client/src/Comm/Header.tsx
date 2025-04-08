// 2025.01.22. 11:00 생성자: 이학수, 헤더 분리 
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../Pages/Login/store';
import { logoutAction } from '../Pages/Login/action/authAction';
import { parseJwt } from './jwtUtils';

const Header: React.FC = () => {
    const { pathname } = useLocation();

    //2025-03-04 전준영추가 
    const navigate = useNavigate();
    const dispatch = useAppDispatch(); // Redux 디스패치

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [role, setRole] = useState("")



    // 로그인 여부 확인 
    const isLogin = () => {
        const token = localStorage.getItem("token"); // 로컬스토리지에서 토큰 가져오기
        if (token) {
            // 권한 받아오는 부분
            const decode = parseJwt(token);
            setRole(decode.role);
        }
        return !!token; // 토큰이 존재하면 true, 없으면 false 반환
    };

    // 로그인 상태 (컴포넌트 마운트 시 확인)
    useEffect(() => {
        setIsLoggedIn(isLogin());
    }, [pathname]); // 경로 변경될 때마다 로그인 상태 확인

    // 로그아웃 처리
    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("이미 로그아웃된 상태입니다.");
            return;
        }

        try {

            localStorage.removeItem("token");
            localStorage.removeItem("username");
            setIsLoggedIn(false);  // 로그인 상태 업데이트
            // console.log(setIsLoggedIn);
            alert("로그아웃 되었습니다.");
            navigate("/traveler/home"); // 로그아웃 후 홈으로 리디렉션

        } catch (error) {
            console.error("로그아웃 오류:", error);
            alert("서버 오류로 인해 로그아웃할 수 없습니다.");
        }
    };

    // 2025.01.24. 19:50 추가: 이학수, 현재 경로에 따라 네이게이션 버튼의 색깔이 동적이 되도록 추가
    useEffect(() => {
        const entity = document.querySelectorAll<HTMLLinkElement>('div#header nav ul li a');
        entity.forEach((e, i) => {
            // console.log(e.innerHTML)
            if (pathname.includes((e.getAttribute('href') as string))) {
                e.parentElement?.classList.add('active')
                // console.log(pathname)
            } else {
                e.parentElement?.classList.remove('active')
            }
        })
    }, [pathname])

    // 스크롤에 따라 헤더 상단 고정 및 스타일 변경을 위한 함수
    const navPosition = () => {
        const naviBar = document.getElementById('ftco-navbar')
        const scrollPosition = window.scrollY;
        if (!naviBar) return;

        if (scrollPosition > 150) {
            if (!naviBar.className.includes('scrolled')) {
                naviBar.className += ' scrolled';
            }
        }
        if (scrollPosition < 150) {
            if (naviBar.className.includes('scrolled')) {
                naviBar.className = naviBar.className.replace(' scrolled', '').replace(' sleep', '');
            }
        }
        if (scrollPosition > 350) {
            if (!naviBar.className.includes('awake')) {
                naviBar.className += ' awake';
            }
        }
        if (scrollPosition < 350) {
            if (naviBar.className.includes('awake')) {
                naviBar.className = naviBar.className.replace(' awake', '');
                if (!naviBar.className.includes('sleep')) {
                    naviBar.className += ' sleep';
                }
            }
        }
    }

    useEffect(() => {
        navPosition();
        window.addEventListener("scroll", navPosition);
        return () => {
            window.removeEventListener("scroll", navPosition);
        };
    }, [])

    return (
        <div id='header'>
            <nav className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
                <div className="container">
                    <Link to="/traveler/home" className="navbar-brand">✈️ 여행해듀오</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="oi oi-menu"></span> Menu
                    </button>
                    <div className="collapse navbar-collapse" id="ftco-nav">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item"><Link to="/traveler/tour" className="nav-link">여행</Link></li>
                            <li className="nav-item"><Link to="/traveler/diary" className="nav-link">여행다이어리</Link></li>
                            <li className="nav-item"><Link to="/traveler/hotels" className="nav-link">숙박</Link></li>
                            <li className="nav-item"><Link to="/traveler/Transport" className="nav-link">대중교통</Link></li>
                            <li className="nav-item"><Link to="/traveler/community" className="nav-link">나의 배낭</Link></li>
                            {/* 2025-02-19 장지원 친구여행 메뉴 추가 */}
                            <li className="nav-item"><Link to="/traveler/travelTogether" className="nav-link">함께 떠나요</Link></li>
                            {
                                role.includes("COALITION") && <li className="nav-item"><Link to="/traveler/coalition" className="nav-link">제휴</Link></li>
                            }
                            {/* 2025-03-06 장지원 마이페이지 헤더 수정:로그인한 경우에만 마이페이지 보이기 */}
                            {/* 문의하기 추가가 */}
                            {isLoggedIn && (
                                <>
                                    <li className="nav-item"><Link to="/traveler/contact" className="nav-link">문의하기</Link></li>
                                    <li className="nav-item">
                                        <Link to="/traveler/mypage" className="nav-link">마이페이지</Link>
                                    </li>
                                </>
                            )}
                            {/* 로그인 상태에 따라 버튼 변경 */}
                            {isLoggedIn ? (
                                <li className="nav-item cta">
                                    <button onClick={handleLogout} className="nav-link btn btn-link" style={{ color: 'white', textDecoration: 'none' }}>
                                        <span>로그아웃</span>
                                    </button>
                                </li>
                            ) : (
                                <li className="nav-item cta">
                                    <Link to="/traveler/login" className="nav-link">
                                        <span>로그인</span>
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Header