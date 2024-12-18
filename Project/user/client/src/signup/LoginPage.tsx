import React, { useState } from 'react';
import './css/loginpage.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store';
import { login } from './action/authAction';

interface LoginForm {
  username: string; // 아이디
  password: string; // 비밀번호
  keepLoggedIn: boolean; // 로그인 상태 유지
}

const LoginPage: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({ // 빈 문자열과 false로 초기화된 LoginForm 객체
    username: '',
    password: '',
    keepLoggedIn: false,
  });
  const navigate = useNavigate();

  // 입력 필드가 변경될 때 호출되는 함수
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;  // 이벤트 대상의 속성을 가져옴
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value, // 체크박스면 checked 값, 아니면 입력값(value)으로 업데이트
    }));
  };


  const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/auth/login`, form);
    // console.log(response.data);
    // if (form.keepLoggedIn) { // 사용자가 "로그인 상태 유지"를 선택했다면 로컬 스토리지에 아이디를 저장
    //   localStorage.setItem('username', form.username); // 로컬 스토리지에 username 저장
    // }
    try {
      await dispatch(login(form.username, form.password));
      if(localStorage.getItem('token')) navigate(redirectPath);
      else alert("아이디나 비밀번호가 잘못되었습니다.")
    } catch (error) {

    }
  }

  //   // 로그인 인증 로직
  //   if (form.username === 'nooridawon' && form.password === 'nooridawon') {
  //     if (form.keepLoggedIn) { // 사용자가 "로그인 상태 유지"를 선택했다면 로컬 스토리지에 아이디를 저장
  //       localStorage.setItem('username', form.username); // 로컬 스토리지에 username 저장
  //     }
  //     navigate('/'); // 홈 페이지로 이동
  //   } else {
  //     alert('아이디 또는 비밀번호가 잘못되었습니다.');
  //   }
  // };

  return (
    <div className="loginpage">
      <h1 className="header">로그인</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="아이디를 입력해 주세요."
          value={form.username}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호를 입력해 주세요."
          value={form.password}
          onChange={handleChange}
          required
          className="input"
        />
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
        <button type="button" className="login-button"><Link to='/signup' className='gal'>회원가입</Link></button>
        <hr/>
        <div>
        <h6>소셜 로그인</h6>  
        <Link to="/kakaologin"><img src="../images/button_img/kakao_login.png" alt="" /></Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;