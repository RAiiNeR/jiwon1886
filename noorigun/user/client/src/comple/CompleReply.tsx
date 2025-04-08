import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/CompleBoard.css";

interface Reply {
  reply_id: number; // 답변 ID
  content: string; // 답변 내용
  deptno: number; // 부서 번호
  reply_date: string; // 답변 작성일
}

interface CompleReplyProps {
  cbnum: number; // 게시글 번호
}

const CompleReply: React.FC<CompleReplyProps> = ({ cbnum }) => {
  const [replies, setReplies] = useState<Reply[]>([]);

  // 부서번호와 부서이름 매핑
  const deptMap: { [key: number]: string } = {
    11: "감사담당관",
    12: "기획예산담당관",
    21: "홍보담당관",
    22: "안전복지정책관",
    23: "민원토지관",
    31: "일자리경제관",
    32: "정원산림관",
  };

  useEffect(() => {
    fetchReplies(); // 답변 데이터 호출
  }, []);

  const fetchReplies = async () => {
    try {
      // API 호출로 데이터 가져오기
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/api/comple/reply/${cbnum}`
      );
      setReplies(response.data);
    } catch (error) {
      console.error("답변 조회 중 오류 발생:", error);
    }
  };

  return (
    <div className="comple-reply">
      <h3 className="comple-reply-title">누리군의 답변</h3>
      <div className="comple-reply-list">
        {replies.length > 0 ? (
          replies.map((reply) => (
            <div key={reply.reply_id} className="comple-reply-item">
              <p className="comple-reply-content">{reply.content}</p>
              <p className="comple-reply-meta">
                <small>
                  <strong>작성 부서:</strong> {deptMap[reply.deptno] || "부서 없음"}
                  <strong>, 작성일:</strong> {reply.reply_date}
                </small>
              </p>
            </div>
          ))
        ) : (
          <p className="comple-reply-empty">아직 등록된 답변이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default CompleReply;
