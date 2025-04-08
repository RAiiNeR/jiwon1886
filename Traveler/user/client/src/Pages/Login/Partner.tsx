import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Partner: React.FC = () => {
    const [companyName, setCompanyName] = useState("");
    const [companyType, setCompanyType] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [code, setCode] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [emailCode, setEmailCode] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();



    // 아이디 중복 확인
    const handleCheckDuplicateId = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/member/idCheck`, { username });
            console.log("ID Check Response:", response.data);
            alert(response.data.exists ? "이미 사용 중인 아이디입니다." : "사용 가능한 아이디입니다.");
        } catch (error) {
            console.error("아이디 중복 확인 오류:", error);
            alert("아이디 중복 확인 중 오류가 발생했습니다.");
        }
    };
    // 이메일 인증 요청
    const handleVerifyEmail = async () => {
        if (!email) {
            alert("이메일을 입력해주세요!");
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/member/emailCheck`, { email });

            console.log("Email Check Response:", response.data);
            alert(response.data === 0 ? `인증 코드가 ${email}로 전송되었습니다.` : "이미 사용 중인 이메일입니다.");
        } catch (error) {
            console.error("이메일 인증 요청 오류:", error);
            alert("이메일 인증 요청 중 오류가 발생했습니다.");
        }
    };

    // 이메일 인증 코드 확인
    const handleVerifyEmailCode = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/member/emailCheck/certification`, {
                email,
                code: emailCode
            });

            console.log("Email Verification Response:", response.data);

            if (response.data) {
                setIsVerified(true);
                alert("이메일 인증이 완료되었습니다!");
            } else {
                alert("인증 코드가 올바르지 않습니다.");
            }
        } catch (error) {
            console.error("이메일 인증 코드 확인 오류:", error);
            alert("이메일 인증 코드 확인 중 오류가 발생했습니다.");
        }
    };

        // 비밀번호 유효성 검사
        const isValidPassword = (password: string) => {
            const pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*+=-]).{8,}$/;
            return pattern.test(password);
        };
  
    // 회원가입 요청 (FormData 사용)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidPassword(password)) {
            alert("비밀번호는 영문 대문자, 숫자, 특수문자를 포함한 8자리 이상이어야 합니다.");
            return;
        }

        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        if (code.length !== 7 && code.length !== 10) {
            alert("주민등록번호는 7자리, 사업자등록번호는 10자리여야 합니다.");
            return;
        }

        if (phone.length !== 11) {
            alert("전화번호는 11자리여야 합니다.");
            return;
        }

        if (!isVerified) {
            alert("이메일 인증을 완료해주세요!");
            return;
        }

        const formData = new FormData();
        formData.append("username", username);
        formData.append("pwd", password);
        formData.append("name", name);
        formData.append("companyName", companyName);
        formData.append("companyType", companyType);
        formData.append("code", code);
        formData.append("phone", phone);
        formData.append("email", email);
        formData.append("role", "COMPANY");

        console.log("회원가입 요청 데이터:", formData);

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/member/register`, formData);
            console.log("회원가입 응답:", response.data);
            if (response.status === 200) {
                alert("회원가입이 완료되었습니다!");
                navigate("/travler/home");
            }
        } catch (error) {
            console.error("회원가입 오류:", error);
            alert("회원가입 중 오류가 발생했습니다.");
        }
    };

    

    // 스타일 객체 정의 -React에서 style은 객체 
    const inputGroupStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
    };

    const inputContainerStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    };

    const checkBtnStyle: React.CSSProperties = {
        background: "linear-gradient(90deg, #a100ff, #7a00e6)",
        color: "white",
        border: "none",
        padding: "8px 12px",
        fontSize: "14px",
        borderRadius: "5px",
        cursor: "pointer",
        marginLeft: "10px",
        whiteSpace: "nowrap",
    };

    return (
        <div className="limiter">
            <div className="container-login100" style={{ backgroundImage: "url('./images/bg-01.jpg')" }}>
                <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54 login-box">
                    <form className="login100-form validate-form" onSubmit={handleSubmit}>
                        <span className="login100-form-title p-b-49">제휴회사</span>

                        <div className="wrap-input100 validate-input m-b-15">
                            <span className="label-input100">회사</span>
                            <input
                                className="input100"
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="기업명"
                                required
                            />
                            <span className="focus-input100" data-symbol="&#xf206;"></span>
                        </div>

                        <div className="wrap-input100 validate-input m-b-15">
                            <span className="label-input100">기업군 선택</span>
                            <select
                                className="input100"
                                value={companyType}
                                onChange={(e) => setCompanyType(e.target.value)}
                                required
                            >
                                <option value="">어떠한 서비스를 제공하시나요?</option>
                                <option value="숙소">숙박</option>
                                <option value="교통">교통</option>
                                <option value="기타">기타</option>
                            </select>
                        </div>

                        {/* Name 입력 */}
                        <div className="wrap-input100 validate-input m-b-15">
                            <span className="label-input100">담당자 이름(실명)</span>
                            <input
                                className="input100"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="이름 입력"
                                required
                            />
                            <span className="focus-input100" data-symbol="&#xf206;"></span>
                        </div>

                        {/* ID 입력 + 중복 확인 버튼 */}
                        <div className="wrap-input100 validate-input m-b-15" style={inputGroupStyle}>
                            <span className="label-input100">아이디</span>
                            <div style={inputContainerStyle}>
                                <input
                                    className="input100"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="아이디 입력"
                                    required
                                />
                                <span className="focus-input100" data-symbol="&#xf201;"></span>
                                <button
                                    type="button"
                                    style={checkBtnStyle}
                                    onClick={handleCheckDuplicateId}
                                >
                                    중복 확인
                                </button>
                            </div>
                        </div>

                        {/* Password 입력 */}
                        <div className="wrap-input100 validate-input m-b-15">
                            <span className="label-input100">비밀번호</span>
                            <input
                                className="input100"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="영문, 대문자와 숫자, 특수문자를 포함한 8자리"
                                required
                            />
                            <span className="focus-input100" data-symbol="&#xf190;"></span>
                        </div>

                        {/* Password 확인 입력 */}
                        <div className="wrap-input100 validate-input m-b-15">
                            <span className="label-input100">비밀번호 확인</span>
                            <input
                                className="input100"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="비밀번호 일치 확인"
                                required
                            />
                            <span className="focus-input100" data-symbol="&#xf190;"></span>
                        </div>

                        {/* SSN 입력 (7자리) */}
                        <div className="wrap-input100 validate-input m-b-15">
                            <span className="label-input100">사업자 등록번호</span>
                            <input
                                className="input100"
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="사업자 등록번호 입력(- 제외)"
                                required
                                maxLength={10}
                            />
                            <span className="focus-input100" data-symbol="&#xf1c7;"></span>
                        </div>

                        {/* Phone 입력 */}
                        <div className="wrap-input100 validate-input m-b-15">
                            <span className="label-input100">대표 번호</span>
                            <input
                                className="input100"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="전화번호 11자리 입력(- 제외)"
                                required
                                maxLength={11}
                            />
                            <span className="focus-input100" data-symbol="&#xf2c8;"></span>
                        </div>

                        {/* Email 입력 + 인증 버튼 */}
                        <div className="wrap-input100 validate-input m-b-23" style={inputGroupStyle}>
                            <span className="label-input100">회사 이메일</span>
                            <div style={inputContainerStyle}>
                                <input
                                    className="input100"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="이메일 입력"
                                    required
                                />
                                <span className="focus-input100" data-symbol="&#xf15a;"></span>
                                <button
                                    type="button"
                                    style={checkBtnStyle}
                                    onClick={handleVerifyEmail}
                                >
                                    인증
                                </button>
                            </div>
                        </div>
                        {/* 이메일 인증 코드 입력 + 확인 버튼 */}
                        <div className="wrap-input100 validate-input m-b-23" style={inputGroupStyle}>
                            <span className="label-input100">인증 코드</span>
                            <div style={inputContainerStyle}>
                                <input
                                    className="input100"
                                    type="text" // 타입을 "text"로 변경
                                    value={emailCode}
                                    onChange={(e) => setEmailCode(e.target.value)}
                                    placeholder="인증 코드 입력"
                                    required
                                    maxLength={6}
                                />
                                <span className="focus-input100" data-symbol="&#xf15a;"></span>

                                <button type="button" style={checkBtnStyle} onClick={handleVerifyEmailCode}>
                                    확인
                                </button>
                            </div>
                        </div>

                        {/* 회원가입 버튼 */}
                        <div className="container-login100-form-btn">
                            <div className="wrap-login100-form-btn">
                                <div className="login100-form-bgbtn"></div>
                                <button type="submit" className="login100-form-btn">회원가입</button>
                            </div>


                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Partner;