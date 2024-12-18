import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/CompleBoard.css';
import { parseJwt } from '../comp/jwtUtils';

const CompleBoardForm: React.FC = () => {
    const [mNum, setMNum] = useState('');
    const [title, setTitle] = useState('');
    const [writer, setWriter] = useState('');
    const [content, setContent] = useState('');
    const [pri, setPri] = useState('1'); // 기본값 공개 (1) 비공개(2)
    const [pwd, setPwd] = useState(''); // 비밀번호
    const [charCount, setCharCount] = useState(0); // 글자 수
    const maxLength = 2000;  // 최대 글자 수 제한
    const [images, setImages] = useState<File[]>([]);
    // 미리보기 데이터를 담을 previews 추가(이미지 미리보기)
    const [previews, setPreviews] = useState<string[]>([]);

    const navigate = useNavigate();

    // JWT 토큰에서 작성자 정보 가져오기
    useEffect(() => {
        const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 가져오기
        if (token) {
            const decodedToken = parseJwt(token);
            setWriter(decodedToken.name); // 작성자 이름
            setMNum(decodedToken.num); // 작성자 번호
        }
    }, []);

    // 글자 수를 실시간으로 업데이트하는 함수
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setContent(value); // 내용 업데이트
        setCharCount(value.length); // 글자 수 상태 업데이트
    };

    // 페이지 로드 시 글자 수 초기화
    useEffect(() => {
        setCharCount(content.length);
    }, [content]);

    // 이미지 데이터를 저장하는 함수
    const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target; // 업로드 파일 가져오기
        if (files) { // 파일이 없으면 중지
            const fileArray = Array.from(files); // FileList를 배열로 변환(map사용 가능)
            const filePreviews = fileArray.map(file => { // fileArray는 file 객체
                const reader = new FileReader(); // FileReader 객체 생성 -> 비동기식으로 작동 하기위해 Promise 생성  
                reader.readAsDataURL(file); // 파일을 Data URL로 변환
                return new Promise<string>((resolve) => {
                    reader.onloadend = () => {
                        resolve(reader.result as string); // 변환된 URL을 반환
                    };
                });
            });
            // 미리보기 URL 설정(비동가식으로 처리한 Promise 배열)
            Promise.all(filePreviews).then(previewUrls => {
                setPreviews(previewUrls);
            });

            setImages(fileArray);
        }
    };

    // 비밀번호 입력 제한
    const handlePwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // /.../: 리터럴, ^: 문자열 시작, \d: 숫자(0-9), {0,4}: 숫자반복 횟수, $: 문자열 끝
        if (/^\d{0,4}$/.test(value)) { 
            setPwd(value); // 숫자만 입력되게 4자리까지만 허용
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 기본 폼 제출 동작 방지
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("writer", writer);
            formData.append("content", content);
            formData.append("state", '접수중'); 
            formData.append("pri", pri); // 공개여부(공개1, 비공개2)
            formData.append("pwd", pwd); // 비밀번호
            formData.append("mnum", mNum as string); // 작성자 번호

            // 업로드된 이미지 파일 추가
            images.forEach((file) => {
                formData.append(`images`, file);
            });
            // 서버에 데이터 전송
            const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/compleboard`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate(`/comple/${response.data.num}`); // 작성 완료 후 상세 페이지로 이동
        } catch (error) {
            console.log('Error Message: ' + error);
        }
    };

    return (
        <div className='comple-form'>
            <form onSubmit={handleSubmit}>
                 {/* 제목 입력 */}
                <div>
                    <label htmlFor='title'>제목</label>
                    <input type='text' name='title' id='title' value={title}
                        onChange={e => setTitle(e.target.value)} required />
                </div>

                {/* 작성자 (읽기 전용) */}
                <div>
                    <label htmlFor="writer">작성자</label>
                    <input type="text" name='writer' id='writer' value={writer} readOnly />
                </div>

                {/* 글자 수 제한  */}
                <div>
                    <label htmlFor="content">내용</label>
                    <textarea className='comple-content'
                        name='content'
                        id='content'
                        value={content}
                        maxLength={maxLength} // 최대 글자 수 제한
                        onChange={handleChange}
                        required />
                </div>
                <div>
                    {/* 글자 수 표시 */}
                    <p className="CBF-form-letter">{charCount} / {maxLength} 글자</p>
                </div>
                <div>
                    <label>공개여부</label>
                    <div>
                        <label>
                            <input
                                type="radio"
                                name="pri"
                                value="1"
                                checked={pri === "1"}
                                onChange={e => setPri(e.target.value)}
                            />
                            공개
                        </label>
                        <label style={{ marginLeft: '10px' }}>
                            <input
                                type="radio"
                                name="pri"
                                value="2"
                                checked={pri === "2"}
                                onChange={e => setPri(e.target.value)}
                            />
                            비공개
                        </label>
                    </div>
                </div>

                <div>
                    <label htmlFor="pwd">패스워드</label>
                    <input
                        type="password"
                        name='pwd'
                        id='pwd'
                        value={pwd}
                        onChange={handlePwdChange}
                        required
                        maxLength={4} // 입력창에서 최대 4자리만 허용
                        placeholder='숫자만 4자리까지 입력'
                    />
                </div>
                
                {/* 이미지 파일 업로드 */}
                <div>
                    <label htmlFor='images'>이미지 파일</label>
                    <input type='file' id='images' name='images' onChange={handleChangeImg} multiple />
                </div>
                {previews.length > 0 && (
                    <div>
                        <label>미리보기</label>
                        <div>
                            {previews.map((preview, index) => (
                                <img key={index} src={preview} alt={`미리보기 ${index}`}
                                    style={{ marginRight: '10px', marginBottom: '10px', width: '150px', height: '150px' }} />
                            ))}
                        </div>
                    </div>
                )}
                <div className='button-group'>
                    <button type='button' onClick={() => navigate("/comple")}>리스트</button>
                    <button className='inputbutton' type='submit'>입력</button>
                </div>
            </form>
        </div>
    );
}

export default CompleBoardForm;
