import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./css/ProgramList.css"

interface Program {
  num: number;
  title: string;
  content: string;
  category:string;
  age:number;
  teacher: string;
  student: number;
  education : number;
  startperiod: string;
  endperiod: string;
  startdeadline: string;
  enddeadline: string;
  starttime: string;
  endtime: string;
  hit: number;
  pdate: string;
}

const ProgramList: React.FC = () => {
  const [programList, setProgramList] = useState<Program[]>([]); // 전체 프로그램 목록
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set()); // 선택된 항목
  const [title, setTitle] = useState(''); // 검색어 상태
  const [student,setStudent]=useState();
  const [searchType, setSearchType] = useState('title'); // 검색 타입 (제목 또는 강사명)
  const [filteredPosts, setFilteredPosts] = useState<Program[]>([]); // 검색 필터링된 프로그램 목록
  const [totalItems, setTotalItems] = useState(0); // 총 항목 수
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [startPage, setStartPage] = useState(1); // 페이지 시작 번호
  const [endPage, setEndPage] = useState(0); // 페이지 끝 번호
  const itemsPerPage = 10;

  // 프로그램 목록을 API에서 가져오는 함수
  const getProgramList = async () => {
    try {
      const response = await axios.get("http://localhost:82/noorigun/api/program/programList");
      setProgramList(response.data); // 전체 프로그램 목록 업데이트
      setFilteredPosts(response.data); // 초기에는 전체 데이터를 필터링된 데이터로 설정
      setTotalItems(response.data.length); // 전체 항목 수 설정
      setTotalPages(Math.ceil(response.data.length / itemsPerPage)); // 총 페이지 수 계산
    } catch (error) {
      console.error("프로그램 목록을 가져오는 중 오류 발생:", error);
    }
  }

  useEffect(() => {
    getProgramList(); // 컴포넌트가 렌더링될 때 프로그램 목록을 가져옴
  }, []);

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (num: number) => {
    const updatedSelectedItems = new Set(selectedItems);
    if (updatedSelectedItems.has(num)) {
      updatedSelectedItems.delete(num);
    } else {
      updatedSelectedItems.add(num);
    }
    setSelectedItems(updatedSelectedItems); // 선택된 항목 업데이트
  };

  // 검색 입력 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value); // 검색어 상태 업데이트
  };

  // 검색 핸들러
  const handleSearchClick = () => {
    const result = programList.filter((item) => {
      if (searchType === 'title') {
        return item.title.includes(title); // 제목으로 검색
      } else if (searchType === 'teacher') {
        return item.teacher.includes(title); // 강사명으로 검색
      }
      return false;
    });
    setFilteredPosts(result); // 검색 결과로 필터링된 프로그램 목록 설정
    setTotalItems(result.length); // 검색된 항목 수 업데이트
    setTotalPages(Math.ceil(result.length / itemsPerPage)); // 총 페이지 수 갱신
    setCurrentPage(1); // 검색 후 첫 페이지로 초기화
  };

  // 페이징 처리 및 데이터 필터링
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setFilteredPosts((prev) => prev.slice(startIndex, endIndex)); // 현재 페이지 데이터만 필터링

    // 페이지 번호 처리
    const newStartPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
    setStartPage(newStartPage);
    setEndPage(Math.min(newStartPage + 4, totalPages));
  }, [filteredPosts, currentPage, totalPages]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page); // 현재 페이지 상태 업데이트
  };

  // 게시글 삭제
  const handleDelete = async () => {
    try {
      // 선택된 항목들 삭제 요청
      for (const itemNum of selectedItems) {
        await axios.delete(`http://localhost:82/noorigun/api/program?num=${itemNum}`);
      }
      // 삭제 후 프로그램 목록 갱신
      getProgramList();
      setSelectedItems(new Set()); // 선택된 항목 초기화
    } catch (error) {
      console.error('Error while deleting items:', error);
    }
  };

  const getAgeCategory = (age: number) => {
    switch (age) {
      case 1:
        return "아동";
      case 2:
        return "학생";
      case 3:
        return "노년";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  console.log(selectedItems);

  return (
    <div className="ProgramList">
      <div>
     <div className="search-container">
        {/* 검색 타입 선택 */}
        <select
          className="search-type"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="title">제목</option>
          <option value="teacher">강사명</option>
        </select>

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
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>선택</th>
              <th>강좌명</th>
              <th>종류</th>
              <th>수강대상</th>
              <th>인원수</th>
              <th>강사명</th>
              <th>신청기간</th>
              <th>강의기간</th>
              <th>수강시간</th>
              <th>조회수</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={11}>등록된 게시글이 없습니다.</td>
              </tr>
            ) : (
              filteredPosts.map((item) => (
                <tr key={item.num}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.num)}
                      onChange={() => handleCheckboxChange(item.num)}
                    />
                  </td>
                  <td>
                    <Link to={`/program/${item.num}`}>{item.title}</Link>
                  </td>
                  <td>{item.category}</td>
                  <td>{getAgeCategory(item.age)}</td>
                  <td>{item.student}/{item.education}</td>
                  <td>{item.teacher}</td>
                  <td>{formatDate(item.startdeadline).substring(0, 12)} - {formatDate(item.enddeadline).substring(0, 12)}</td>
                  <td>{formatDate(item.startperiod).substring(0, 12)} - {formatDate(item.endperiod).substring(0, 12)}</td>
                  <td>{item.starttime} - {item.endtime}</td>
                  <td>{item.hit}</td>
                  <td>{item.pdate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 등록 및 삭제 버튼 */}
        <div className="action-buttons">
          <Link className="btn btn-success" to="/program/new">
            등록
          </Link>
          <button className="btn btn-danger" onClick={handleDelete}>
            삭제
          </button>
        </div>

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
  );
};

export default ProgramList;
