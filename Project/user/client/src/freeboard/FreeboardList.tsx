import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/FreeBoardList.css';
import axios from 'axios';


export interface FreeBoardVO {
  num: number;
  title: string;
  writer: string
  content: string;
  img_names: string[];
  hit: number;
  fdate: string;
}

const FreeboardList: React.FC = () => {
  const [freeBoard, setfreeBoard] = useState<FreeBoardVO[]>([]);
  const [page, setPage] = useState(1); // 현재 페이지 번호
  const [size, setSize] = useState(10); // 한 페이지당 항목 개수
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [title, setTitle] = useState(''); // 검색 제목
  const filePath = `${process.env.REACT_APP_BACK_IMG_URL}/` // 이미지 경로
  // const navigate = useNavigate();

  const pagePerBlock = 5; // 페이지 블록당 페이지 수

  const getFreeList = async (page: number, title: string) => {
    try {
      const response = await axios.get
        (`${process.env.REACT_APP_BACK_END_URL}/api/freeboard`, {


          params: {      // axios가 자동으로 쿼리 매개변수를 URL에 추가(GET 요청에서는 요청 데이터를 URL에 쿼리 매개변수로 포함) -> get로 할때만 필요
            page: page,  // 현재 페이지 번호
            size,        // 현재 페이지 항목 (state에서 가져온 값)
            title,       // 검색할 제목
          }
        });
      setfreeBoard(response.data.content); // 게시글 데이터
      setTotalPages(response.data.total_pages); // 전체 페이지 수 업데이트
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
  }, [freeBoard])

  // 페이지나 검색어 변경
  useEffect(() => {
    getFreeList(page, title);
  }, [page])


  // 검색어 변경
  const handleSearch = () => {
    getFreeList(1, title);
    setPage(1) // 검색 시 페이지 1로 초기화
  };

  // 패이지 변경
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 날짜, 시간 형식변경
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="bulletin-board">
      <h1>누리꾼들의 소통공간</h1>

      <div>
        <div>
          <input type='text' className='search-input' placeholder='검색어 입력' 
          value={title} onChange={e => setTitle(e.target.value)}
          />
          <button className='search' onClick={handleSearch}>검색</button>
        </div>

        <table>
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

            {
              freeBoard.map((item) => (
                <tr key={item.num}>
                  <td>{item.num}</td>
                  <td><Link to={`/freeboard/${item.num}`}>{item.title}</Link></td>
                  <td>{item.writer}</td>
                  <td>{item.img_names.length > 0 ? (
                    <img src={filePath + item.img_names[0]} alt={item.title}
                      style={{ width: '100px', height: '100px' }} />
                  ) : (<>이미지 없음</>)}</td>
                  <td>{item.hit}</td>
                  {/* <td>{item.fdate}</td> */}
                  <td className="date">{formatDate(item.fdate)}</td>
                </tr>
              ))
            }

            {/* {posts.map((post) => (
            <tr key={post.num}>
              <td>{post.num}</td>
              <td className='title'><Link to='/freeDetail'>{post.title}</Link></td>
              <td>{post.id}</td>
              <td>{post.date.toLocaleDateString()}</td>
              <td>{post.reip}</td>
            </tr>
          ))} */}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6}>
                <div className="write-button-container">
                  <Link to={'/freeboard/new'} className='write-button'>글쓰기</Link>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>



        <div className='freebboard'>
          <nav>
            <ul className='pagination'>
              {/* _의 의미
                  - 변수 이름이 필요 없을 때 사용
                  - Array.prototype.map의 콜백 함수는 두 개의 매개변수 를 받지만배열의 요소 (여기서는 사용하지 않음)
                  - 오직 인덱스(i)만 사용하기 때문에 첫 번째 매개변수의 이름을 _로 설정           
              */}
              {startPage > 1 && (
                <li className="freebboard-page">
                  <button
                    className="freebboard-page"
                    onClick={() => handlePageChange(startPage - 1)} >
                    이전
                  </button>
                </li>
              )}
              {Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage).map((currPage) => ( // 인덱스(i)를 기반으로 페이지 번호를 렌더링
                <li key={currPage} className={`page-item ${currPage === page ?
                  'active' : ''}`}>
                  <button className='page-link' // 버튼을 누르면 handlePageChange(i + 1) 호출
                    onClick={() => handlePageChange(currPage)}>
                    {currPage}
                    {/* 페이지 번호로 사용(배열 인덱스는 0부터 시작하므로 1을 더함) */}
                  </button>
                </li>
              ))}
              {endPage < totalPages && (
                <li className="freebboard-page">
                  <button
                    className="freebboard-page"
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
  );
}

export default FreeboardList;