import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Member: React.FC = () => {
    //useState, formData 전송
    //email을 체크해서 서버에서 이메일 중복검사, sendMail
    //서버측 요청 처리 메서드
    //@PostMapping("/emailCheck")

    const [userId, setUserId] = useState("");
    const [pwd, setPwd] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [formData] =useState(new FormData()); //전송할 FormData객체
    const navigate = useNavigate();

    const emailCheck = async () => {
        try {
            const res = await axios.post(`http://192.168.0.90/myictstudy/api/auth/emailCheck`, {email});
            if (res.data === 0) {
                alert("인증번호가 발송되었습니다.");
                document.getElementById('emailCheck-msg')!.style.display = "none";
            } else {
                alert("이미 사용중!");
                const msgElement = document.getElementById('emailCheck-msg');
                if (msgElement) {
                    msgElement.innerHTML = "이미 사용중인 이메일입니다.";
                    msgElement.innerHTML = "block";
                }
            }
        } catch (error) {
            alert("인증번호 오류발생");
            console.log("오류발생 : "+error);
        }
    };

    const idCheck = async () => {
        try {
            const res = await axios.get(`http://192.168.0.90/myictstudy/member/idCheck`,{params:{
                id:userId
            }});
            console.log(`res => ${res.data}`);
            if (res.data) {
                const idElement = document.getElementById('idCheck-msg');
                if (idElement) {
                    idElement.innerText = "사용가능한 아이디입니다.";
                    idElement.style.display = "block";
                }
            } else {
                const idElement = document.getElementById('idCheck-msg');
                if (idElement) {
                    idElement.innerText = "이미 사용하는 아이디입니다.";
                    idElement.style.display = "block";
                }
            }
        } catch (error) {
            console.log("중복체크 전송에러 : "+error);
        }
    }

    //submit전송할때 이메일과 코드를 보내서 redis에 저장한 이메일과 코드가 일치하다면 데이터 입력처리 전송
    const submit = async () => {
        try {
            const res = await axios.post(`http://192.168.0.90/myictstudy/api/auth/emailCheck/certification`, {email, code});
            console.log(`res => ${res.data}`);
            if (res.data) {
                const codeMsg = document.getElementById("Code-msg");
                if (codeMsg) {
                    codeMsg.innerText = "인증번호가 일치합니다.";
                    codeMsg.style.color = "green";
                    codeMsg.style.display = "block";
                }
           

                //서버로 보낼 파라미터
                formData.append("user_id",userId);
                formData.append("pwd",pwd);
                formData.append("name",name);
                formData.append("email",email);

                const signRes = await axios.post(`http://192.168.0.90/myictstudy/member/signup`, formData,
                    {headers : {
                        "Content-Type":"x-www-form-urlencoded"
                    }});
                    if (signRes.status === 200) {
                        alert("회원가입 완료");
                        navigate("/");
                    }
                    } else {
                        const codeMsg = document.getElementById("Code-msg");
                        if (codeMsg) {
                        codeMsg.innerText = "인증번호가 일치하지 않습니다.";
                        codeMsg.style.display = "block";
                }
            }  
        } catch (error) {
            console.log("전송에러 : "+error);
        }
    }

  return (
    <div>
      <div className="container mt-5">
      <form
        method="POST"
        className="p-4 bg-light border rounded"
        onSubmit={(e) => {e.preventDefault(); submit();}}
      >
        <h2 className="text-center mb-4">회원가입</h2>

        {/* 아이디 입력 */}
        <div className="mb-3 row">
          <label htmlFor="userId" className="col-sm-3 col-form-label fw-bold">
            아이디
          </label>
          <div className="col-sm-7">
            <input
              type="text"
              className="form-control"
              id="userId"
              placeholder="아이디 입력"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <div className="col-sm-2">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={idCheck}
            >
              중복확인
            </button>
          </div>
          <div className="col-12 text-danger small" id="idCheck-msg" style={{ display: "none" }}>
            {/* ID 확인 메세지 */}
          </div>
        </div>

        {/* 비밀번호 입력 */}
        <div className="mb-3 row">
          <label htmlFor="pwd" className="col-sm-3 col-form-label fw-bold">
            비밀번호
          </label>
          <div className="col-sm-9">
            <input
              type="password"
              className="form-control"
              id="pwd"
              placeholder="영문 대문자와 숫자, 특수문자를 포함한 8자리 이상"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
          </div>
          <div className="col-12 text-danger small" id="pwd-msg" style={{ display: "none" }}>
            {/* 비밀번호 확인 메세지 */}
          </div>
        </div>

        {/* 이름 입력 */}
        <div className="mb-3 row">
          <label htmlFor="name" className="col-sm-3 col-form-label fw-bold">
            이름
          </label>
          <div className="col-sm-9">
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="이름 입력"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-12 text-danger small" id="nameCheck-msg" style={{ display: "none" }}>
            {/* 이름 확인 메세지 */}
          </div>
        </div>

        {/* 이메일 입력 */}
        <div className="mb-3 row">
          <label htmlFor="email" className="col-sm-3 col-form-label fw-bold">
            이메일
          </label>
          <div className="col-sm-7">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => {setEmail(e.target.value)}}
            />
          </div>
          <div className="col-sm-2">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={emailCheck}
            >
              인증
            </button>
          </div>
          <div className="col-12 text-danger small" id="emailCheck-msg" style={{ display: "none" }}>
            {/* 이메일 확인 메세지 */}
          </div>
        </div>

        {/* 인증번호 입력 */}
        <div className="mb-3 row">
          <label htmlFor="code" className="col-sm-3 col-form-label fw-bold">
            인증번호
          </label>
          <div className="col-sm-9">
            <input
              type="text"
              className="form-control"
              id="code"
              placeholder="인증번호 입력"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className="col-12 small" id="Code-msg" style={{ display: "none" }}>
            {/* 인증번호 확인 메세지 */}
          </div>
        </div>

        {/* 버튼 */}
        <div className="d-flex justify-content-between mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            // onClick={() => navigate(-1)}
          >
            뒤로가기
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            가입하기
          </button>
        </div>
      </form>
    </div>
    </div>
  )
}

export default Member