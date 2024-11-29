import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from './login/store';
import { parseJwt } from './comp/jwtUtils';
import { logoutAction } from './login/action/authActions';

const Header: React.FC = () => {
    // 1. Fake 작업
    const navigate = useNavigate();
    // const username = localStorage.getItem('username');
    // const isLoginIn =!! username;

    //로그아웃 처리
    // const logout = () => {
    //     localStorage.removeItem('username');
    //     localStorage.removeItem('token');
    //     navigate("/");
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

  const isLoginIn = !!token;

  const hdlogout = async  () => {
    // Redux 상태 초기화
    try {
      await dispatch(logoutAction());
      // localStorage.removeItem('username');
      // localStorage.removeItem('token');
      navigate('/');
    }catch(error){
      console.error('Logout failed:', error);
    }

  };
  return (
<header>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">ICT STUDY</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/back/memoForm">메모장</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/back/gallery">Gallery</Link>
            </li>

            <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    실습데모
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {
                    isLoginIn && username && role === "TEACHER" || role === "ADMIN" ? (
                      <li className="nav-item">
                        <Link className="nav-link" to="/back/reduxdemo">Redux</Link>
                      </li>
                    ) : (
                      <>접근불가능</>
                    )
                  }
                <li className="nav-item">
                  <Link className="nav-link" to="/back/reduxdemo2">Redux2</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/back/jwtDemo">jwtDemo</Link>
                </li>
                </ul>
            </li>
            {/* isLoginIn이 true이면 로그아웃, 아니면 스토리지에 값이 없는 상태이기 때문에 바로 로그인 버튼 */}
            {/* 때문에 삼항연산자를 써서 나타내면 된다. */}
            {isLoginIn?(
                <>
                    <li className="nav-item">
                        <Link className="nav-link" to="/myapp1112/signup">마이페이지</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/myapp1112/signup">{username}님 {role}권한이네요. 반갑습니다!</Link>
                    </li>
                    <li className="nav-item">
                        <button className='nav-item' onClick={hdlogout}>로그아웃</button>
                    </li>
                </>
            ) : (
                <>
                    <li className="nav-item">
                        <Link className="nav-link" to="/myapp1112/signup">회원가입</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/back/login">로그인</Link>
                    </li>
                </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  </header>
  )
}

export default Header