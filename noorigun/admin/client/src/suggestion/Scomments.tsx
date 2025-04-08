import axios from 'axios';
import React, { useEffect, useState } from 'react'
import PageNation from '../comp/PageNation';

interface Scomment {
  num: number;
  writer: string;
  comments: string;
  scdate: string;
  sbnum: number;
}
// Props로 넘어오는 댓글 목록 관련 데이터
interface ScommentsProps {
  sbnum: number;  // 부모 게시글 번호
}


const Scomments: React.FC<ScommentsProps> = ({ sbnum }) => {
  // 댓글 상태 관리
  const [scomments, setScomments] = useState<Scomment[]>([]);
  const [selectedScomments, setSelectedScomments] = useState<number[]>([]);// 선택한 댓글 목록
  const [newScomment, setNewScomment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const commentsPerPage = 5;
  const pagesToShow = 5;
  // 댓글 목록 불러오기
  useEffect(() => {
    fetchComments(currentPage);
  }, [currentPage]);
  // 댓글 불러오는 함수
  const fetchComments = async (page: number) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/api/scomm/${sbnum}/paged`,
        {
          params: {
            page: Math.max(page, 1), // 음수 페이지 방지
            size: commentsPerPage,
          },
        }
      );
      if (response.data && Array.isArray(response.data.content)) {
        setScomments(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        setScomments([]); // 댓글이 없으면 빈 배열 설정
        setTotalPages(1);
      }
    } catch (error) {
      console.error("댓글 불러오기 중 오류 발생:", error);
      console.log("댓글!" + setScomments([]))
      setScomments([]);
    }
  };
  // 새 댓글 등록
  const handleCommentSubmit = async () => {
    if (newScomment.trim() === "") {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/scomm`, {
        sbnum,
        comments: newScomment,
        writer: "관리자",
      });
      setNewScomment("");
      alert("댓글이 추가되었습니다.");
      setCurrentPage(1);
    } catch (error) {
      console.error("댓글 추가 중 오류 발생:", error);
      alert("댓글 추가에 실패했습니다.");
    }
  };
  // 댓글 선택 핸들러
  const handleSelectComment = (num: number) => {
    setSelectedScomments((prev) =>
      prev.includes(num)
        ? prev.filter((id) => id !== num)
        : [...prev, num]
    );
  };
  // 전체 선택/해제 핸들러
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedScomments(scomments.map((scomment) => scomment.num));
    } else {
      setSelectedScomments([]);
    }
  };
  // 선택한 댓글 삭제
  const handleDeleteSelected = async () => {
    if (selectedScomments.length === 0) {
      alert("삭제할 댓글을 선택해주세요.");
      return;
    }

    if (window.confirm("선택한 댓글을 삭제하시겠습니까?")) {
      try {
        await Promise.all(
          selectedScomments.map((num) =>
            axios.delete(`${process.env.REACT_APP_BACK_END_URL}/api/scomm/${num}`)
          )
        );
        alert("선택한 댓글이 삭제되었습니다.");
        fetchComments(currentPage);
        setSelectedScomments([]);
      } catch (error) {
        console.error("댓글 삭제 중 오류 발생:", error);
        alert("댓글 삭제에 실패했습니다.");
      }
    }
  };

  return (
    <div className="scomm">
      <div className="scomm-list">
        <h3>댓글 목록</h3>
        <div className="scomm-controls">
          <div className="scomm-select-all">
            <input
              type="checkbox"
              onChange={(e) => handleSelectAll(e.target.checked)}
              checked={
                scomments.length > 0 &&
                selectedScomments.length === scomments.map((s) => s.num).length
              }
            />
            <label>전체 선택</label>
          </div>
          <button onClick={handleDeleteSelected} className="scomm-delete-btn">
            선택 댓글 삭제
          </button>
        </div>
        {scomments.length > 0 ? (
          scomments.map((scomment) => (
            <div key={scomment.num} className="scomm-item">
              <input
                type="checkbox"
                checked={selectedScomments.includes(scomment.num)}
                onChange={() => handleSelectComment(scomment.num)}
              />
              <p>{scomment.comments}</p>
              <p>
                <small>
                  <strong>작성자: </strong>
                  {scomment.writer}, <strong>작성일: </strong>
                  {scomment.scdate || "날짜 없음"}
                </small>
              </p>
            </div>
          ))
        ) : (
          <p>등록된 댓글이 없습니다.</p>
        )}
        <PageNation page={currentPage} totalPages={totalPages} pageChange={setCurrentPage}/>
      </div>
      <div className="scomm-form">
        <textarea
          className="scomm-textarea"
          placeholder="댓글 내용을 입력하세요"
          value={newScomment}
          onChange={(e) => setNewScomment(e.target.value)}
        />
        <button onClick={handleCommentSubmit} className="scomm-submit-btn">
          댓글 등록
        </button>
      </div>
    </div>
  );
};
export default Scomments;
