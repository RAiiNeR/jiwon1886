import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const BoardForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [writer, setWriter] = useState('');
    const [content, setContent] = useState('');
    //추가 1: 이미지용 useState
    const [images, setImages] = useState<File[]>([]);
    const navigate = useNavigate();

    //추가 2: 미리보기용 useState
    const [previews, setPreviews] = useState<string[]>([]);

    //추가 3: 이미지를 저장해줄 함수
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

    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("writer", writer);
            formData.append("content", content);
            // 추가 ------------------------
            images.forEach((file, index) => {
                formData.append(`images`, file);
            });

            const response = await axios.post('http://localhost:81/back/api/board', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            navigate('/');
        } catch (error) {
            console.log('Error Message: ' + error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">제목</label>
                    <input type="text" name='title' id='title' value={title}
                        onChange={e => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="writer">작성자</label>
                    <input type="text" name='writer' id='writer' value={writer}
                        onChange={e => setWriter(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="content">내용</label>
                    <input type="text" name='content' id='content' value={content}
                        onChange={e => setContent(e.target.value)} required />
                </div>
                {/*추가4: 파일 추가 UI 및 미리보기 UI */}
                <div>
                    <label htmlFor="images">이미지 파일</label>
                    <input type="file" id="images" name="images" onChange={handleChangeImg} multiple />
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
                <button type='button' onClick={e => navigate("/")}>리스트</button>
            </form>
        </div>
    )
}

export default BoardForm