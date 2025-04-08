import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from './login/store';
import { parseJwt } from './comp/jwtUtils';
import { logoutAction } from './login/action/authAction';

const SideBar: React.FC = () => {
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

    const token = localStorage.getItem('managerToken');
    let username = null;
    let role = null;

    if (token) {
        const decodedToken = parseJwt(token);
        username = decodedToken?.name || null;
        role = decodedToken?.role || null;
        // console.log(username, ",", role)
    }

    const isLoggedIn = !!token;
    // console.log("로그인 여부 " + isLoggedIn);

    const hdlogout = async () => {
        // Redux 상태 초기화
        try {
            await dispatch(logoutAction());
            localStorage.removeItem('username');
            localStorage.removeItem('token');
            navigate('/noorigun/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }

    };

    return (
        <>
            {
                isLoggedIn && (
                    <div className="flex-shrink-0 p-3 side-bar">
                        <a href="/noorigun" className="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom main-icon">
                            <i className="fa-solid fa-otter fs-2"></i>
                            <span className="fs-5 fw-semibold">누리군 관리자</span>
                        </a>
                        <ul className="list-unstyled ps-0">
                            {
                                (role === 'ADMIN' || role === 'SUPERVISOR') && (
                                    <li className="mb-1">
                                        <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#userchart-collapse" aria-expanded="false">
                                            통계
                                        </button>
                                        <div className="collapse" id="userchart-collapse">
                                            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                                <li><a href="/noorigun/chart/member" className="link-dark rounded">이용자 통계</a></li>
                                                <li><a href="/noorigun/chart/comple" className="link-dark rounded">민원 통계</a></li>
                                                <li><a href="/noorigun/chart/vote" className="link-dark rounded">투표 통계</a></li>
                                            </ul>
                                        </div>
                                    </li>
                                )
                            }
                            {
                                (role === 'ADMIN' || role === 'SUPERVISOR' || role === 'MANAGER') && (
                                    <li className="mb-1">
                                        <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#user-collapse" aria-expanded="false">
                                            사용자 관리
                                        </button>
                                        <div className="collapse" id="user-collapse">
                                            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                                <li><a href="/noorigun/member" className="link-dark rounded">사용자 목록</a></li>
                                            </ul>
                                        </div>
                                    </li>
                                )
                            }
                            {
                                (role === 'ADMIN' || role === 'SUPERVISOR') && (
                                    <li className="mb-1">
                                        <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#admin-collapse" aria-expanded="false">
                                            관리자 관리
                                        </button>
                                        <div className="collapse" id="admin-collapse">
                                            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                                <li><a href="/noorigun/manager" className="link-dark rounded">관리자 목록</a></li>
                                                <li><a href="/noorigun/manager/new" className="link-dark rounded">관리자 추가</a></li>
                                            </ul>
                                        </div>
                                    </li>
                                )
                            }
                            <li className="mb-1">
                                <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#board-collapse" aria-expanded="false">
                                    게시판 관리
                                </button>
                                <div className="collapse" id="board-collapse">
                                    <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                        <li><a href="/noorigun/comple" className="link-dark rounded">민원게시판</a></li>
                                        <li><a href="/noorigun/suggest" className="link-dark rounded">제안게시판</a></li>
                                        <li><a href="/noorigun/promote" className="link-dark rounded">행사게시판</a></li>
                                        <li><a href="/noorigun/faq" className="link-dark rounded">자주하는 질문</a></li>
                                        <li><a href="/noorigun/qna" className="link-dark rounded">QnA게시판</a></li>
                                        <li><a href="/noorigun/freeboard" className="link-dark rounded">자유게시판</a></li>
                                    </ul>
                                </div>
                            </li>
                            <li className="mb-1">
                                <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#other-collapse" aria-expanded="false">
                                    기타 업무
                                </button>
                                <div className="collapse" id="other-collapse">
                                    <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                        <li><a href="/noorigun/banner" className="link-dark rounded">배너 목록</a></li>
                                        <li><a href="/noorigun/survey" className="link-dark rounded">설문 목록</a></li>
                                        <li><a href="/noorigun/program" className="link-dark rounded">강좌 관리</a></li>
                                        <li><a href="/noorigun/equipment" className="link-dark rounded">비품 관리</a></li>
                                    </ul>
                                </div>
                            </li>
                            <li className="border-top my-3"></li>
                            <li className="mb-1">
                                <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#account-collapse" aria-expanded="false">
                                    Account
                                </button>
                                <div className="collapse" id="account-collapse">
                                    <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                        {/* <li><a href="/" className="link-dark rounded">{username}님의 정보</a></li> */}
                                        <li><Link to="" onClick={hdlogout}>로그아웃</Link></li>
                                        {
                                            (role === 'ADMIN' || role === 'SUPERVISOR' || role === 'MANAGER') && (
                                                <li><Link to="/noorigun/noti/new" className="link-dark rounded">공지등록</Link></li>
                                            )
                                        }
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                )
            }
        </>
    )
}

export default SideBar