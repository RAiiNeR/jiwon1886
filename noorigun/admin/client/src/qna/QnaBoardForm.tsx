import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './css/QnaBoardForm.css';
import RequireAuth from "../comp/RequireAuth";

const QnaBoardForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [writer, setWriter] = useState("");
  const [content, setContent] = useState("");
  const [parentNum, setParentNum] = useState<number | null>(null);  // 부모 게시글 번호 추가

  const navigate = useNavigate();
  // 부모 글 번호를 URL에서 가져오기
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get('parentNum');
    if (parent) {
      setParentNum(parseInt(parent));  // 부모 글 번호 설정
    }
  }, []);
  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formdata = new FormData();
      formdata.append("title", title);
      formdata.append("writer", writer);
      formdata.append("content", content);
      // 부모 글 번호가 존재할 경우 추가
      if (parentNum !== null) {
        formdata.append("parentNum", parentNum.toString());  // 부모 글 번호 추가
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BACK_END_URL}/api/qnaboard`,
        formdata
      );
      console.log(response.data);
      navigate("/noorigun/qna");// 성공 시 Q&A 리스트 페이지로 이동
    } catch (error) {
      console.log("Error Message:" + error);
    }


  };
  return (
    <RequireAuth> {/* 인증이 필요할 때만 접근 가능 */}
      <div style={{ padding: '50px' }}>
        <div className="QnAF-container mt-4">
          <h2 className="QnAF-mb-4">답글 작성</h2>
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

            <div className="QnAF-form-group QnAF-btn-group">
              <button type="submit"
                className="QnAF-btn QnAF-btn-primary">
                등록
              </button>
              <button
                type="button"
                className="QnAF-btn QnAF-btn-secondary"
                onClick={() => navigate("/noorigun/qna")}>
                리스트
              </button>
            </div>

            {/* <div className="QnAF-form-group">
          <button
            type="button"
            className="QnAF-btn QnAF-btn-secondary"
            onClick={() => navigate("/qna")}>
            리스트
          </button>
        </div> */}
          </form>
        </div>
      </div>
    </RequireAuth>
  );
};

export default QnaBoardForm;
