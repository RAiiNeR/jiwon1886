import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/AdminCompleBoard.css";
import RequireAuth from "../comp/RequireAuth";
import PageNation from "../comp/PageNation";
//민원 게시판 구조
interface CompleBoardVO {
  num: number;
  title: string;
  writer: string;
  state: string;
  deptno: number;
}

const CompleBoardList: React.FC = () => {
  const [compleBoardList, setCompleBoardList] = useState<CompleBoardVO[]>([]);
  const [searchType, setSearchType] = useState<string>("title");//제목으로 검색
  const [searchValue, setSearchValue] = useState<string>(""); // 검색어
  const [selectedDept, setSelectedDept] = useState<string>(""); // 부서 선택 값
  const [selectedState, setSelectedState] = useState<string>(""); // 상태 선택 값
  const [currentPage, setCurrentPage] = useState<number>(1);//현재 페이지 수 관리
  const [totalPages, setTotalPages] = useState<number>(1);//전체 페이지 수 관리

  const navigate = useNavigate();

  // 부서 및 상태 옵션
  const deptMap: { [key: number]: string } = {
    1: "군수",
    10: "본부",
    11: "감사담당관",
    12: "기획예산담당관",
    20: "문화 복지국",
    21: "홍보담당관",
    22: "안전복지정책관",
    23: "민원토지관",
    30: "경제국",
    31: "일자리경제관",
    32: "정원산림관",
  };

  const stateOptions = ["접수중", "담당부서 지정", "처리 중", "완료"];
  //서버에서 리스트에 넣을 데이터 가져오기
  const fetchList = async () => {
    try {
      const params: any = {
        searchType,
        currentPage,
        pageSize: 10,
      };
      //검색 조건 설정
      if (searchType === "deptno") {
        params.searchValue = selectedDept;
      } else if (searchType === "state") {
        params.searchValue = selectedState;
      } else {
        params.searchValue = searchValue;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/api/comple`,
        { params }
      );
      //서버 데이터를 상태변수에 저장
      setCompleBoardList(response.data.boardList);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("게시글 목록 불러오기 중 오류:", error);
      alert("게시글 목록을 불러오는 데 실패했습니다.");
    }
  };
  //컴포넌트 마운트 및 페이지 변경 시 리스트 새로고침
  useEffect(() => {
    fetchList();
  }, [currentPage]);

  //검색 버튼 클릭시 핸들러
  const handleSearch = () => {
    setCurrentPage(1); // 검색 시 페이지 초기화
    fetchList();
  };
  //enter 키 사용 시 검색
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <RequireAuth>
      <div style={{ padding: '50px' }}>
        <div className="admin-complelist">
          <h1>민원 관리</h1>

          {/* 검색 폼 */}
          <div className="admin-complelist-search-container">
            <div className="admin-complelist-search-type-wrapper">
              {/* 검색 조건 선택 */}
              <select
                className="admin-complelist-search-type"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="title">제목</option>
                <option value="writer">작성자</option>
                <option value="state">상태</option>
                <option value="deptno">부서</option>
              </select>

              {/* 상태 드롭다운 */}
              {searchType === "state" && (
                <select
                  className="admin-complelist-state-dropdown"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <option value="">상태를 선택하세요</option>
                  {stateOptions.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              )}

              {/* 부서 드롭다운 */}
              {searchType === "deptno" && (
                <select
                  className="admin-complelist-dept-dropdown"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                >
                  <option value="">부서를 선택하세요</option>
                  {Object.entries(deptMap).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* 검색어 입력창 */}
            <input
              className="admin-complelist-search-input"
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="검색어를 입력하세요"
              onKeyPress={handleKeyPress}
              disabled={searchType === "deptno" || searchType === "state"} // 상태와 부서 선택 시 비활성화
            />

            {/* 검색 버튼 */}
            <button
              className="admin-complelist-search-button"
              onClick={handleSearch}
            >
              검색
            </button>
          </div>

          {/* 게시글 목록 */}
          <table>
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>상태</th>
                <th>부서</th>
              </tr>
            </thead>
            <tbody>
              {compleBoardList.map((item) => (
                <tr key={item.num}>
                  <td>{item.num}</td>
                  <td>
                    <button
                      onClick={() => navigate(`/noorigun/comple/${item.num}`)} // 상세보기 이동
                      className="admin-complelist-title-button"
                    >
                      {item.title}
                    </button>
                  </td>
                  <td>{item.writer}</td>
                  <td>{item.state}</td>
                  <td>{deptMap[item.deptno] || "부서 없음"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 페이지 네비게이션 */}
          <PageNation page={currentPage} totalPages={totalPages} pageChange={setCurrentPage}/>
        </div>
      </div>
    </RequireAuth>
  );
};

export default CompleBoardList;
