import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import './css/QnaBoardList.css';
import RequireAuth from '../comp/RequireAuth';
//게시판 데이터
interface QnaBoardVO {
  num: number;
  title: string;
  writer: string;
  hit: number;
  qdate: string;
  parentNum?: number | null; // 부모 글 번호 추가 (답글 구분용)
}

const QnaBoardList: React.FC = () => {
  const [qnaBoard, setQnaBoard] = useState<QnaBoardVO[]>([]); // Q&A 게시판 데이터 상태
  const [totalPages, setTotalPages] = useState<number>(1);// 총 페이지 수
  const [size] = useState(10);// 한 번에 불러올 데이터 개수
  const [currentPage, setCurrentPage] = useState(1); // 기본 1값을 초기화
  const [startPage, setStartPage] = useState(1); // 현재 페이지 그룹 시작 페이지
  const [endPage, setEndPage] = useState(1); // 현재 페이지 그룹 끝 페이지
  const [searchType, setSearchType] = useState('1');// 검색 유형
  const [searchValue, setSearchValue] = useState(""); // 검색 값
  const [type, setType] = useState(''); // 검색 타입 상태
  const [search, setSearch] = useState(false);//버튼 클릭으로만 검색가능

  const pagePerBlock = 5;
  // Q&A 게시판 데이터를 가져오는 함수
  const getQnaBoard = async (page: number) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/qnaboard`, {
        params: {
          page: page,
          size: size,
          searchType: searchType,
          searchValue: searchValue,
        }
      });

      // 쿼리문 수정 전
      // const ori: QnaBoardVO[] = response.data.content;// 서버에서 반환된 데이터
      // const q: QnaBoardVO[] = ori.filter(e => !e.parentNum);// 원글만 필터링
      // const a: QnaBoardVO[] = ori.filter(e => e.parentNum); // 답글만 필터링
      // const qna: QnaBoardVO[] = []; // 원글과 답글 병합
      // for (let i = 0; i < q.length; i++) {
      //   qna.push(q[i]);
      //   a.map(e => console.log(i, e.parentNum === q[i].num));
      //   if (a.filter(e => e.parentNum === q[i].num).length > 0) {
      //     qna.push(a.filter(e => e.parentNum === q[i].num)[0])// 원글에 해당하는 답글 추가
      //   }
      // }

      // console.log("검색 후 => ", q, a, qna);// 디버깅을 위한 코드

      setQnaBoard(response.data.content);// 상태 업데이트
      setTotalPages(response.data.totalPages || 1); // 총 페이지 수 설정
    } catch (error) {
      console.log('Error Message: ' + error);
      setQnaBoard([]);// 오류 발생 시 게시판 데이터 초기화
    }
  }
  // 페이지 그룹 범위를 설정하는 효과
  useEffect(() => {
    setStartPage((Math.floor((currentPage - 1) / pagePerBlock) * pagePerBlock) + 1);
    let end = (Math.floor((currentPage - 1) / pagePerBlock) + 1) * pagePerBlock;
    end = end > totalPages ? totalPages : end;// 최대 페이지 수 제한
    setEndPage(end);
  }, [qnaBoard])
  // 페이지 변경 시 게시판 데이터 새로고침
  useEffect(() => {
    getQnaBoard(currentPage);
  }, [currentPage]);
  // 검색 버튼 클릭 시 데이터 새로고침
  useEffect(() => {
    getQnaBoard(1);
  }, [search])
  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  // 날짜 포맷 변환 함수
  const formatDate = (gdate: string) => {
    const date = new Date(gdate);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }

  const handleSearch = () => {
    setSearch(!search);// 검색 상태 토글
  }

  return (
    <RequireAuth>
      <div style={{ padding: '50px' }}>
        <div className="QnA-container">
          <h2 className="QnA-mb-4">Q&A 게시판</h2>
          <div className="QnA-search-container">
            <select
              className="QnA-form-select w-auto me-2"
              onChange={(e) => setSearchType(e.target.value)}
              value={searchType}>
              <option value="1">질문</option>
              <option value="2">작성자</option>
              <option value="3">내용</option>
            </select>
            <input
              type="text"
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
              className="QnA-form-control"
              placeholder="검색어를 입력하세요"
            />
            <button className='QnA-search-btn' onClick={handleSearch}>검색</button>
          </div>
          <table className="QnA-table table-bordered table-hover">
            <thead>
              <tr>
                <th>번호</th>
                <th>질문</th>
                <th>작성자</th>
                <th>조회수</th>
                <th>작성일자</th>
              </tr>
            </thead>
            <tbody>
              {
                qnaBoard.map((item) => (
                  <tr key={item.num}>
                    <td className="QnA-text-center align-middle">{/* 원글과 답글 구분을 위해 답글인 경우 'ㄴ>' 추가 */}
                      {item.parentNum ? <span className="reply-indicator"> ↳ </span> : <>{item.num}</>}</td>
                    <td className="QnA-text-center align-middle">

                      <Link to={`/noorigun/qna/${item.num}`} className="QnA-link">
                        {item.title}
                      </Link>
                    </td>
                    <td className="QnA-text-center align-middle">{item.writer}</td>
                    <td className="QnA-text-center align-middle">{item.hit}</td>
                    <td className="QnA-text-center align-middle">{formatDate(item.qdate)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {/* 페이징 버튼 */}
          <div className="d-flex mt-4 justify-content-center">
            <nav>
              <ul className="pagination">
                {startPage > 1 && (
                  <li>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(startPage - 1)}
                    >
                      이전
                    </button>
                  </li>
                )}
                {Array.from(
                  { length: endPage - startPage + 1 },
                  (_, i) => i + startPage
                ).map((page) => (
                  <li
                    key={page}
                    className={`page-item ${page === currentPage ? 'active' : ''}`}
                  >
                    <button className="page-link" onClick={() => handlePageChange(page)}>
                      {page}
                    </button>
                  </li>
                ))}
                {endPage < totalPages && (
                  <li>
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
      </div>
    </RequireAuth>
  )
}

export default QnaBoardList;
