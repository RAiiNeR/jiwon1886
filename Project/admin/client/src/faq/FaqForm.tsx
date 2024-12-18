import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/FaqForm.css";
import RequireAuth from "../comp/RequireAuth";

// 카테고리 옵션
const categories = ["전체", "회원", "민원"];

const FaqForm: React.FC = () => {
  const [category, setCategory] = useState('전체');//카테고리 선택
  const [title, setTitle] = useState('');//제목
  const [answer, setAnswer] = useState('');//답변
  const navigate = useNavigate();//페이지 이동 hook

  //폼 제출 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 입력값 검증
    if (!title || !answer) {//제목, 답변 없을때 경고창
      alert('모든 항목을 입력해주세요.');
      return;
    }

    try {
      const formData = new FormData();//폼 데이터 생성
      formData.append("title", title);//제목 데이터 추가
      formData.append("category", category);//카테고리 데이터 추가
      formData.append("answer", answer);//답변 데이터 추가

      //서버로 데이터 전송
      const response = await axios.post('http://localhost:82/noorigun/api/faq', formData
      );
      console.log(response.data);
      navigate('/faq');

    } catch (error) {
      console.log('Error Message:' + error);
    }
  };

  return (
    <RequireAuth>
      <div style={{ padding: '50px' }}>
        <div className="FaqForm">
          <h3>FAQ 추가</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">제목</label>
              <input
                type="text"
                id="title"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="answer">답변</label>
              <textarea
                id="answer"
                className="form-control"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">카테고리</label>
              <select
                id="category"
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}//선택값 상태 업데이트
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              저장
            </button>
          </form>
        </div>
      </div>
    </RequireAuth>
  );
};

export default FaqForm;