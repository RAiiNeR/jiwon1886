import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './css/PromoteBoardList.css';
import RequireAuth from '../comp/RequireAuth';
import PageNation from '../comp/PageNation';

interface PromoteBoardVO { // postman이랑 동일하게 대소문자 구분하기
  num: number;
  title: string;
  writer: string;
  content: string;
  hit: number;
  pdate: string;
}

const PromoteBoardList: React.FC = () => {
  const [promoteBoardList, setPromoteBoardList] = useState<PromoteBoardVO[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [title, setTitle] = useState(''); // 검색어 상태
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // API 호출: 데이터 로드
  const getPromoteBoardList = async (page: number, title: string) => {
    try {
      const response = await axios.get('http://localhost:82/noorigun/api/promote/promoteList', {
        params: {
          page: page,
          size: itemsPerPage,
          searchValue:title
        }
      });
      console.log('API Response:', response.data); // 추가: 응답 데이터를 출력하여 확인

      setPromoteBoardList(response.data.content);
      setTotalPages(response.data.totalPages);

    } catch (error) {
      console.log('Error Message: ' + error);
    }
  };

  // 컴포넌트 로드 시 데이터 가져오기
  useEffect(() => {
    getPromoteBoardList(currentPage,title);
  }, [currentPage]);

  // 체크박스 핸들러
  const handleCheckboxChange = (num: number) => {
    const updatedSelectedItems = new Set(selectedItems);
    if (updatedSelectedItems.has(num)) {
      updatedSelectedItems.delete(num);
    } else {
      updatedSelectedItems.add(num);
    }
    setSelectedItems(updatedSelectedItems);
  };

  // 게시글 삭제
  const handleDelete = async () => {
    if(window.confirm("정말로 삭제하시겠습니까?")){
    try {
      // 선택된 항목들 삭제 요청
      for (const itemNum of selectedItems) {
        await axios.delete(`http://localhost:82/noorigun/api/promote?num=${itemNum}`);
      }
      // 선택된 항목들을 목록에서 제거
      getPromoteBoardList(1,title); // 
      setSelectedItems(new Set());
    } catch (error) {
      console.error('Error while deleting items:', error);
    }
  };
};
  // 검색 핸들러
  const handleSearchClick = () => {
    setCurrentPage(1); // 검색 시 첫 페이지로 초기화
    getPromoteBoardList(currentPage,title);
  };

  // 검색 입력 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  if (!promoteBoardList) {
    return <div>로딩 중...</div>;
  }

  return (
    <RequireAuth>
      <div className="PromoteBoardList">
        <div className="mpcontainer">
          <h2>홍보글 리스트</h2>
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>선택</th>
                <th>제목</th>
                <th>작성자</th>
                <th>내용</th>
                <th>조회수</th>
                <th>작성일</th>
              </tr>
            </thead>
            <tbody>
              {promoteBoardList.length === 0 ? (
                <tr>
                  <td colSpan={6}>등록된 게시글이 없습니다.</td>
                </tr>
              ) : (
                promoteBoardList.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.num)}
                        onChange={() => handleCheckboxChange(item.num)}
                      />
                    </td>
                    <td>
                      <Link to={`/promote/${item.num}`}>{item.title}</Link>
                    </td>
                    <td>{item.writer}</td>
                    <td>{item.content}</td>
                    <td>{item.hit}</td>
                    <td>{item.pdate}</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4}>
                  {/* 검색어 입력 */}
                  <div className="search-container">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="검색어를 입력하세요..."
                      value={title}
                      onChange={handleSearchChange}
                    />
                    <button className="btn btn-primary" onClick={handleSearchClick}>
                      검색
                    </button>
                  </div>
                </td>
                <td colSpan={2}>
                  {/* 등록 및 삭제 버튼 */}
                  <div className="action-buttons">
                    <Link className="btn btn-success" to="/promote/new">
                      등록
                    </Link>
                    <button className="btn btn-danger" onClick={handleDelete}>
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>


          {/* 페이징 버튼 */}
            <PageNation page={currentPage} totalPages={totalPages} pageChange={setCurrentPage}/>
        </div>
      </div>
    </RequireAuth>
  );
};

export default PromoteBoardList;
