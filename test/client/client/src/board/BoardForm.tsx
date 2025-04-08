import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const BoardForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [writer, setWriter] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    //handleSubmit이 실행되었을때 form이벤트가 발생했을때 어떤 객체에서 발생했는지 감지하는 것 =>(e: React.FormEvent<HTMLFormElement>)
    //handleSubmit이 실행되었을때 어떤 form에서 이벤트가 발생했는지 감지하는 객체 => (e: React.FormEvent<HTMLFormElement>)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            //formData에 key,value로 값을 저장
            formData.append("title", title);
            formData.append("writer", writer);
            formData.append("content", content);

            //첫번째 인자값('http://localhost:80/test/api/board') : url주소값
            //두번째 인자값(formData) : 데이터값
            //세번째 인자값 : metaform-data설정값(이거 이따가 찾아보기)
            const response = await axios.post('http://localhost:80/test/api/board',formData);
            console.log(response.data);
            navigate('/');
        } catch (error) {
            console.log('오류 : ',error);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">제목</label>
                    <input type="text" name="title" id='title' value={title} onChange={e => setTitle(e.target.value)} required />
                </div>

                <div>
                    <label htmlFor="writer">작성자</label>
                    <input type="text" name="writer" id='writer' value={writer} onChange={e => setWriter(e.target.value)} required />
                </div>

                <div>
                    <label htmlFor="content">내용</label>
                    <input type="text" name="content" id='content' value={content} onChange={e => setContent(e.target.value)} required />
                </div>
                <button type='submit'>입력</button>
            </form>
        </div>
    )
}

export default BoardForm