import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

const MyPageUpdate: React.FC = () => {
    const { id } = useParams();
    const [phone, setPhone] = useState('');
    const [phone2, setPhone2] = useState('');
    const [phone3, setPhone3] = useState('');
    const [email, setEmail] = useState('');
    const [addr, setAddr] = useState('');
    const [postcode, setPostcode] = useState(''); // 우편번호
    const [detailAddress, setDetailAddress] = useState(''); // 상세 주소
    const [extraAddress, setExtraAddress] = useState(''); // 참고 항목
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/mypage/detail?id=${id}`);
                const { phone, email, addr } = response.data.user;
                console.log(response.data.user)
                setPhone(phone.replaceAll("-","").substring(0,3));
                setPhone2(phone.replaceAll("-","").substring(3,7));
                setPhone3(phone.replaceAll("-","").substring(7,11));
                setEmail(email);
                setAddr(addr);
            } catch (error) {
                console.error('오류:', error);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fullPhone = `${phone}-${phone2}-${phone3}`; //setPhone, setPhone2, setPhone3에 적힌 전화번호를 한번에 결합
        const requestBody = { phone: fullPhone, email, addr }; // 요청한 데이터 생성

        try {
            // 수정 API 호출
            await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/mypage/update?id=${id}`, requestBody, {
                headers: { 'Content-Type': 'application/json' }, // JSON 헤더 설정
            });
            navigate(`/mypage/${id}`); // 수정 후 마이페이지로 이동
        } catch (error) {
            console.error('수정 오류:', error);
        }
    };

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

                // 상태 업데이트
                setPostcode(data.zonecode); // 우편번호
                setAddr(addr); // 기본 주소
                setExtraAddress(extraAddr); // 참고 항목
                setDetailAddress(''); // 상세 주소 초기화
            },
        }).open();
    };


    return (
        <div className='myPageUpdate'>
            <h2>수정할 정보를 입력해주세요</h2>
            <form onSubmit={handleSubmit}>
                {/* 전화번호 입력 */}
                <div className='mb-3 row'>
                    <label className='col-sm-3 col-form-label fw-bold label-font'>전화번호 : </label>
                    <div className='phone'>
                        <input type="number" name='phone' id='phone' value={phone}
                            className="form-control update-text phone-box" onChange={e => setPhone(e.target.value)} required
                            maxLength={3}
                        />
                        -
                        <input type="number" name='phone2' id='phone2' value={phone2}
                            className="form-control update-text phone-box" onChange={e => setPhone2(e.target.value)} required
                            maxLength={4}
                        />
                        -
                        <input type="number" name='phone3' id='phone3' value={phone3}
                            className="form-control update-text phone-box" onChange={e => setPhone3(e.target.value)} required
                            maxLength={4}
                        />
                    </div>
                </div>

                {/* 이메일 입력 */}
                <div className='mb-3 row'>
                    <label className='col-sm-3 col-form-label fw-bold label-font'>이메일 : </label>
                    <input type="text" name='email' id='email' value={email}
                        className="form-control update-text" onChange={e => setEmail(e.target.value)} required />
                </div>

                {/* <div className='mb-3 row'>
            <label className='col-sm-3 col-form-label fw-bold label-font'>주소 : </label>
            <input type="text" name='addr' id='addr' value={addr}
                className="form-control update-text" onChange={e => setAddr(e.target.value)} required/>
        </div> */}

                {/* 주소 및 상세 주소 */}
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

                <div className="d-flex justify-content-end mt-5 form-btnBox">
                    <Link to={`/mypage/${id}`} className='btn btn-secondary'>뒤로가기</Link>
                    <button type='submit' className='btn btn-primary'>수정하기</button>
                </div>
            </form>
        </div>
    )
}

export default MyPageUpdate