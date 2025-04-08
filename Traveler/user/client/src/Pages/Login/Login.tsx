import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Link 추가
import "../../css/login_main.css";
import "../../css/login_util.css";
import axios from "axios";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [socialLoginEnd, setSocialLoginEnd] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/member/login`, {
        username,
        password,
      });

      console.log("로그인 응답:", response.data);

      if (response.status === 200) {
        // 토큰 저장
        localStorage.setItem("token", response.data.access_token);
        alert("로그인 성공!");
        navigate("/traveler/home"); // 로그인 성공 후 홈으로 이동
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인 실패! 아이디 또는 비밀번호를 확인하세요.");
    }
  };

  const socialLoginEnded = async (e: any) => {
    setSocialLoginEnd('end')
  }

  const handelKakaoLogin = () => {
    window.open(`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_KAKAO_API_KEY}&redirect_uri=${process.env.REACT_APP_KAKAO_REDIRECT_URI}&response_type=code&scope=account_email,name,birthyear,birthday,phone_number,gender&prompt=login`,
      'newWindow', "width=500,height=600");

    window.addEventListener('message', socialLoginEnded, false)
  }

  const handelNaverLogin = () => {
    window.open(`https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.REACT_APP_NAVER_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_NAVER_REDIRECT_URI}&state=naverLogin`,
      'newWindow', "width=500,height=600");

    window.addEventListener('message', socialLoginEnded, false)
  }

  useEffect(() => {
    if (socialLoginEnd) {
      navigate('/traveler/home')
    }
  }, [socialLoginEnd])

  return (
    <div className="limiter">
      <div className="container-login100" style={{ backgroundImage: "url('./images/bg-01.jpg')" }}>
        <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54 login-box">
          <form className="login100-form validate-form" onSubmit={handleSubmit}>
            <span className="login100-form-title p-b-49">로그인</span>

            <div className="wrap-input100 validate-input m-b-23">
              <span className="label-input100">아이디</span>
              <input
                className="input100"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="아이디를 입력하세요"
                required
              />
              <span className="focus-input100" data-symbol="&#xf206;"></span>
            </div>

            <div className="wrap-input100 validate-input">
              <span className="label-input100">비밀번호</span>
              <input
                className="input100"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
              />
              <span className="focus-input100" data-symbol="&#xf190;"></span>
            </div>

            <div className="text-right p-t-8 p-b-31">
              <a href="#">비밀번호를 잊어버리셨나요?</a>
            </div>

            <div className="container-login100-form-btn">
              <div className="wrap-login100-form-btn">
                <div className="login100-form-bgbtn"></div>
                <button type="submit" className="login100-form-btn">로그인</button>
              </div>

              <div className="wrap-login100-form-btn passwordless">
                <div className="login100-form-bgbtn"></div>
                {/* Link로 패스워드리스 페이지로 이동 */}
                <Link to="/traveler/passwordless" className="login100-form-btn">
                  패스워드리스 로그인
                </Link>
              </div>
            </div>

            <div className="txt1 text-center p-t-30 p-b-15">
              <span>연동 로그인</span>
            </div>

            <div className="flex-c-m">
              <button className="login100-social-item bg1" onClick={handelKakaoLogin}>
                <img src="./images/kakao-talk.png" alt="Kakao Login" style={{ width: "40px", height: "40px" }} />
              </button>
              <button className="login100-social-item bg2" onClick={handelNaverLogin}>
                <img src="./images/naver.png" alt="Naver Login" style={{ width: "40px", height: "40px" }} />
              </button>
              {/* <a href="#" className="login100-social-item bg3"><i className="fa4 fa-google"></i></a> */}
            </div>

            <div className="flex-col-c p-t-25">
              {/* Sign Up을 Link로 변경 */}
              <Link to="/traveler/signselect" className="txt2">아직 회원이 아니신가요? 회원가입</Link>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
