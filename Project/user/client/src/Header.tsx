import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAppDispatch } from './signup/store'
import { parseJwt, parseKakaoToken } from './comp/jwtUtils'
import { logoutAction } from './signup/action/authAction'
import Weather from './comp/Weather'

const LoginBtn = styled.li`
    display:none;

    @media screen and (max-width: 767px){
        display:block;
    }
`

const Header: React.FC = () => {
    const navigate = useNavigate();
    // const username = localStorage.getItem('username');
    // const isLogin = !!username;

    // const logout = () => {
    //     localStorage.removeItem('username');
    //     localStorage.removeItem('token');
    //     navigate('/');
    // }

    // 2. 기존의 코드 즉 스토리지를 바로 지우는 것에서 
    // 액션 디스패치를 사용해서 서버의 토큰도 삭제하고
    // 여기 스토리지도 지우도록 수정한다.
    //- Redux의 logout 액션 디스패치.
    //- 로컬 스토리지 초기화.
    const dispatch = useAppDispatch();

    const token = localStorage.getItem('token');
    let username = null;
    let role = null;

    if (token) {
        const decodedToken = parseJwt(token);
        username = decodedToken?.sub || null;
        role = decodedToken?.role || null;
    }

    const isLoggedIn = !!token;
    // console.log("로그인 여부 " + isLoggedIn);

    const hdlogout = async () => {
        // Redux 상태 초기화
        try {
            await dispatch(logoutAction());
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }

    };

    return (
        <div className="header-div">
            <div className='header-top'>
                {
                    isLoggedIn ? (
                        <div className='login'>
                            <Link to='' onClick={hdlogout}>로그아웃</Link>
                        </div>
                    ) : (
                        <div className='login'>
                            <Link to='/login'>로그인</Link>
                        </div>
                    )
                }
            </div >
            <header>
                <nav className='navbar navbar-expand-md navbar-light p-0 d-flex flex-wrap align-items-center justify-content-between'>
                    <Link to="/" className="d-flex align-items-center my-2 me-3">
                        <i className="fa-solid fa-otter"></i>
                        &nbsp;&nbsp;누리군
                    </Link>
                    <Weather />
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <div>
                            <ul className='navbar-nav my-0 mx-auto p-0 list-unstyled fs-4 d-flex justify-content-evenly align-items-center'>
                                <li className='mx-1 text-center nav-item nav-hover'>
                                    <Link to='#'>누리소개</Link>
                                    <ul className='nav-hover-menu'>
                                        <li><Link to='/nooriGunEmployee'>조직도</Link></li>
                                        <li><hr /></li>
                                        <li><Link to='/complaintProcese'>신청 절차</Link></li>
                                    </ul>
                                </li>
                                <li className='mx-1 text-center nav-item nav-hover'>
                                    <Link to='#'>소통⦁참여</Link>
                                    <ul className='nav-hover-menu'>
                                        <li><Link to='/suggestion'>제안목록</Link></li>
                                        <li><hr /></li>
                                        <li><Link to='/qna'>질문/답변</Link></li>
                                        <li><hr /></li>
                                        <li><Link to='/survey'>설문조사</Link></li>
                                    </ul>
                                </li>
                                <li className='mx-1 text-center nav-item nav-hover'>
                                    <Link to='#'>민원현황</Link>
                                    <ul className='nav-hover-menu'>
                                        <li><Link to='/comple'>민원현황</Link></li>
                                        <li><hr /></li>
                                        <li><Link to='/comple/chart'>부서별 민원통계</Link></li>
                                    </ul>
                                </li>
                                <li className='mx-1 text-center nav-item nav-hover'>
                                    <Link to='#'>누리소식</Link>
                                    <ul className='nav-hover-menu'>
                                        <li><Link to='/promote'>누리행사</Link></li>
                                        <li><hr /></li>
                                        <li><Link to='/faq'>자주하는 질문</Link></li>
                                    </ul>
                                </li>
                                <li className='mx-1 text-center nav-item nav-hover'>
                                    <Link to="#">시민 공간</Link>
                                    <ul className='nav-hover-menu'>
                                        <Link to='/freeboard'>자유게시판</Link>
                                        <li><hr /></li>
                                        <li><Link to='/program'>강좌 신청</Link></li>
                                        <li><hr /></li>
                                        <li><Link to='/rent'>비품 대여</Link></li>
                                    </ul>
                                </li>

                                {
                                    isLoggedIn ? (
                                        <>
                                            <li className='mx-1 text-center nav-item nav-hover'>
                                                <Link to={`/mypage/${username}`}>나의 누리</Link>
                                            </li>

                                            <LoginBtn className='mx-1 text-center nav-item nav-hover'>
                                                <Link to='' onClick={hdlogout}>로그아웃</Link>
                                            </LoginBtn>
                                        </>
                                    ) : (
                                        <LoginBtn className='mx-1 text-center nav-item nav-hover'>
                                            <Link to='/login'>로그인</Link>
                                        </LoginBtn>
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        </div >
    )
}

export default Header