import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/sign_up.css';


const SignUp: React.FC = () => {
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [idChecker, setIdChecker] = useState(false);
    const [pwd, setPwd] = useState('');
    const [frontssn, setFrontSsn] = useState(''); // 주민등록번호 앞자리
    const [backssn, setBackSsn] = useState(''); // 주민등록번호 뒷자리
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [addr, setAddr] = useState('대한민국'); // 기본주소
    const [postcode, setPostcode] = useState(''); // 우편번호
    const [detailAddress, setDetailAddress] = useState(''); // 상세 주소
    const [extraAddress, setExtraAddress] = useState(''); // 참고 항목
    const [code, setCode] = useState(''); // 이메일 인증 코드
    const navigate = useNavigate();


    /**
  * 다음 우편번호 API 호출
  * 이 함수는 주소를 검색하고 상태를 업데이트합니다.
  */
    const handlePostcodeSearch = () => {
        if (!window.daum || !window.daum.Postcode) {
            alert('우편번호 API 로드에 실패했습니다. 페이지를 새로고침해주세요.');
            return;
        }

        new window.daum.Postcode({
            oncomplete: function (data: any) {
                let addr = ''; // 기본 주소 변수
                let extraAddr = ''; // 참고 항목 변수

                // 도로명 주소와 지번 주소 처리
                if (data.userSelectedType === 'R') {
                    addr = data.roadAddress; // 도로명 주소
                } else {
                    addr = data.jibunAddress; // 지번 주소
                }

                // 도로명 주소일 때 참고 항목 추가
                if (data.userSelectedType === 'R') {
                    if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                        extraAddr += data.bname; // 법정동 추가
                    }
                    if (data.buildingName !== '' && data.apartment === 'Y') {
                        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName); // 건물명 추가
                    }
                    if (extraAddr !== '') {
                        extraAddr = ` (${extraAddr})`; // 형식 조합
                    }
                }

                console.log(data);
                // 상태 업데이트
                setPostcode(data.zonecode); // 우편번호
                setAddr(addr); // 기본 주소
                setExtraAddress(extraAddr); // 참고 항목
                setDetailAddress(''); // 상세 주소 초기화
            },
        }).open();
    };
    // 아이디 중복확인
    const idCheck = async () => {
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_BACK_END_URL}/api/member/idCheck`, { id }); // 사용자 ID 전송
            console.log("IDCheck :" + res);
            if (res.data === 0) {
                alert("사용가능한 아이디 입니다.");
                document.getElementById("idCheck-msg")!.style.display = "none";
                setIdChecker(true);
            } else {
                alert("이미 사용중");
                const msgElement = document.getElementById("nameCheck-msg");
                if (msgElement) {
                    msgElement.innerHTML = "이미 사용중인 아이디입니다";
                    msgElement.style.display = "block";
                }
                setIdChecker(false);
            }
        } catch (error) {
            alert("인증번호 오류발생");
            console.log("Error", error);
        }
    };
    // 이메일 인증요청
    const emailCheck = async () => {
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_BACK_END_URL}/api/auth/emailCheck`, { email }); // 이메일 전송
            if (res.data === 0) {
                alert("인증 번호가 발송되었습니다.");
                document.getElementById("emailCheck-msg")!.style.display = "none";
            } else {
                alert("이미 사용중");
                const msgElement = document.getElementById("emailCheck-msg");
                if (msgElement) {
                    msgElement.innerHTML = "이미 사용중인 이메일입니다";
                    msgElement.style.display = "block";
                }
            }
        } catch (error) {
            alert("인증번호 오류발생");
            console.log("Error", error);
        }
    };
    // 회원가입
    const handleSubmit = async () => {
        if (!idChecker) {
            alert("아이디 중복을 확인해 주세요.");
            return;
        }
        const pattern = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,}$/;
        const pwdCheck = pattern.test(pwd);
        if (!pwdCheck) {
            alert("비밀번호가 규칙에 어긋납니다.");
            return;
        }
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_BACK_END_URL}/api/auth/emailCheck/certification`, { email, code } // 이메일, 인증코드 전송
            );
            console.log(`res => ${res.data}`);
            if (res.data) {
                const codeMsg = document.getElementById("Code-msg");
                if (codeMsg) {
                    codeMsg.innerText = "인증번호가 일치합니다.";
                    codeMsg.style.color = "green";
                    codeMsg.style.display = "block";
                }
                //모든 데이터 JSON형식으로 전송
                const memberData = {
                    name: name,
                    id: id,
                    pwd: pwd,
                    ssn: frontssn + '-' + backssn,
                    phone: phone,
                    email: email,
                    addr: addr,
                };
                const signRes = await axios.post(
                    `${process.env.REACT_APP_BACK_END_URL}/api/member/signup`, memberData,
                    {
                        headers: { "Content-Type": "application/json" }, //JSON헤더 추가
                    }
                );

                if (signRes.status === 200) {
                    alert("회원가입 완료");
                    navigate("/noorigun/login");//회원가입 후 로그인페이지로 이동
                }
            } else {
                const codeMsg = document.getElementById("Code-msg");
                if (codeMsg) {
                    codeMsg.innerText = "인증번호가 일치하지 않습니다.";
                    codeMsg.style.display = "block";
                }
            }
        } catch (error) {
            console.log(`Error => ${error}`);
        }
    };

    return (
        <div className="sign_up">
            <form method='POST' className='p-4 bg-light border rounded'
                onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <h2 className="sign-up__title">회원가입 페이지</h2>

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

                </div>

                {/* 아이디 입력 */}
                <div className="mb-3 row">
                    <label htmlFor="userId" className="col-sm-3 col-form-label fw-bold">
                        아이디
                    </label>
                    <div className="col-sm-9 button-container">
                        <input
                            type="text"
                            className="form-control input-container"
                            id="username"
                            placeholder="아이디 입력"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                        />
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={idCheck}
                        >
                            중복 확인
                        </button>
                    </div>
                    <div
                        className="col-12 text-danger small"
                        id="idCheck-msg"
                        style={{ display: "none" }}
                    ></div>
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
                    <div
                        className="col-12 text-danger small"
                        id="pwd-msg"
                        style={{ display: "none" }}
                    ></div>
                </div>
                {/* 주민등록번호 입력 */}
                <div className="mb-3 row">
                    <label htmlFor="ssn" className="col-form-label fw-bold">주민등록번호</label>
                    <div className="col-sm-5">
                        <input
                            type="text"
                            className="form-control me-2"
                            id="ssnFront"
                            value={frontssn}
                            onChange={e => setFrontSsn(e.target.value)}
                            placeholder="6자리 입력"
                            maxLength={6}
                            required
                        />
                    </div>
                    <div className="col-sm-1"> - </div>
                    <div className="col-sm-5 d-flex">
                        <input
                            type="text"
                            className="form-control"
                            id="ssnBack"
                            value={backssn}
                            onChange={e => setBackSsn(e.target.value)}
                            placeholder="●"
                            maxLength={1}
                            style={{ width: '50px' }}
                            required
                        />******
                    </div>
                </div>



                {/* 전화번호 입력 */}
                <div className="mb-3 row">
                    <label htmlFor="phone" className="col-sm-3 col-form-label fw-bold">전화번호</label>
                    <div className="col-sm-9">
                        <input
                            type="text"
                            className="form-control"
                            id="phone"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="예: 010-1234-5678"
                        />
                    </div>
                </div>

                {/* 이메일 입력 */}
                <div className="mb-3 row">
                    <label htmlFor="email" className="col-sm-3 col-form-label fw-bold">
                        이메일
                    </label>
                    <div className="col-sm-9 button-container">
                        <input
                            type="email"
                            className="form-control input-container"
                            id="email"
                            placeholder="이메일 입력"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={emailCheck}
                        >
                            인증
                        </button>
                    </div>
                    <div
                        className="col-12 text-danger small"
                        id="emailCheck-msg"
                        style={{ display: "none" }}
                    ></div>
                </div>

                {/* 인증번호 입력 */}
                <div className="mb-3 row">
                    <label htmlFor="code" className="col-sm-3 col-form-label fw-bold">인증번호</label>
                    <div className="col-sm-9">
                        <input
                            type="text"
                            className="form-control"
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="인증번호 입력"
                        />
                    </div>
                    <div
                        className="col-12 small"
                        id="Code-msg"
                        style={{ display: "none" }}
                    ></div>
                </div>

                {/* 우편번호 입력 */}
                <div className="mb-3 row">
                    <label htmlFor="postcode" className="col-sm-3 col-form-label fw-bold">
                        우편번호
                    </label>
                    <div className="col-sm-9 button-container" id="postcode-container">
                        <input
                            type="text"
                            className="form-control input-container"
                            id="postcode"
                            placeholder="우편번호"
                            value={postcode}
                            readOnly
                        />
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={handlePostcodeSearch}
                        >
                            우편번호 찾기
                        </button>
                    </div>
                </div>

                <div className="mb-3 row">
                    <label htmlFor="addr" className="col-sm-3 col-form-label fw-bold">주소</label>
                    <div className="col-sm-9">
                        <input
                            type="text"
                            className="form-control"
                            id="addr"
                            placeholder="주소"
                            value={addr}
                            readOnly
                        />
                    </div>
                </div>

                <div className="mb-3 row">
                    <label htmlFor="detailAddress" className="col-sm-3 col-form-label fw-bold">상세주소</label>
                    <div className="col-sm-9">
                        <input
                            type="text"
                            className="form-control"
                            id="detailAddress"
                            placeholder="상세주소 입력"
                            value={detailAddress}
                            onChange={(e) => setDetailAddress(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mb-3 row">
                    <label htmlFor="extraAddress" className="col-sm-3 col-form-label fw-bold">참고항목</label>
                    <div className="col-sm-9">
                        <input
                            type="text"
                            className="form-control"
                            id="extraAddress"
                            placeholder="참고항목"
                            value={extraAddress}
                            readOnly
                        />
                    </div>
                </div>
                {/* 선택 버튼 */}
                <div className="d-flex justify-content-between mt-4">
                    <Link to="/noorigun/login" className="btn btn-secondary">뒤로가기</Link>
                    <button type="submit" className="btn btn-primary">
                        가입하기
                    </button>
                </div>
            </form>
        </div>
    );
};
export default SignUp;
