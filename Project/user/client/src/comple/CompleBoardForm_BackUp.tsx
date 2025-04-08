import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/CompleBoard.css';

const CompleBoardForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [writer, setWriter] = useState('');
    const [content, setContent] = useState('');
    const [state, setState] = useState('접수중');
    const [pri, setPri] = useState('1'); // 기본값 공개 (1)
    const [pwd, setPwd] = useState('');
    const [images, setImages] = useState<File[]>([]);
    // 미리보기 데이터를 담을 previews 추가
    const [previews, setPreviews] = useState<string[]>([]);
    const [charCount, setCharCount] = useState(0);
    const maxLength = 2000;  // 최대 글자 수 제한

    // 글자 수를 실시간으로 업데이트하는 함수
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    setCharCount(value.length); // 글자 수 상태 업데이트
};

    // 페이지 로드 시 글자 수 초기화
    useEffect(() => {
    setCharCount(content.length);
},  [content]);

    const navigate = useNavigate();

    // 이미지 데이터를 저장하는 함수
    const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files) {
            const fileArray = Array.from(files);
            const filePreviews = fileArray.map(file => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                return new Promise<string>((resolve) => {
                    reader.onloadend = () => {
                        resolve(reader.result as string);
                    };
                });
            });

            Promise.all(filePreviews).then(previewUrls => {
                setPreviews(previewUrls);
            });

            setImages(fileArray);
        }
    };

    const handlePwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d{0,4}$/.test(value)) { // 숫자만 입력되게 4자리까지만 허용
            setPwd(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("writer", writer);
            formData.append("content", content);
            formData.append("state", state);
            formData.append("pri", pri);
            formData.append("pwd", pwd);
            images.forEach((file) => {
                formData.append(`images`, file);
            });

            const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/compleboard`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            navigate(`/comple/${response.data.num}`);
        } catch (error) {
            console.log('Error Message: ' + error);
        }
    };

    return (
        <div className='comple-form'>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='title'>제목</label>
                    <input type='text' name='title' id='title' value={title}
                        onChange={e => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="writer">작성자</label>
                    <input type="text" name='writer' id='writer' value={writer}
                        onChange={e => setWriter(e.target.value)} required />
                </div>
                {/* 글자 수 제한  */}
                <div>
                    <label htmlFor="content">내용</label>
                    <textarea  className='comple-content'
                    name='content' 
                    id='content' 
                    value={content}
                    maxLength={maxLength} // 최대 글자 수 제한
                    onChange={handleChange}  
                    required />
                </div>
                <div>
                {/* 글자 수 표시 */}
              <p>{charCount} / {maxLength} 글자</p>
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

                <button type='submit'>입력</button>
                <button type='button' onClick={() => navigate("/comple")}>리스트</button>
            </form>
        </div>
    );
}

export default CompleBoardForm;
