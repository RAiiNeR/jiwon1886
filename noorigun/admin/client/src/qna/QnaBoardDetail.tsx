import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import './css/QnaBoardDetail.css';
import RequireAuth from "../comp/RequireAuth";


interface QnaDetail {
  num: number;
  title: string;
  writer: string;
  content: string;
  // hit: number;
  qdate: string;
  parentNum?: number | null; // 부모 글 번호 추가 (답글 구분용)
}

const QnaBoardDetail: React.FC = () => {
  const [qnadetail, setQnadetail] = useState<QnaDetail>();
  const [replies, setReplies] = useState<QnaDetail[]>([]);  // 답글 상태 추가
  const [isVisiable, setIsVisiable] = useState(true)
  const { num } = useParams();
  const navigate = useNavigate();
  // 상세 정보 및 답글 목록 가져오기
  useEffect(() => {
    const getDetail = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/qnaboard/detail?num=${num}`);
        setQnadetail(response.data);
        if (response.data.parentNum) setIsVisiable(false);// 부모글인 경우 답글 버튼 숨김

        const replyResponse = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/qnaboard/replies?parentNum=${num}`);
        setReplies(replyResponse.data);  // 답글 데이터 설정
      } catch (error) {
        console.error("Error fetching upboard detail", error);
      }
    };
    getDetail();
  }, [num]);
  // 날짜 포맷 처리
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };
  // 삭제 버튼 핸들러
  const handleDelete = async () => {
    if(window.confirm("정말로 삭제하시겠습니까?")){
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BACK_END_URL}/api/qnaboard?num=${num}`);
      console.log(response.data);
      navigate("/noorigun/qna");
    } catch (error) {
      console.log('Error Message: ' + error);
    }
  }
};
  // 답글 작성 가능 여부 확인
  const checkReply = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/qnaboard/checkReply/${num}`);
      console.log(response.data)
      if (response.data === 0) {
        navigate(`/noorigun/qna/new?parentNum=${num}`);
      } else {
        alert('이미 답글이 있습니다.');
      }
    } catch (error) {

    }

  }
  if (!qnadetail) {
    return <div>Loading...</div>;
  }

  return (
    <RequireAuth>
      <div className="QnAD-container">
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
          </div>
          <div className="QnAD-card-footer">
            <Link to={"/noorigun/qna"} className="QnAD-btn QnAD-btn-primary me-2">
              목록
            </Link>
            <button type="button" className="QnAD-btn QnAD-btn-secondary me-2" onClick={checkReply} style={{ display: isVisiable ? 'block' : 'none' }}>
              답글 작성
            </button>  {/* 답글 작성 버튼 추가 */}
            <button type="button" className="QnAD-btn QnAD-btn-danger" onClick={handleDelete}>
              삭제
            </button>

          </div>
        </div>
      </div>
    </RequireAuth>
  );
};

export default QnaBoardDetail;
