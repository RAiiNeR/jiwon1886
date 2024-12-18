import React, { useEffect, useState } from 'react'
import { parseKakaoToken } from '../comp/jwtUtils';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../signup/store';
import { socaillogin } from '../signup/action/authAction';

interface SocialUser {
    birth: string
    email: string
    name: string;
    phone: string;
    gender: string;
}


const SocialSignup: React.FC = () => {
    const [socialUser, setSocialUser] = useState<SocialUser>();
    const [id, setId] = useState('');
    const [idChecker, setIdChecker] = useState(false)
    const [pwd, setPwd] = useState('');
    const [addr, setAddr] = useState('대한민국'); // 기본주소
    const [postcode, setPostcode] = useState(''); // 우편번호
    const [detailAddress, setDetailAddress] = useState(''); // 상세 주소
    const [extraAddress, setExtraAddress] = useState(''); // 참고 항목

    const navigate = useNavigate();

    const genderNum = (gender: string, year: string) => {
        const genNum = gender === 'm' ? (year === '20' ? '3' : '1') : (year === '20' ? '4' : '2');
        return genNum;
    }

    useEffect(() => {
        const token = localStorage.getItem('kakaoToken');
        if (token) {
            const decodeToken = parseKakaoToken(token);
            decodeToken.then(e => {
                setSocialUser({
                    birth: e.birthyear.substring(2) + e.birthday,
                    gender: genderNum(e.gender.substring(0, 1), e.birthyear.substring(0, 2)),
                    email: e.email,
                    name: e.name,
                    phone: '0' + e.phone_number.substring(4).replaceAll('-', '')
                });
            })
        }
    }, []);

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
        if (id) {
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
                    setIdChecker(false)
                }
            } catch (error) {
                alert("인증번호 오류발생");
                console.log("Error", error);
            }
        }
    };

    const dispatch = useDispatch<AppDispatch>();

    // 회원가입
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (idChecker) {
                //모든 데이터 JSON형식으로 전송
                const memberData = {
                    name: socialUser?.name,
                    id: id,
                    pwd: pwd,
                    ssn: socialUser?.birth + '-' + socialUser?.gender,
                    phone: socialUser?.phone,
                    email: socialUser?.email,
                    addr: addr,
                    socialuser: 'true'
                };
                const signRes = await axios.post(
                    `${process.env.REACT_APP_BACK_END_URL}/api/member/signup`, memberData,
                    {
                        headers: { "Content-Type": "application/json" }, //JSON헤더 추가
                    }
                );

                if (signRes.status === 200) {
                    alert("회원가입 완료");
                    await dispatch(socaillogin(memberData.id, memberData.email as string));
                    navigate('/');//회원가입 후 메인 페이지로 이동
                }
            }else{
                alert("아이디 중복체크를 진행하여 주세요.");
            }
        } catch (error) {
            console.log(`Error => ${error}`);
        }
    };

    if (!socialUser) {
        return <div>페이지 로딩 중 ~</div>
    }

    return (
        <div className="sign_up">
            <form onSubmit={handleSubmit}>
                <h2 className="sign-up__title">소셜회원 가입 페이지</h2>

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
                            value={socialUser.name}
                            readOnly
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
                            required
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
                            required
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
                    <div className="d-flex">
                        <input
                            type="text"
                            className="form-control me-2"
                            id="ssnFront"
                            value={socialUser.birth}
                            placeholder="6자리 입력"
                            maxLength={6}
                            required
                            readOnly
                        />
                        <input
                            type="text"
                            className="form-control"
                            id="ssnBack"
                            value={socialUser.gender + '******'}
                            placeholder="●"
                            maxLength={1}
                            required
                            readOnly
                        />
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
                            value={socialUser.phone}
                            readOnly
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
                            value={socialUser.email}
                            readOnly
                        />
                    </div>
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
                            required
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
                            required
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
                            required
                            readOnly
                        />
                    </div>
                </div>
                {/* 선택 버튼 */}
                <div className="d-flex justify-content-between mt-4">
                    <Link to="/login" className="btn btn-secondary">뒤로가기</Link>
                    <button type="submit" className="btn btn-primary">
                        가입하기
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SocialSignup