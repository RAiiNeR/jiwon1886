import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import './css/QnaBoardDetail.css';


interface QnaDetail {
  num: number;
  title: string;
  writer: string;
  content: string;
  // hit: number;
  qdate: string;
}

const QnaBoardDetail: React.FC = () => {
  const [qnadetail, setQnadetail] = useState<QnaDetail>();
  const { num } = useParams(); // URL 파라미터에서 게시글 번호 가져오기
  const navigate = useNavigate();

  useEffect(() => {
    const getDetail = async () => {
      try {
        // 서버에서 get 여청으로 게시글 정보 가져오기
        const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/qnaboard/detail?num=` + num);
        setQnadetail(response.data);

      } catch (error) {
        console.error("Error fetching upboard detail", error);
      }
    };
    getDetail();
  }, [num]); // num이 변경될 때 마다 실행

  // 날짜 포맷 
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // 게시글 삭제
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BACK_END_URL}/api/qnaboard?num=` + num);
      console.log(response.data);
      navigate("/noorigun/qna"); // 삭제 후 Q&A 목록 페이지로 이동
    } catch (error) {
      console.log('Error Message: ' + error);
    }
  }

  if (!qnadetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="QnAD-container mt-5">
      <div className="QnAD-card">
        <div className="QnAD-card-header">
          <h2>{qnadetail.title}</h2>
        </div>
        <div className="QnAD-card-body">
          <div className="QnAD-row mb-3">
            <div className="QnAD-col-md-6">
              <strong>작성자:</strong> {qnadetail.writer}
            </div>

          </div>
          <div className="mb-3">
            <strong>내용:</strong>
            <p>{qnadetail.content}</p>
          </div>
          <div className="QnAD-col-md-6">
          <strong>작성날짜:</strong> {formatDate(qnadetail.qdate)} {/* 날짜 포맷 적용 */}
          </div>
          {/* <div className="QnAD-row">
          <div className="QnAD-col-md-6">
            <strong>조회수:</strong> {qnadetail.hit}
          </div>
        </div> */}
        </div>
        <div className="QnAD-card-footer">
          <Link to={"/noorigun/qna"} className="QnAD-btn QnAD-btn-primary me-2">
            목록
          </Link>
          {/* <Link
            to={`/upboard/edit/${upboard.num}`}
            className="btn btn-warning me-2"
          >
            수정
          </Link> */}
          <button type="button" className="QnAD-btn QnAD-btn-danger" onClick={handleDelete}>
            삭제
          </button>

        </div>
      </div>

      {/* 댓글 컴포넌트 */}
      {/* <QnaListComm num={qnadetail.num} /> */}
    </div>
  );
};

export default QnaBoardDetail;
