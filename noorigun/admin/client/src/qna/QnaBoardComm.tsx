import React, { useState, useEffect } from "react";
import axios from "axios";
import './css/QnaBoardComm.css'
//qna로부터 전달받은 값(props) 
interface QnaListCommProps {
  num: number; // 댓글 목록이 속한 글의 ID
}
// 댓글 데이터 구조 
interface Comment {
  num: number;
  writer: string;
  content: string;
  qdate: string;
}
// 댓글 컴포넌트
const QnaBoardComm: React.FC<QnaListCommProps> = ({ num }) => {
  const [comments, setComments] = useState<Comment[]>([]); // 댓글 목록 상태
  const [writer, setWriter] = useState("");
  const [content, setContent] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // 기본 1값을 초기화
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  //페이지 변경 시 목록 가져오기
  useEffect(() => {
    console.log("Num" + num);
    fetchComments(currentPage);
  }, [currentPage]);
  // 페이지 이동 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  // 댓글 목록 가져오는 함수
  const fetchComments = async (page: number) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/api/qnaboard`,
        {
          params: { num: num, cPage: page },
        }
      );
      setComments(response.data.data);// 댓글 목록 업데이트
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
      setCurrentPage(response.data.currentPage);
      setStartPage(response.data.startPage);
      setEndPage(response.data.endPage);
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  };
  // 댓글 등록 핸들러
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const commentData = {
      writer: writer,
      content: content,
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_BACK_END_URL}/api/qnaboard`,
        commentData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setWriter("");
      setContent("");
      fetchComments(currentPage); // 댓글 목록 새로고침
    } catch (error) {
      console.error("Error adding comment", error);
    }
  };

  return (
    <div className="q&aboardcomm">
      <h4>댓글</h4>
      <form onSubmit={handleCommentSubmit} className="mb-3">
        <div className="mb-2">
          <input
            type="text"
            placeholder="Writer"
            value={writer}
            onChange={(e) => setWriter(e.target.value)} // 작성자 입력 처리
            className="form-control"
          />
        </div>
        <div className="mb-2">
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}// 내용 입력 처리
            className="form-control"
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          댓글 등록
        </button>
      </form>

      <ul className="list-group">
        {comments.map((comment) => (
          <li key={comment.num} className="list-group-item">
            <strong>{comment.writer}</strong>
            <span className="text-muted">({comment.qdate})</span>
            <p>{comment.content}</p>
          </li>
        ))}
      </ul>
      <div className="d-flex mt-4 justify-content-center">
        <nav>
          <ul className="pagination">
            {/* PrevPage 출력하기 : startPage > 1 보다 클 때  */}
            {startPage > 1 && (
              <li className="page-item">
                {" "}
                <button
                  className="page-link"
                  onClick={() => handlePageChange(startPage - 1)}
                >
                  이전
                </button>
              </li>
            )}

            {/* v페이지 출력하기 */}
            {Array.from(
              { length: endPage - startPage + 1 },
              (_, i) => i + startPage
            ).map((page) => (
              <li
                key={page}
                className={`page-item ${page === currentPage ? "active" : ""}`}
              >
                {/* 현재 버튼이 클릭이 되면 currentPage를 갱신해서 서버로 전송한다 */}

                <button
                  className="page-link"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              </li>
            ))}
            {/* NextPage 출력하기 : totalPage 보다 endPage가 적을때 다음페이지가 있는 것으로 계산  */}
            {endPage < totalPages && (
              <li className="page-item">
                {" "}
                <button
                  className="page-link"
                  onClick={() => handlePageChange(endPage + 1)}
                >
                  다음
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default QnaBoardComm;
