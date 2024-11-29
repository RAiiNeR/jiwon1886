import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from './store';
import { login } from './action/authActions';
import './LoginForm.css';

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();



    //-------------------------------------------------------
    //login 후 이동할 경로 설정을 위해서 useLocation훅을 사용한다.
    const location = useLocation();
    console.log("location.search : " + location.search);
    // ||은 or이라는 뜻
    const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

    //리듀스 추가
    const dispatch = useAppDispatch();
    //-------------------------------------------------------



    const submitLogin = async (e:React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(''); //에러 메세지를 초기화 해놓고
        //1. FakeJWT를 사용해서 더미 데이터로 localStrage의 개념을 실습 해본다.
        try {
            // if(username === 'test' && password === '11') {
            //     const token = 'fake-jwt-token';
            //     //로컬스토리지에 저장
            //     localStorage.setItem('username', username);
            //     localStorage.setItem('token', token);
            //     //로그인 폼 전에 얻었던 파라미터(redirect)를 다시 렌더링한다.
            //     navigate(redirectPath); 
            // } else {
            //     setErrorMessage("정확한 아이디와 비번이 아닙니다.");
            // }
            await dispatch(login(username, password));
            navigate(redirectPath);
        } catch (error) {
            setErrorMessage('!!!인증실패!!!');
        }
    }
    

  return (
    <div>
      <div className="login-container">
      <h1>로그인</h1>
      <form onSubmit={submitLogin}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="아이디를 입력하세요"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
          />
        </div>
        <div className="form-group">
          <button type="submit" className="login-button">Login</button>
        </div>
              </form>
    </div>
    </div>
  )
}

export default LoginForm