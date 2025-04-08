import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './css/QnaBoard.css';


// JSON 데이터의 형태와 같아야 한다.
interface QnaBoardVO {
  num: number;
  title: string;
  writer: string;
  hit: number;
  qdate: string;
  parentnum?: number | null; // 원글 번호 추가 (답글 구분용)
}

const QnaBoardList: React.FC = () => {
  const [qnaBoard, setQnaBoard] = useState<QnaBoardVO[]>([]); // 게시글 목록
  const [totalPages, setTotalPages] = useState(0);
  const [size] = useState(10); // 페이지당 항목 수
  const [currentPage, setCurrentPage] = useState(1); // 기본 1값을 초기화
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  // 검색을 위한 useState를 추가한다.
  const [searchType, setSearchType] = useState('1'); // 검색 타입 (1: 제목, 2: 작성자, 3: 내용)
  const [searchValue, setSearchValue] = useState(""); // 검색 값
  const [type, setType] = useState(''); // 검색 필드 (title, writer, content)
  const [search, setSearch] = useState(false); // 검색 상태

  const pagePerBlock = 5; // 블록당 페이지 수

  const getQnaBoard = async (page: number, type: string) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/qnaboard`, {
        params: {
          page: page, // 현재 페이지
          size,
          [type]: searchValue, // 검색 필드와 검색 값

        }
      });
      // 쿼리문 수정 전
      // // response.data에 parentNum값이 있어서 사용이 가능
      // const ori:QnaBoardVO[] = response.data.content; // 서버에서 가져온 게시글(전체 게시판 데이터를 ori에 저장)
      // const q:QnaBoardVO[] = ori.filter(e => !e.parentnum); // 원글 필터링(Q)  -> parentNum이 없는 데이터는 질문 글
      // const a:QnaBoardVO[] = ori.filter(e => e.parentnum); // 답글(A) -> parentNum이 있는 데이터는 답변
      // const qna:QnaBoardVO[] = []; // qna 배열은 질문(Q)과 그에 해당하는 답글(A)을 묶어서 저장
      
      // // 원글과 답글을 순서대로 정렬
      // for(let i = 0; i < q.length; i++){
      //   qna.push(q[i]); // 현재 질문을 qna 배열에 추가
      //   //  답변이 존재하면(length > 0), 첫 번째 답변([0])을 qna에 추가
      //   if(a.filter(e => e.parentnum === q[i].num).length > 0){
      //     qna.push(a.filter(e => e.parentnum === q[i].num)[0])
      //   }
      // }
      setQnaBoard(response.data.content); // 게시글 목록 업데이트
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.log('Error Message: ' + error);
    }
  }

  // 페이지 블록 계산
  useEffect(() => {
    setStartPage((Math.floor((currentPage - 1) / pagePerBlock) * pagePerBlock) + 1); // 현재 블록의 시작 페이지
    let end = (Math.floor((currentPage - 1) / pagePerBlock) + 1) * pagePerBlock; // 현재 블록의 마지막 페이지
    end = end > totalPages ? totalPages : end; // 마지막 페이지가 총 페이지를 초과하지 않도록 제한
    setEndPage(end); // 마지막 페이지 설정
  }, [qnaBoard])

  // 게시글 가져오기
  useEffect(() => {
    getQnaBoard(currentPage, type);
  }, [currentPage, search]);

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 날짜 포맷
  const formatDate = (gdate: string) => {
    const date = new Date(gdate);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }

  // 검색
  const handleSearch = () => {
    if (searchType == "1") {
      setType("title");
    } else if (searchType == "2") {
      setType("writer");
    } else {
      setType("content");
    }
    setSearch(!search); //true
  }


  return (

    <div className="QnA-container mt-4">
      <h2 className="QnA-mb-4">Q&A 게시판</h2>
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
          {qnaBoard.map((item) => (
            <tr key={item.num}>                                              {/* 원글과 답글 구분을 위해 답글인 경우 ↳ 추가 */}
              <td className="QnA-text-center align-middle">{item.parentnum ? <span className="reply-indicator"> ↳ </span> : <>{item.num}</>}</td>
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
        <tfoot>
          <tr>
            <th colSpan={5} className="QnA-text-center">
            </th>
          </tr>
        </tfoot>
      </table>
      <div className="d-flex justify-content-between mt-3">
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
        <Link to={"/noorigun/qna/new"} className="QnA-btn QnA-btn-primary QnA-write-btn">
          글쓰기
        </Link>
      </div>
      <div className="QnA-d-flex mt-4 justify-content-center">
        <nav>
          <ul className="pagination">
            {startPage > 1 && (
              <li className="page-item">
                {" "}
                <button
                  className="page-link"
                  onClick={() => handlePageChange(startPage - 1)} >
                  이전
                </button>
              </li>
            )}
            {Array.from(
              { length: endPage - startPage + 1 },
              (_, i) => i + startPage
            ).map((page) => (
              <li key={page} className={`page-item ${page === currentPage ? "active" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(page)}>
                  {page}
                </button>
              </li>
            ))}
            {endPage < totalPages && (
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => handlePageChange(endPage + 1)}>
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

export default QnaBoardList;