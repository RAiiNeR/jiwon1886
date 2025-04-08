import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/AdminCompleBoard.css";
import Comments from "./Comments";
import RequireAuth from "../comp/RequireAuth";
//게시글 정보
interface CompleBoardVO {
  num: number;
  title: string;
  content: string;
  writer: string;
  state: string;
  deptno: number;
  imgNames?: string[]; // 이미지 파일명 배열
}
//답변 데이터
interface Reply {
  REPLYID: number;
  CONTENT: string;
  DEPTNO: number;
  REPLYDATE: string;
}

const CompleBoardDetail: React.FC = () => {
  const { num } = useParams<{ num: string }>();//url 게시글 번호 가져오기
  const [boardDetail, setBoardDetail] = useState<CompleBoardVO | null>(null);//게시글 상세정보 저장
  const [replies, setReplies] = useState<Reply[]>([]);//댓글 목록 상태
  const [newReply, setNewReply] = useState("");//새로운 댓글 입력 상태
  const [showComments, setShowComments] = useState(false);// 댓글 표시 여부 상태
  const navigate = useNavigate();

  // 부서 번호와 이름 매핑
  const deptMap: { [key: number]: string } = {
    11: "감사담당관",
    12: "기획예산담당관",
    21: "홍보담당관",
    22: "안전복지정책관",
    23: "민원토지관",
    31: "일자리경제관",
    32: "정원산림관",
  };
  //댓글 상태 감지용
  useEffect(() => {
    console.log("qkRnls")
  }, [replies])
  //게시글 상세내용과 댓글목록 불러오기
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:82/noorigun/api/comple/detail?num=${num}`
        );
        const data = response.data;
        if (typeof data.imgNames === "string") {
          data.imgNames = data.imgNames.split(","); // 쉼표로 구분된 문자열을 배열로 변환
        }
        console.log(response.data)
        setBoardDetail(response.data);
      } catch (error) {
        console.error("게시글 상세 조회 중 오류 발생:", error);
      }
    };

    const fetchReplies = async () => {
      try {
        const response = await axios.get(
          `http://localhost:82/noorigun/api/comple/reply/${num}`
        );

        console.log("답변목록:", response.data); // 데이터 확인

        setReplies(response.data);

      } catch (error) {
        console.error("답변 불러오기 중 오류 발생:", error);
      }
    };
    fetchDetail();
    fetchReplies();
  }, [num]);
  //댓글 삭제처리
  const handleDelete = async () => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        await axios.delete(
          `http://localhost:82/noorigun/api/comple/delete?num=${num}`
        );
        alert("게시글이 삭제되었습니다.");
        navigate("/comple");
      } catch (error) {
        console.error("삭제 중 오류 발생:", error);
        alert("삭제에 실패했습니다.");
      }
    }
  };
  //새 댓글 작성
  const handleReplySubmit = async () => {
    if (newReply.trim() === "") {
      alert("답변 내용을 입력해주세요.");
      return;
    }
    try {
      await axios.post("http://localhost:82/noorigun/api/comple/reply/add", {
        cbnum: num,
        content: newReply,
        deptno: boardDetail?.deptno,
      });
      setNewReply("");
      alert("답변이 추가되었습니다.");
      const response = await axios.get(
        `http://localhost:82/noorigun/api/comple/reply/${num}`
      );
      setReplies(response.data); // 댓글 목록 다시 불러오기
    } catch (error) {
      console.error("답변 추가 중 오류 발생:", error);
      alert("답변 추가에 실패했습니다.");
    }
  };
  //댓글 수정버튼 
  const handleEdit = () => {
    navigate(`/comple/edit/${num}`);
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  if (!boardDetail) {
    return <div>로딩 중...</div>;
  }

  return (
    <RequireAuth>
      <div style={{ padding: '50px' }}>
        <div className="admin-comple-detail">
          <h2>{boardDetail.title}</h2>
          <div>
            <p><strong>작성자:</strong> {boardDetail.writer}</p>
            <p><strong>내용:</strong> {boardDetail.content}</p>
            <p><strong>상태:</strong> {boardDetail.state}</p>
            <p><strong>부서:</strong> {deptMap[boardDetail.deptno]}</p>
          </div>

          {/* 이미지 표시 */}
          {boardDetail.imgNames && boardDetail.imgNames.length > 0 && (
            <div className="image-preview-container">
              <h3>첨부 이미지:</h3>
              <div className="image-gallery">
                {boardDetail.imgNames.map((img, index) => (
                  <img
                    key={index}
                    src={`http://localhost:82/noorigun/uploads/${img}`} // 서버 이미지 경로
                    alt={`첨부 이미지 ${index + 1}`}
                    className="detail-image"
                  />
                ))}
              </div>
            </div>
          )}

          {/* 답변 표시 */}
          <div className="reply-section">
            <h3>답변 목록</h3>
            {replies.length > 0 ? (
              replies.map((reply, index) => (
                <div key={index} className="reply-item">
                  <p>{reply.CONTENT}</p>
                  <p>
                    <small>
                      작성 부서: {deptMap[reply.DEPTNO] || "부서 없음"}, 작성일:{" "}
                      {reply.REPLYDATE || "날짜 없음"}
                    </small>
                  </p>
                </div>
              ))
            ) : (
              <p>등록된 답변이 없습니다.</p>
            )}
          </div>

          {/* 답변 작성 */}
          <div className="reply-form">
            <textarea
              placeholder="답변 내용을 입력하세요"
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
            />
            <button onClick={handleReplySubmit}>답변 등록</button>
          </div>
          {/* 버튼 영역 */}
          <div className="action-buttons">
            <button onClick={handleEdit} className="edit-btn">수정</button>
            <button onClick={handleDelete} className="delete-btn">삭제</button>
            <button onClick={() => navigate("/comple")} className="list-btn">
              목록으로
            </button>
            <button onClick={toggleComments} className="edit-btn">
              {showComments ? "댓글 숨기기" : "댓글 보기"}
            </button>
          </div>
          {
            showComments && (<Comments cbnum={boardDetail.num} />)
          }

        </div>
      </div>
    </RequireAuth>
  );
};

export default CompleBoardDetail;
