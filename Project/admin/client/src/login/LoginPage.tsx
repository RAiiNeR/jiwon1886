import React, { useState } from 'react';
import './css/loginpage.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store';
import { login } from './action/authAction';
//로그인 폼 데이터
interface LoginForm {
  username: string;
  password: string;
  keepLoggedIn: boolean;
}

const LoginPage: React.FC = () => {
  //로그인 폼 상태관리
  const [form, setForm] = useState<LoginForm>({
    username: '',
    password: '',
    keepLoggedIn: false,
  });

  const navigate = useNavigate();//페이지 이동 기능
  // 폼 입력 값 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value, // 체크박스 상태 또는 입력 값 업데이트
    }));
  };

  const location = useLocation();// 현재 URL 정보 가져오기
  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/'; // 리다이렉트 경로 설정
  const dispatch = useDispatch<AppDispatch>();// Redux 디스패치 함수
  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log('Form submitted:', form);
    // if (form.keepLoggedIn) {
    //   localStorage.setItem('username', form.username);
    // }
    try {
      // Redux 디스패치를 통해 로그인 요청 실행
      await dispatch(login(form.username, form.password));
      // 로그인 성공 후 리다이렉트
      if (localStorage.getItem('managerToken')) navigate(redirectPath);
      else alert("아이디나 비밀번호가 잘못되었습니다.")
    } catch (error) {

    }
  };

  return (
    <div className='loginPageBack'>
      <div className="loginPage">
        <h1 className="header">로그인</h1>
        <form className="form" onSubmit={handleSubmit}>
          {/* 아이디 입력 필드 */}
          <input
            type="text"
            name="username"
            placeholder="아이디를 입력해 주세요."
            value={form.username}
            onChange={handleChange}
            required
            className="input"
          />
          {/* 비밀번호 입력 필드 */}
          <input
            type="password"
            name="password"
            placeholder="비밀번호를 입력해 주세요."
            value={form.password}
            onChange={handleChange}
            required
            className="input"
          />
          {/* 로그인 상태 유지 체크박스 */}
          <label className="checkbox-container">
            <input
              type="checkbox"
              name="keepLoggedIn"
              checked={form.keepLoggedIn}
              onChange={handleChange}
              className="checkbox"
            />
            <span>로그인 상태 유지</span>
          </label>
          <button type="submit" className="login-button">로그인</button>
        </form>
        <div className='login-footer'>
          <Link to='/'>아이디 찾기</Link>/<Link to='/'>비밀번호 찾기</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
