import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './css/QnaBoardForm.css';

const QnaBoardForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [writer, setWriter] = useState("");
  const [content, setContent] = useState("");

  const navigate = useNavigate();

  // 질문 저장
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼의 기본 제출 동작 방지

    try {
      const formdata = new FormData();
      formdata.append("title", title);
      formdata.append("writer", writer);
      formdata.append("content", content);

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

        {/* 제목 입력 */}
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

        {/* 작성자 입력 */}
        <div className="QnAF-form-group">
          <label htmlFor="writer" className="QnAF-form-label">작성자:</label>
          <input
            type="text"
            className="QnAF-form-control"
            name="writer"
            id="writer"
            required
            value={writer}
            onChange={(e) => setWriter(e.target.value)}
          />
        </div>

        {/* 내용 입력 */}
        <div className="QnAF-form-group">
          <label htmlFor="content" className="QnAF-form-label">내용:</label>
          <input
            type="text"
            name="content"
            id="content"
            className="QnAF-form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="QnAF-form-group">
          <button type="submit" className="QnAF-btn QnAF-btn-primary">
            등록
          </button>
        </div>

        <div className="QnAF-form-group">
          <button
            type="button"
            className="QnAF-btn QnAF-btn-secondary"
            onClick={() => navigate("/qna")}
          >
            리스트
          </button>
        </div>
      </form>
    </div>
  );
};

export default QnaBoardForm;
