import axios from 'axios';
import React, { useEffect, useState } from 'react'
//댓글 정보 
interface Fcomment {
  num: number;
  writer: string;
  comments: string;
  fcdate: string;
  fbnum: number;
}
//게시판 항목 번호
interface FcommentsProps {
  fbnum: number;//특정 게시글 번호
}


const Fcomments: React.FC<FcommentsProps> = ({ fbnum }) => {
  const [fcomments, setFcomments] = useState<Fcomment[]>([]); // 댓글 목록 상태 관리
  const [selectedFcomments, setSelectedFcomments] = useState<number[]>([]);  // 선택한 댓글 ID 상태 관리
  const [newFcomment, setNewFcomment] = useState("");  // 새 댓글 입력 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(1);  // 전체 페이지 수 상태
  const commentsPerPage = 5;  // 한 페이지당 댓글 개수
  const pagesToShow = 5;  // 한 번에 표시할 페이지 버튼 수
  // 댓글 목록을 가져오기
  useEffect(() => {
    fetchComments(currentPage);
  }, [currentPage]);
  // 댓글 목록을 페이지 단위로 가져오는 함수
  const fetchComments = async (page: number) => {
    try {
      const response = await axios.get(
        `http://localhost:82/noorigun/api/fcomm/${fbnum}/paged`,
        {
          params: {
            page: Math.max(page, 1), // 음수 페이지 방지
            size: commentsPerPage,
          },
        }
      );
      if (response.data && Array.isArray(response.data.content)) {
        setFcomments(response.data.content);// 댓글 목록 상태 업데이트
        setTotalPages(response.data.totalPages);// 전체 페이지 수 업데이트
      } else {
        setFcomments([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("댓글 불러오기 중 오류 발생:", error);
      console.log("댓글!" + setFcomments([]))
      setFcomments([]);
    }
  };
  // 새 댓글을 등록하는 이벤트 처리
  const handleCommentSubmit = async () => {
    if (newFcomment.trim() === "") {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    try {
      await axios.post("http://localhost:82/noorigun/api/fcomm", {
        fbnum,
        comments: newFcomment,
        writer: "관리자",
      });
      setNewFcomment("");
      alert("댓글이 추가되었습니다.");
      fetchComments(currentPage);
    } catch (error) {
      console.error("댓글 추가 중 오류 발생:", error);
      alert("댓글 추가에 실패했습니다.");
    }
  };
  // 개별 댓글 선택 처리
  const handleSelectComment = (num: number) => {
    setSelectedFcomments((prev) =>
      prev.includes(num)
        ? prev.filter((id) => id !== num)// 선택 해제
        : [...prev, num]// 선택
    );
  };
  // 전체 댓글 선택/선택 해제
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFcomments(fcomments.map((fcomment) => fcomment.num)); // 모든 댓글 선택
    } else {
      setSelectedFcomments([]);// 모든 선택 해제
    }
  };
  // 선택한 댓글 삭제 처리
  const handleDeleteSelected = async () => {
    if (selectedFcomments.length === 0) {
      alert("삭제할 댓글을 선택해주세요.");
      return;
    }

    if (window.confirm("선택한 댓글을 삭제하시겠습니까?")) {
      try {
        await Promise.all(
          selectedFcomments.map((num) =>
            axios.delete(`http://localhost:82/noorigun/api/fcomm/${num}`)
          )
        );
        alert("선택한 댓글이 삭제되었습니다.");
        fetchComments(currentPage);
        setSelectedFcomments([]);
      } catch (error) {
        console.error("댓글 삭제 중 오류 발생:", error);
        alert("댓글 삭제에 실패했습니다.");
      }
    }
  };
  //페이징 처리
  const renderPagination = () => {
    const startPage =
      Math.max(Math.floor((currentPage - 1) / pagesToShow) * pagesToShow + 1, 1);
    const endPage = Math.min(startPage + pagesToShow - 1, totalPages);
    const pages = [];

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`fcomm-page-number ${i === currentPage ? "active" : ""}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }


    return (
      <div className="fcomm-pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          이전
        </button>
        {pages}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
    );
  };

  return (
    <div className="fcomm">
      <div className="fcomm-list">
        <h3>댓글 목록</h3>
        <div className="fcomm-controls">
          <div className="fcomm-select-all">
            <input
              type="checkbox"
              onChange={(e) => handleSelectAll(e.target.checked)}
              checked={
                fcomments.length > 0 &&
                selectedFcomments.length === fcomments.map((f) => f.num).length
              }
            />
            <label>전체 선택</label>
          </div>
          <button onClick={handleDeleteSelected} className="fcomm-delete-btn">
            선택 댓글 삭제
          </button>
        </div>
        {fcomments.length > 0 ? (
          fcomments.map((fcomment) => (
            <div key={fcomment.num} className="fcomm-item">
              <input
                type="checkbox"
                checked={selectedFcomments.includes(fcomment.num)}
                onChange={() => handleSelectComment(fcomment.num)}
              />
              <p>{fcomment.comments}</p>
              <p>
                <small>
                  <strong>작성자: </strong>
                  {fcomment.writer}, <strong>작성일: </strong>
                  {fcomment.fcdate || "날짜 없음"}
                </small>
              </p>
            </div>
          ))
        ) : (
          <p>등록된 댓글이 없습니다.</p>
        )}
        {renderPagination()}
      </div>
      <div className="fcomm-form">
        <textarea
          className="fcomm-textarea"
          placeholder="댓글 내용을 입력하세요"
          value={newFcomment}
          onChange={(e) => setNewFcomment(e.target.value)}
        />
        <button onClick={handleCommentSubmit} className="fcomm-submit-btn">
          댓글 등록
        </button>
      </div>
    </div>
  );
};
export default Fcomments;
