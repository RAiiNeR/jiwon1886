import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/AdminCompleBoard.css";
import PageNation from "../comp/PageNation";
//댓글 데이터
interface Comment {
  num: number;
  writer: string;
  comments: string;
  ccdate: string;
  cbnum: number;
}
//부모데이터로부터 cbnum을 전달받음
interface CommentsProps {
  cbnum: number;
}

const Comments: React.FC<CommentsProps> = ({ cbnum }) => {
  const [comments, setComments] = useState<Comment[]>([]);//댓글 목록 상태
  const [selectedComments, setSelectedComments] = useState<number[]>([]);
  const [newComment, setNewComment] = useState("");//새 댓글 입력상태
  const [currentPage, setCurrentPage] = useState(1);//현재 페이지 상태
  const [totalPages, setTotalPages] = useState(1);//전체 페이지 수 상태
  const commentsPerPage = 5;//한페이지당 표시할 댓글 수

  useEffect(() => {
    fetchComments(currentPage);
  }, [currentPage]);
  
//댓글 목록 가져오기
  const fetchComments = async (page: number) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/api/ccomm/${cbnum}/paged`,
        {
          params: {
            page: Math.max(page, 1), // 음수 페이지 방지
            size: commentsPerPage,
          },
        }
      );
      if (response.data && Array.isArray(response.data.content)) {
        setComments(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        setComments([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("댓글 불러오기 중 오류 발생:", error);
      setComments([]);
    }
  };
 //새 댓글 작성처리
  const handleCommentSubmit = async () => {
    if (newComment.trim() === "") {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/ccomm`, {
        cbnum,
        comments: newComment,
        writer: "관리자",
      });
      setNewComment("");
      alert("댓글이 추가되었습니다.");
      fetchComments(currentPage);
    } catch (error) {
      console.error("댓글 추가 중 오류 발생:", error);
      alert("댓글 추가에 실패했습니다.");
    }
  };
 //댓글 선택처리
  const handleSelectComment = (num: number) => {
    setSelectedComments((prev) =>
      prev.includes(num)
        ? prev.filter((id) => id !== num)
        : [...prev, num]
    );
  };
  //댓글 전체선택
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedComments(comments.map((comment) => comment.num));
    } else {
      setSelectedComments([]);
    }
  };
 //선택한 댓글 삭제
  const handleDeleteSelected = async () => {
    if (selectedComments.length === 0) {
      alert("삭제할 댓글을 선택해주세요.");
      return;
    }
    if (window.confirm("선택한 댓글을 삭제하시겠습니까?")) {
      try {
        await Promise.all(
          selectedComments.map((num) =>
            axios.delete(`${process.env.REACT_APP_BACK_END_URL}/api/ccomm/${num}`)
          )
        );
        alert("선택한 댓글이 삭제되었습니다.");
        fetchComments(currentPage);
        setSelectedComments([]);
      } catch (error) {
        console.error("댓글 삭제 중 오류 발생:", error);
        alert("댓글 삭제에 실패했습니다.");
      }
    }
  };

  return (
    <div className="ccomm">
      <div className="ccomm-list">
        <h3>댓글 목록</h3>
        <div className="ccomm-controls">
          <div className="ccomm-select-all">
            <input
              type="checkbox"
              onChange={(e) => handleSelectAll(e.target.checked)}
              checked={
                comments.length > 0 &&
                selectedComments.length === comments.map((c) => c.num).length
              }
            />
            <label>전체 선택</label>
          </div>
          <button onClick={handleDeleteSelected} className="ccomm-delete-btn">
            선택 댓글 삭제
          </button>
        </div>
        {comments.length > 0 ? (
          comments.map((comment) => (<>

            <div key={comment.num} className="ccomm-item">
              <input
                type="checkbox"
                checked={selectedComments.includes(comment.num)}
                onChange={() => handleSelectComment(comment.num)}
              />
              <p>{comment.comments}</p>
              <p>
                <small>
                  <strong>작성자: </strong>
                  {comment.writer}, <strong>작성일: </strong>
                  {comment.ccdate || "날짜 없음"}
                </small>
              </p>
            </div>
          </>
          ))
        ) : (
          <p>등록된 댓글이 없습니다.</p>
        )}
        
        <PageNation page={currentPage} totalPages={totalPages} pageChange={setCurrentPage}/>
      </div>

      <div className="ccomm-form">
        <textarea
          className="ccomm-textarea"
          placeholder="댓글 내용을 입력하세요"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleCommentSubmit} className="ccomm-submit-btn">
          댓글 등록
        </button>
      </div>
    </div>
  );
};

export default Comments;
