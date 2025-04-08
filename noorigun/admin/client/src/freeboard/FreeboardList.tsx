import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './css/FreeboardList.css';
import axios from 'axios';
import RequireAuth from '../comp/RequireAuth';
import PageNation from '../comp/PageNation';
//게시판 정보
export interface FreeBoardVO {
  num: number;
  title: string;
  writer: string;
  content: string;
  img_names?: string[];//이미지 파일(? = 선택적)
  hit: number;
  fdate: string;
}

const FreeBoardList: React.FC = () => {
  const [freeBoard, setFreeBoard] = useState<FreeBoardVO[]>([]);//게시판 데이터 저장
  const [selecttopics, setSelectTopics] = useState<Set<number>>(new Set());//선택되는 게시글 번호 저장 set
  const [title, setTitle] = useState('');//제목으로 검색
  const [page, setPage] = useState(1);//현재 페이지 번호
  const [size, setSize] = useState(10);//한페이지당 게시물 수
  const [totalPages, setTotalPages] = useState<number>(1);//전체 페이지 수 관리
  const filePath = `${process.env.REACT_APP_BACK_IMG_URL}/`;//이미지 파일경로

  const getFreeList = async (page: number, title: string) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/freeboard`, {
        params: {
          page,
          size,
          searchValue: title,
        }
      }); 
      setFreeBoard(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log('Error Message: ' + error);
    }
  };

  //페이지 번호 변경할때마다 게시글 가져오기
  useEffect(() => {
    getFreeList(page, title);
  }, [page]);

  //검색어에 맞는 페이지 변경
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // 게시물 선택처리
  const handleSelect = (id: number) => {
    const newSelectedFreeboards = new Set(selecttopics);
    if (newSelectedFreeboards.has(id)) {
      newSelectedFreeboards.delete(id);
    } else {
      newSelectedFreeboards.add(id);
    }
    setSelectTopics(newSelectedFreeboards);
  };

  // 전체 선택 처리 함수
  const handleSelectAll = () => {
    if (selecttopics.size === freeBoard.length) {
      setSelectTopics(new Set());
    } else {
      const allMemberIds = new Set(freeBoard.map((freeBoard) => freeBoard.num));
      setSelectTopics(allMemberIds);
    }
  };

  // 선택된 게시물 삭제 
  const handleDeleteSelected = async () => {
    if(window.confirm("정말로 삭제하시겠습니까?")){
    try {
      // 선택된 항목들 삭제 요청
      for (const itemNum of selecttopics) {
        await axios.delete(`${process.env.REACT_APP_BACK_END_URL}/api/fcomm?num=${itemNum}`);
        await axios.delete(`${process.env.REACT_APP_BACK_END_URL}/api/freeboard?num=${itemNum}`);
      }
      // 선택된 항목들을 목록에서 제거
      getFreeList(page, title);
      setSelectTopics(new Set());
    } catch (error) {
      console.error('Error while deleting items:', error);
    }
  };
};
  // 날짜, 시간 형식변경(yyyy-mm-dd hh:mm:ss)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };
  
  //검색어에맞는 제목 가져오기
  const handleSearch = () => {
    getFreeList(1, title);//1페이지부터 검색
    setPage(1);
  }

  return (
    //  RequireAuth 컴포넌트를 통한 인증여부 확인 후 접근 부여
    <RequireAuth>
      <div style={{ padding: '50px' }}>
        <div className="bulletin-board">
          <h1>누리꾼들의 소통공간</h1>

          <div>
            {/* 검색 입력 영역 */}
            <div className='mb-3'>
              <input type='text' placeholder='검색어 입력' value={title} onChange={handleSearchChange} />
              <button className='search' onClick={handleSearch}>검색</button>
            </div>
            {/* 선택된 게시글 삭제 버튼 영역 */}
            <div className='mb-2'>
              <button onClick={handleDeleteSelected} disabled={selecttopics.size === 0}
                className='btn btn-danger del-btn'>
                선택된 게시글 삭제
              </button>
            </div>

            <table>
              <thead>
                <tr>
                  {/* 전체 선택 체크박스 */}
                  <th>
                    <input
                      type="checkbox"
                      checked={selecttopics.size === freeBoard.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>번호</th>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>이미지</th>
                  <th>조회수</th>
                  <th>작성일</th>
                </tr>
              </thead>
              <tbody>
                {/* 게시판 목록 데이터 렌더링 */}
                {
                  freeBoard.map((item) => (
                    <tr key={item.num}>
                      {/* 각 행의 선택 상태 체크박스 */}
                      <td>
                        <input
                          type="checkbox"
                          checked={selecttopics.has(item.num)}
                          onChange={() => handleSelect(item.num)}
                        />
                      </td>
                      {/* 게시판 항목 정보 렌더링 */}
                      <td>{item.num}</td>
                      <td><Link to={`/noorigun/freeboard/${item.num}`}>{item.title}</Link></td>
                      <td>{item.writer}</td>
                      <td>
                        {item.img_names && item.img_names.length > 0 ? (
                          <img src={filePath + item.img_names[0]} alt={item.title}
                            style={{ width: '100px', height: '100px' }} />
                        ) : (
                          <span>이미지 없음</span>
                        )}
                      </td>
                      <td>{item.hit}</td>
                      {/* 작성 날짜 포맷 변환 후 표시 */}
                      <td className="date">{formatDate(item.fdate)}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            <PageNation page={page} totalPages={totalPages} pageChange={setPage}/>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
};

export default FreeBoardList;
