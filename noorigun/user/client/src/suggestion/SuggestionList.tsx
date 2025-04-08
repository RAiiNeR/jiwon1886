import React, { useEffect, useState } from 'react'
import "./css/SuggestionList.css";

import axios from 'axios';
import { Link } from 'react-router-dom';

interface SuggestionData { // 제안 데이터
  num: number;
  title: string;
  writer: string;
  content: string;
  img_names: string[];  //추가1->사진 파일과 관련된 컬럼. string 배열로 받겠다.
  hit: number;
  sdate: string;
}
const SuggestionList: React.FC = () => {
  const [suggestionList, setSuggestionList] = useState<SuggestionData[]>([]);  //순서2
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10); // 한 페이지 당 항목 수
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [title, setTitle] = useState(''); // 검색어
  const filePath = `${process.env.REACT_APP_BACK_IMG_URL}/`; // 이미지 파일 경로


  const pagePerBlock = 5; // 한 블럭에 표시할 페이지 수


  const getSuggestList = async (page: number, title: string) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/suggestion`, {

        params: {      // axios가 자동으로 쿼리 매개변수를 URL에 추가(GET 요청에서는 요청 데이터를 URL에 쿼리 매개변수로 포함) -> get로 할때만 필요
          page: page,  // 현재 페이지 번호
          size,        // 현재 페이지 항목 (state에서 가져온 값)
          title,       // 검색할 제목
        }
      });
      setSuggestionList(response.data.content);
      setTotalPages(response.data.total_pages); // 전체 페이지 수 설정
    } catch (error) {
      console.log('Error Message: ' + error);
    }
  }

  // 페이지 블록 계산
  useEffect(() => {
    setStartPage((Math.floor((page - 1) / pagePerBlock) * pagePerBlock) + 1); // 시작페이지 계산
    let end = (Math.floor((page - 1) / pagePerBlock) + 1) * pagePerBlock; // 끝페이지 계산
    end = end > totalPages ? totalPages : end; // 끝 페이지가 전체 페이지를 초과하지 않도록 조정
    setEndPage(end);
  }, [suggestionList])

  // 페이지나 검색어 변경
  useEffect(() => {
    getSuggestList(page, title);
  }, [page, title]);

  // 검색어 변경
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setPage(1); // 검색 시 페이지 1로 초기화
  }

  // 패이지 변경
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  }


  // 날짜, 시간 형식변경
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  // };

  return (
    <div className="suggestionlist">
      <h1>누리꾼들의 제안을 받겠습니다</h1>
      {/* <h3 className='title'>제안 목록</h3>
      <div className="mb-4">총 제안건수{total_Pages}</div>
      <select>
        <option value=""> 진행상황</option>
        <option value="검토중">검토중</option>
        <option value="비공개">비공개</option>
      </select> */}

      <div>
        <div>
          <input type='text' placeholder='검색어 입력' value={title} onChange={handleSearchChange} />
          <button className='search'>검색</button>
        </div>
        <div>

          <table className="suggestion-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>이미지</th>
                <th>조회수</th>
                <th>작성일</th>
              </tr>
            </thead>
            <tbody>
              {/**제안 반복 시작 */}
              {suggestionList.map((item) => (
                <tr key={item.num}>
                  <td>{item.num}</td>
                  <td><Link to={`/noorigun/suggestion/${item.num}`}>{item.title}</Link></td>
                  <td>{item.writer}</td>
                  <td>{item.img_names.length > 0 ? (
                    <img src={filePath + item.img_names[0]}
                      alt={item.title}
                      style={{ width: '100px', height: '100px' }} />
                  ) : (<>이미지 없음</>)
                  }
                  </td>
                  <td>{item.hit}</td>
                  <td>{formatDate(item.sdate)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={6}>
                  <Link to="/noorigun/suggestion/new" className="btn btn-primary mb-3">제안하기</Link>
                </td>
              </tr>
            </tfoot>
          </table>



          <div className='d-flex justify-content-center mt-4'>
            <nav>
              <ul className='pagination'>
                {/* _의 의미
                  - 변수 이름이 필요 없을 때 사용
                  - Array.prototype.map의 콜백 함수는 두 개의 매개변수 를 받지만배열의 요소 (여기서는 사용하지 않음)
                  - 오직 인덱스(i)만 사용하기 때문에 첫 번째 매개변수의 이름을 _로 설정           
              */}
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
                {Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage).map((currpage) => ( // 인덱스(i)를 기반으로 페이지 번호를 렌더링
                  <li key={currpage} className={`page-item ${currpage === page ?
                    'active' : ''}`}>
                    <button className='page-link' // 버튼을 누르면 handlePageChange(currpage) 호출
                      onClick={() => handlePageChange(currpage)}>
                      {currpage}
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
            {/* <div className='btn-box'>
        <button className='btn' onClick={handleButtonClick}>글쓰기</button>
      </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}


export default SuggestionList;
