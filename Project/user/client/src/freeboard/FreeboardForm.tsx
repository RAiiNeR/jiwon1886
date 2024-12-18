import React, { useEffect, useState } from 'react';
import './css/FreeBoardForm.css';  // CSS 파일 import
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// interface FormData {
//   title: string;
//   author: string;
//   content: string;
// }

// 1. interface를 useState로 변경
const FreeboardForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [writer, setWriter] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const navigate = useNavigate();
  const [charCount, setCharCount] = useState(0); // 글자 수
  const maxLength = 2000;  // 최대 글자 수 제한

  // 글자 수를 실시간으로 업데이트하는 함수
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value; // 입력값
    setContent(value);
    setCharCount(value.length); // 글자 수 상태 업데이트
  };

  // 페이지 로드 시 글자 수 초기화
  useEffect(() => {
    setCharCount(content.length);
  }, [content]);


  // 이미지 파일 변경
  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      const fileArray = Array.from(files); // FileList를 배열로 변환
      setImages(fileArray); // 이미지 파일 업데이트
      // console.log("Selected files:", fileArray);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { // 2. 비동기식으로 변경
    e.preventDefault(); // 기본 동작 방지

    // 유효성 검증
    if (!title || !writer || !content) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      const formData = new FormData()
      formData.append("title", title);
      formData.append("writer", writer);
      formData.append("content", content);

      images.forEach((file, index) => {
        formData.append(`images`, file)
      }) // 숫자대로 이미지를 기억해서 뽑아주는 것
      const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/freeboard`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log(response.data); // 서버 응답
      navigate('/freeboard') // 자유게시판 목록으로 이동
    } catch (error) {
      console.log('error ' + error)
      alert('서버와 통신 중 문제가 발생했습니다.');
    }
  }


  // // input 값 변경 시 상태 업데이트
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  // // 폼 제출 시
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  // 입력값 검증



  //   console.log('등록된 글:', formData);
  //   setError('');
  //   // 여기에 글 등록 처리 로직 추가
  // };

  return (
    <div>
      <div className="post-form">
        <h2>누리꾼들의 소통공간</h2>

        <form onSubmit={handleSubmit}>

          {/* 제목 입력 */}
          <div className="form-group">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={e => setTitle(e.target.value)} required //handleChange를 지우고 값을 바로 입력
              placeholder="제목을 입력하세요"
            />
          </div>
          {/* 작성자 입력 */}
          <div className="form-group">
            <label htmlFor="writer">작성자</label>
            <input
              type="text"
              id="writer"
              name="writer"
              value={writer}
              onChange={e => setWriter(e.target.value)} required
              placeholder="작성자를 입력하세요"
            />
          </div>

          {/* 내용 입력 */}
          <div className="form-group">
            <label htmlFor="content">내용</label>
            <textarea
              name="content"
              id="content"
              className="FBF-form-content"
              value={content}
              maxLength={maxLength} // 최대 글자 수 제한
              onChange={handleChange}
            />
          </div>
          <div>
            {/* 글자 수 표시 */}
            <p className="FBF-form-letter">{charCount} / {maxLength} 글자</p>
          </div>
          {/* 이미지 파일 첨부 */}
          <div className='form-img'>
            <label htmlFor="images">이미지파일</label>
            <input type="file" id="images" name="images"
              onChange={handleChangeImg} multiple />
          </div>
          <button type='button' onClick={e => navigate('/freeboard')} className='submit-btn'>리스트</button>
          <button type="submit" className='submit-btn'>입력</button>&nbsp;
        </form>
      </div>
    </div>
  );
};

export default FreeboardForm;