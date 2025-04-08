import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './css/QnaBoardForm.css';
import { parseJwt } from "../comp/jwtUtils";

const QnaBoardForm: React.FC = () => {
  const [mNum, setMNum] = useState(''); // 회원 ID
  const [title, setTitle] = useState("");
  const [writer, setWriter] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const [charCount, setCharCount] = useState(0); // 글자 수
  const maxLength = 2000;  // 최대 글자 수 제한

  // 글자 수를 실시간으로 업데이트하는 함수
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    setCharCount(value.length); // 글자 수 상태 업데이트
  };

  // 페이지 로드 시 글자 수 초기화
  useEffect(() => {
    setCharCount(content.length); // 현재 내용 글자 수 초기화
  }, [content]);

  // JWT 토큰에서 사용자 정보 추출
  useEffect(() => {
    const token = localStorage.getItem("token"); // 로컬 스토리지에서 JWT 토큰 가져오기
    if (token) {
      const decodedToken = parseJwt(token);
      setWriter(decodedToken.name); // 작성자 이름
      setMNum(decodedToken.num); // 작성자 번호(ID)
    }
  }, []);


  // 질문 저장
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 기본제출 동작 방지

    try {
      const formdata = new FormData();
      formdata.append("title", title);
      formdata.append("writer", writer);
      formdata.append("content", content);
      formdata.append("mnum", mNum as string);
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_END_URL}/api/qnaboard`,
        formdata
      );
      console.log(response.data);
      navigate("/qna"); // 저장 후 질문 목록 페이지로 이동
    } catch (error) {
      console.log("Error Message:" + error);
    }


  };
  return (
    <div className="QnAF-container mt-4">
      <h2 className="QnAF-mb-4">질문 작성</h2>
      <form onSubmit={handleSubmit}>
        <div className="QnAF-form-group">
          <label htmlFor="title" className="QnAF-form-label">제목:</label>
          <input
            type="text"
            className="QnAF-form-control"
            name="title"
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

         {/* 작성자 입력 (읽기 전용) */}
        <div className="QnAF-form-group">
          <label htmlFor="writer" className="QnAF-form-label">작성자:</label>
          <input
            type="text"
            className="QnAF-form-control"
            name="writer"
            id="writer"
            required
            value={writer}
            readOnly // 수정 불가능
          />
        </div>

        <div className="QnAF-form-group QnAF-Box ">
          <label htmlFor="content" className="QnAF-form-label">내용:</label>
          <textarea
            name="content"
            id="content"
            className="QnAF-form-content"
            value={content}
            maxLength={maxLength} // 최대 글자 수 제한
            onChange={handleChange} // 글자 수 업데이트
          />
        </div>
        <div>
          {/* 글자 수 표시 */}
          <p className="QnAF-form-letter">{charCount} / {maxLength} 글자</p>
        </div>

        <div className="QnAF-form-group-container">
          <div className="QnAF-form-group">
            <button type="submit" className="QnAF-btn QnAF-btn-primary">
              등록
            </button>
          </div>

          <div className="QnAF-form-group">
            <button
              type="button"
              className="QnAF-btn QnAF-btn-secondary"
              onClick={() => navigate("/qna")} // 질문목록 페이지
            >
              리스트
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QnaBoardForm;
