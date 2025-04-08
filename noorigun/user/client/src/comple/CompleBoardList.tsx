import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/CompleBoard.css'; // CSS 파일 임포트
import PasswordModal from './PasswordModal'; // PasswordModal 컴포넌트 임포트

interface CompleBoardVO {
  num: number;
  title: string;
  content: string;
  writer: string;
  img_names: string[];
  cdate: string;
  state: string;
  pri: number; // 1: 공개, 2: 비공개
  hit: number;
  pwd: number; // 실제 비밀번호
}

const CompleBoardList: React.FC = () => {
  const [compleBoardList, setCompleBoardList] = useState<CompleBoardVO[]>([]);
  const [page, setPage] = useState(1); // 현재 페이지
  const [size] = useState(10); // 페이지당 항목 수
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [title, setTitle] = useState(''); // 검색어
  const [searchType, setSearchType] = useState<'title' | 'writer'>('title'); // 검색 타입 (제목 또는 작성자)
  const [isModalOpen, setIsModalOpen] = useState(false); // 비밀번호 확인 모달 상태
  const [selectedPost, setSelectedPost] = useState<CompleBoardVO | null>(null); // 선택된 게시글
  const [commentCounts, setCommentCounts] = useState<{ [key: number]: number }>({}) // 댓글 개수

  const filePath = `${process.env.REACT_APP_BACK_END_URL}/`; // 이미지 경로 
  const pagePerBlock = 5;


  useEffect(() => {
    const fetchCommentCounts = async () => {
      const counts: { [key: number]: number } = {};
      await Promise.all(
        compleBoardList.map(async (board) => {
          try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/ccomm/count`, {
              params: { cbnum: board.num }, // 게시글 번호를 쿼리 파라미터로 전송
            });
            counts[board.num] = response.data; // 댓글 개수 저장
          } catch (error) {
            console.error(`Error fetching comment count for board ${board.num}:`, error);
            counts[board.num] = 0; // 에러 발생 시 댓글 개수 0으로 설정
          }
        })
      );
      setCommentCounts(counts);
    };

    if (compleBoardList.length > 0) {
      fetchCommentCounts(); // 게시글이 존재할 경우 댓글 개수 가져오기
    }
  }, [compleBoardList]);


  const navigate = useNavigate();

  // 게시글 목록 가져오기
  const getCompleBoardList = async (page: number, title: string, type: string) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/compleboard`, {
        params: {
          page: page,
          size,
          [type]: title, // 검색 타입에 따라 쿼리 파라미터 설정({ title: title }, { writer: title })

        },
      });
      setCompleBoardList(response.data.content); // 게시글 데이터 설정
      setTotalPages(response.data.total_pages); // 전체 페이지 수 설정
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // 페이지 블록 계산
  useEffect(() => {
    setStartPage((Math.floor((page - 1) / pagePerBlock) * pagePerBlock) + 1); // 시작페이지 계산
    let end = (Math.floor((page - 1) / pagePerBlock) + 1) * pagePerBlock; // 끝페이지 계산
    end = end > totalPages ? totalPages : end; // 끝 페이지가 전체 페이지를 초과하지 않도록 조정
    setEndPage(end);
  }, [compleBoardList])

  // 페이지 변경시 게시글 목록 가져오기
  useEffect(() => {
    getCompleBoardList(page, title, searchType);
  }, [page]);

  const handleSearch = () => {
    setPage(1); // 검색 시 페이지를 1로 초기화
    getCompleBoardList(1, title, searchType);
  };

  // Enter 키로 검색 실행
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 게시글 클릭 시 호출
  const handleRowClick = (post: CompleBoardVO) => {
    if (post.pri === 2) {
      // 비공개 글일 경우 모달 열기
      setSelectedPost(post);
      setIsModalOpen(true);
    } else {
      // 공개 글일 경우 바로 디테일 페이지로 이동
      navigate(`/noorigun/comple/${post.num}`);
    }
  };

  // 비밀번호 확인 처리
  const handlePasswordConfirm = async (inputPassword: string, setErrorMessage: (message: string) => void) => {
    if (selectedPost) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/compleboard/verifyPassword`, {
          params: {
            num: selectedPost.num, // 게시글 번호
            pwd: inputPassword, // 입력된 비밀번호
          },
        });
        if (response.data === true) {
          // 비밀번호가 맞으면 디테일 페이지로 이동
          setIsModalOpen(false); // 모달 닫기
          navigate(`/noorigun/comple/${selectedPost.num}`);
        } else {
          // 비밀번호가 틀리면 빨간 메시지 표시
          setErrorMessage('비밀번호가 틀렸습니다.');
        }
      } catch (error) {
        console.error('Error verifying password:', error);
        setErrorMessage('서버 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 모달 달기
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/-/g, '.'); // 날짜 포맷 수정
    const formattedTime = date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <div className="complelist">
      <div className="comple-step">
      {/* 민원 게시판 타이틀 */}
      <h1 className="main-title">민원 게시판</h1> 
      {/* 민원 안내 섹션 */}
      <div className="guide-section">
        <h2 className="guide-title">
          <span className="icon">📢</span> 민원 안내
        </h2>
        <p className="guide-text">
          민원게시판은 누리군과 관련된 질의·건의·진정 등 민원성 글을 인터넷상으로 편리하게 거재재하고
          신속하게 처리 결과를 확인할 수 있도록 하였습니다. 다만, 민원사무규정에 따라 성명, 주소, 연락처 등의
          불분명한 내용 및 장난성의 글, 저속한 표현, 타인의 명예훼손 등의 글은 예고 없이 삭제될 수 있음을
          알려드립니다.
        </p>
      </div>

      {/* 민원 처리 절차 안내 섹션 */}
      <div className="process-section">
        <h2 className="step-title">
          <span className="icon">🔄</span> 민원 처리 절차 안내
        </h2>
        <div className="step-container">
          <div className="step-box gradient-box">
            <strong>접수</strong>
            <p>글 작성 후 등록</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-box gradient-box">
            <strong>담당부서 지정</strong>
            <p>심사 후 담당부서 지정</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-box gradient-box">
            <strong>처리 (담당부서)</strong>
            <p>담당자 확인 후 처리</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-box gradient-box">
            <strong>완료 (담당부서)</strong>
            <p>처리 결과(답변) 게시</p>
          </div>
        </div>
        <ul className="step-info">
          <li>민원 접수 후 민원접수관부서(총무부)에서 처리부서로 3(근무)시간 내 이첩 처리</li>
          <li>처리부서는 정당한 사유가 있는 경우를 제외하고 7(근무)일 내 민원 처리 완료</li>
          <li>민원 성격상 처리가 늦어지는 경우 진행 상황과 처리 기간 재통보</li>
          <li>본회 소관이 아닌 민원 서류 접수 시 8(근무)시간 내 소관 기관으로 이송</li>
        </ul>
      </div>
    </div>
      <div className="search-container">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as 'title' | 'writer')}
          className="search-option"
        >
          <option value="title">제목</option>
          <option value="writer">작성자</option>
        </select>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyPress}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          검색
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th className="num">번호</th>
            <th className="title">제목</th>
            <th className="writer">작성자</th>
            <th className="hit">조회수</th>
            <th className="date">작성일</th>
            <th className="state">상태</th>
            <th className="pri">공개</th>
          </tr>
        </thead>
        <tbody>
          {compleBoardList.map((item) => (
            <tr key={item.num} onClick={() => handleRowClick(item)}>
              <td className="num">{item.num}</td>
              <td className="title">{item.title}<span className='comment-count'>({commentCounts[item.num] || 0})</span></td>
              <td className="writer">{item.writer}</td>
              <td className="hit">{item.hit}</td>
              {/* <td className="date">{item.cdate}</td> */}
              <td className="date">{formatDate(item.cdate)}</td>
              <td className="state">{item.state}</td>
              <td className="pri">{item.pri === 1 ? "공개" : "비공개"}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={7} className="btn-box">
              <button
                onClick={() => navigate('/noorigun/comple/new')}
                className="apply-button"
              >
                민원 신청
              </button>
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="pagination-container">
        <nav>
          <ul className='pagination'>
            {startPage > 1 && (
              <li className="page-item">
                {" "}
                <button
                  className="page-link"
                  onClick={() => setPage(startPage - 1)} >
                  이전
                </button>
              </li>
            )}
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage).map((curr) => (
              <li key={curr} className={`page-item ${curr === page ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setPage(curr)}>
                  {curr}
                </button>
              </li>
            ))}
            {endPage < totalPages && (
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => setPage(endPage + 1)}>
                  다음
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
      {/* 비밀번호 모달 */}
      <PasswordModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handlePasswordConfirm}
      />
    </div>
    
  );
};

export default CompleBoardList;
