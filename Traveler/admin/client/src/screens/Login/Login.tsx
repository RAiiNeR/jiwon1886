import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Login.css"; // 스타일 적용
import { headers } from "next/headers";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [show, setShow] = useState(false);
  const [key, setKey] = useState('');

  const [score, setScore] = useState(0.0);

  const videoRef = useRef<any>(null); // video 태그 참조
  const canvasRef = useRef<any>(null); // canvas 태그 참조
  const [isCapturing, setIsCapturing] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('카메라 접근에 실패했습니다:', error);
    }
  };

  const restart = () => {
    startCamera()
    return <></>
  }

  // 카메라 스트림 시작
  useEffect(() => {
    startCamera();

    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        const tracks = stream?.getTracks();
        tracks?.forEach((track: any) => track.stop()); // 스트림 종료
      }
    };
  }, []);

  // 캡처 후 서버로 전송하는 함수
  const captureAndSend = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      // 캔버스에 비디오 프레임을 그립니다.
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 캔버스에서 이미지를 Blob으로 변환
      canvas.toBlob(async (blob: any) => {
        const manager = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/manager/${username}`)


        // FormData 객체 생성
        const formData = new FormData();
        formData.append('img', blob, 'snapshot.jpg');
        formData.append('imgname', manager.data.imgname);

        // 서버로 이미지 전송
        try {
          const response = await axios.post('http://localhost:9000/facecam/facecam', formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          setScore(response.data.score);
          if (response.status === 200) {
            // console.log('이미지 전송 성공');

          } else {
            console.error('이미지 전송 실패');
          }
        } catch (error) {
          console.error('서버 요청 중 오류 발생:', error);
        }
      });
    }
  };

  const handleClose = () => setShow(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); // 기본 제출 동작 방지

    if (!username || !password) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    try {
      // console.log("로그인 시작:");
      setIsSubmitted(true); // 로그인 시작작 시 화면 변경
      const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/auth/login`, {
        username,
        password,
      });

      // console.log("로그인 응답:", response.data);

      if (response.status === 200) {
        localStorage.setItem("adminToken", response.data.access_token); // JWT 토큰 저장
        setError("");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      setError("로그인 실패! 아이디 또는 비밀번호를 확인하세요.");
      setIsSubmitted(false); // 로그인 시작작 시 화면 변경
    }
  };

  const handleCheck = async () => {
    const formData = new FormData();
    formData.append('imgname', 'LEEHAKSOO.jpg');
    const response = await axios.post('http://localhost:9000/facecam/facecam', formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    setScore(response.data.score);
  }
  const navigate = useNavigate();

  const logging = async (abnormal: string, path = "") => {
    // console.log("로깅 시작")
    const formData = new FormData();
    formData.append("abnormal", abnormal);
    await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/manager/logging/${username}`, formData);
    // console.log("로깅 끝")
    navigate(`${process.env.REACT_APP_BASE_URL}/${path}`)
  }

  const getHotKey = async () => {
    const formData = new FormData();
    formData.append("sabun", username);
    await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/auth/sendKey`, formData);
    alert("이메일 전송")
    setShow(true)
  }

  useEffect(() => {
    if (score > 0) {
      console.log(score)
      if (score < 0.35) {
        logging("0");
      } else {
        getHotKey();
      }
    }
  }, [score])

  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append("key", key)
    formData.append("sabun", username)
    const result = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/auth/hotkey`, formData);
    if (result.data) {
      alert("인증 완료")
      logging("2");
    } else {
      alert("인증 실패")
      logging("1", "login/login");
      setIsSubmitted(false)
      setShow(false)
      setError("로그인 실패! 아이디 또는 비밀번호를 확인하세요.");
      localStorage.removeItem('adminToken')
    }
    setUsername("");
    setPassword("");
    setKey("");
  }

  return (
    <div className={`${isSubmitted ? "adminCheck" : "adminlogin"}`}>
      <div className="admin-container">
        <h1>관리자님 환영합니다</h1>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {!isSubmitted ? (
          <form className="admin-form" onSubmit={handleLogin}>
            <div className="admin-input-container">
              <input
                type="text"
                placeholder="아이디"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="admin-input"
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
              />
            </div>
            <button type="submit" id="admin-login-button" className="admin-button">
              로그인
            </button>
          </form>
        ) : <div className="w-100 h-100">
          {
            restart()
          }
          {/* <div className="cameraBox"
            style={{
              textAlign: "center",
              overflow: "hidden"
            }}
          >

            <img src="http://localhost:9000/facecam/video_feed" width="640" height="480" />
          </div> */}
          <video ref={videoRef} autoPlay width="640" height="480" />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <button className="btn btn-primary p-3" onClick={captureAndSend}>2차 인증 시작</button>
        </div>}
      </div>
      <ul className="admin-bg-bubbles">
        {[...Array(10)].map((_, i) => (
          <li key={i}></li>
        ))}
      </ul>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>인증번호 입력</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>등록된 이메일로 인증코드가 전송되었습니다.</h4>
          <label htmlFor="key">인증코드 입력 : </label>
          <input type="text" id="key" name="key" value={key} onChange={e => setKey(e.target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmit}>
            전송
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            취소
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Login;
