import React, { useEffect, useState } from 'react'
import "./css/SuggestionList.css";
import axios from 'axios';
import { Link } from 'react-router-dom';
import RequireAuth from '../comp/RequireAuth';
import PageNation from '../comp/PageNation';

interface SuggestionData {
  num: number;
  title: string;
  writer: string;
  content: string;
  img_names?: string[];// 이미지 이름 (? = 선택적)
  hit: number;
  sdate: string;
  state: string; // 상태 필드 추가
}

const SuggestionList: React.FC = () => {
  const [suggestionList, setSuggestionList] = useState<SuggestionData[]>([]); // 제안 리스트 상태
  const [selectedItems, setSelectedItems] = useState<number[]>([]); // 선택된 항목 관리
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [title, setTitle] = useState('');
  const filePath = 'http://localhost:82/noorigun/uploads/'; // 이미지 경로

  // 제안 리스트를 가져오는 함수
  const getSuggestList = async (page: number, title: string) => {
    try {
      const response = await axios.get('http://localhost:82/noorigun/api/suggestion', {
        params: {
          page: page,
          size,
          searchValue: title,
        }
      });
      setSuggestionList(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log('Error Message: ' + error);
    }
  }

  // 페이지가 변경될 때 리스트 가져오기
  useEffect(() => {
    getSuggestList(page, title);
  }, [page]);

  // 검색어 입력 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setPage(1);
  }

  // 검색 버튼 핸들러
  const handleSearch = () => {
    console.log("title" + title)
    getSuggestList(1, title);
  }
  // 날짜 포맷 변환
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }

  // 항목 선택/해제 처리 함수
  const handleCheckboxChange = (num: number) => {
    setSelectedItems(prevSelected => {
      if (prevSelected.includes(num)) {
        return prevSelected.filter(item => item !== num); // 이미 선택된 항목은 해제
      } else {
        return [...prevSelected, num]; // 선택되지 않은 항목은 추가
      }
    });
  }

  // 선택된 항목 삭제 처리
  const handleDeleteSelected = async () => {
    if(window.confirm("정말로 삭제하시겠습니까?")){
    try {
      // 선택된 항목들 삭제 요청 (서버에서 처리)
      await axios.delete('http://localhost:82/noorigun/api/suggestion', {
        // data: { ids: selectedItems }
        data: selectedItems, // 배열을 data로 전송
      });
      // 삭제 후 선택된 항목 초기화 및 리스트 갱신
      setSelectedItems([]);
      getSuggestList(page, title); // 목록 다시 불러오기
    } catch (error) {
      console.error('삭제 실패: ', error);
    }
  }
};
  return (
    <RequireAuth>
      <div style={{ padding: "50px" }}>
        <div className="suggestionlist">
          <h1>누리꾼들의 제안을 받겠습니다</h1>

          <div>
            <input type='text' placeholder='검색어 입력' value={title} onChange={handleSearchChange} />
            <button className='search' onClick={handleSearch}>검색</button>
          </div>

          <div className='button-box'>
            <button onClick={handleDeleteSelected}
              disabled={selectedItems.length === 0}
              className='del-btn btn btn-danger'>
              선택된 항목 삭제
            </button>
          </div>

          <table className="suggestion-table">
            <thead>
              <tr>
                <th>선택</th>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>이미지</th>
                <th>작성일</th>
                <th>상태</th> {/* 상태 열 추가 */}
              </tr>
            </thead>
            <tbody>
              {suggestionList.map((item) => (
                <tr key={item.num}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.num)}
                      onChange={() => handleCheckboxChange(item.num)}
                    />
                  </td>
                  <td>{item.num}</td>
                  <td><Link to={`/suggest/${item.num}`}>{item.title}</Link></td>
                  <td>{item.writer}</td>
                  <td>{
                    item.img_names && (
                      <img src={filePath + item.img_names[0]} alt={item.title} style={{ width: '100px', height: '100px' }} />
                    )}
                  </td>
                  <td>{formatDate(item.sdate)}</td>
                  <td>{item.state}</td> {/* 상태 표시 */}
                </tr>
              ))}
            </tbody>
          </table>
          <PageNation page={page} totalPages={totalPages} pageChange={setPage} />
        </div>
      </div>
    </RequireAuth>
  );
}

export default SuggestionList;