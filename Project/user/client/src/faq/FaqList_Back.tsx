import React, { useEffect, useState } from "react";
import "./css/FaqList.css";

// 게시글 객체 타입 정의
interface DummyVO {
  num: number;
  category: string;
  title: string;
  answer: string;
}

const FaqList: React.FC = () => {
  // 더미 데이터 정의 (인터페이스에 맞게 수정)      
  const dummyData: DummyVO[] = [
    {
      num: 1,
      title: "FAQ 게시판 이용 안내 ",
      answer: "FAQ 게시판 입니다. ",
      category: "전체",
    },
    {
      num: 2,
      title: "회원가입은 어떻게 하나요?",
      answer:
        "회원가입 방법은 로그인 > 회원가입 바로가기를 통해 회원가입에서 개인정보 제공, 본인 인증, 이용약관 동의 등의 절차를 거쳐 ID와 PASSWORD를 생성합니다.",
      category: "회원",
    },
    {
      num: 3,
      title: "회원가입에 연령 제한이 있나요?",
      answer: "회원가입은 만 14세 이상으로 제한됩니다.",
      category: "회원",
    },
    {
      num: 4,
      title: "내 회원정보는 어디서 찾을 수 있나요?",
      answer:
        "나의 정보는 로그인 후 마이페이지 > 회원정보 > 나의 정보에서 '회원 정보' 영역을 클릭시 로그인 후 가입 정보를 확인하실 수 있습니다.",
      category: "회원",
    },
    {
      num: 5,
      title: "회원 탈퇴를 하고 싶어요",
      answer:
        "회원이신분은 홈페이지 및 콜센터(1688-1111)를 통해서 탈회할 수 있습니다.",
      category: "회원",
    },
    {
      num: 6,
      title: "회원탈퇴 시 유의해야 하는 점이 무엇인가요?",
      answer:
        "회원에서 탈퇴하면 가입된 모든 서비스에서 일괄 탈퇴되며 일부 서비스를 이용하실 수 없습니다.",
      category: "회원",
    },
    {
      num: 7,
      title: "인증 E-mail을 받지 못했어요",
      answer:
        "보내드린 인증 E-mail이 수신함에 없다면, 스팸E-mail 함에 있는지 먼저 확인을 부탁드립니다. 받은 E-mail 함, 스팸E-mail 함에서도 인증 E-mail을 찾으실 수 없다면,아래 알려드리는 방법으로 인증 E-mail을 다시 받으실 수 있습니다.",
      category: "회원",
    },
    {
      num: 8,
      title: "민원 문의 상담 전화는 어떻게 하나요?",
      answer:
        "민원 문의는 1688-1111로 연락 주시면 친절하게 안내 해드리겠습니다.",
      category: "민원",
    },
    {
      num: 9,
      title: "민원 신청은 어디서 하나요?",
      answer: "민원 신청은 홈페이지 민원 신청란에서 하실 수 있습니다.",
      category: "민원",
    },
  ];

  // 상태 정의
  const [upboardList, setUpboardList] = useState<DummyVO[]>(dummyData);
  const [showAnswer, setShowAnswer] = useState<{ [key: number]: boolean }>({});
  const [activeTab, setActiveTab] = useState<string>("전체");
  const [searchType, setSearchType] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 5; // 한 페이지에 표시할 게시글 수

  // 답변 표시/숨기기
  const toggleAnswer = (num: number) => {
    setShowAnswer((prev) => ({
      ...prev,
      [num]: !prev[num],
    }));
  };

  // 카테고리 탭 클릭 처리
  const handleTabClick = (category: string) => {
    setActiveTab(category);
    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 리셋
  };

  // 검색 처리
  const handleSearch = () => {
    setCurrentPage(1); // 검색 시 첫 페이지로 리셋
    fetchUpboardList(1); // 첫 페이지 데이터 불러오기
  };

  // 게시글 목록 불러오기 (필터링, 검색, 페이지네이션 처리)
  const fetchUpboardList = (page: number) => {
    let filteredData = dummyData;

    // 검색 조건 처리
    if (searchQuery) {
      if (searchType === "1") {
        filteredData = filteredData.filter((item) =>
          item.title.includes(searchQuery)
        );
      } else if (searchType === "2") {
        filteredData = filteredData.filter((item) =>
          item.category.includes(searchQuery)
        );
      }
    }

    // 카테고리 필터링
    filteredData = filteredData.filter(
      (item) => activeTab === "전체" || item.category === activeTab
    );

    // 페이지네이션 처리
    const paginatedData = filteredData.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

    setUpboardList(paginatedData);

    // 페이지 숫자 계산
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return { totalItems, totalPages };
  };

  useEffect(() => {
    const { totalPages } = fetchUpboardList(currentPage); // 페이지 변경 시 데이터 갱신
    setTotalPages(totalPages); // 페이지 번호 상태 설정
  }, [currentPage, activeTab, searchQuery, searchType]);

  // 페이지 번호 상태
  const [totalPages, setTotalPages] = useState<number>(1);

  return (
    <div className="container mt-4 faqList">
      <h2 className="mb-4">FAQ 게시판</h2>

      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "전체" ? "active" : ""}`}
            href="#"
            onClick={() => handleTabClick("전체")}
          >
            전체
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "회원" ? "active" : ""}`}
            href="#"
            onClick={() => handleTabClick("회원")}
          >
            회원가입
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "민원" ? "active" : ""}`}
            href="#"
            onClick={() => handleTabClick("민원")}
          >
            민원처리
          </a>
        </li>
      </ul>

      {/* 게시글 목록 테이블 */}
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th className="text-center align-middle">번호</th>
            <th className="text-center align-middle">질문</th>
            <th className="text-center align-middle">작성자</th>
          </tr>
        </thead>
        <tbody>
          {upboardList.map((item) => (
            <React.Fragment key={item.num}>
              <tr>
                <td className="text-center align-middle">{item.num}</td>
                <td className="text-center align-middle">
                  <button
                    className="btn btn-link"
                    onClick={() => toggleAnswer(item.num)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-quora"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.73 12.476c-.554-1.091-1.204-2.193-2.473-2.193-.242 0-.484.04-.707.142l-.43-.863c.525-.45 1.373-.808 2.464-.808 1.697 0 2.568.818 3.26 1.86.41-.89.605-2.093.605-3.584 0-3.724-1.165-5.636-3.885-5.636-2.68 0-3.839 1.912-3.839 5.636 0 3.704 1.159 5.596 3.84 5.596.425 0 .811-.046 1.166-.15Zm.665 1.3a7 7 0 0 1-1.83.244C3.994 14.02.5 11.172.5 7.03.5 2.849 3.995 0 7.564 0c3.63 0 7.09 2.828 7.09 7.03 0 2.337-1.09 4.236-2.675 5.464.512.767 1.04 1.277 1.773 1.277.802 0 1.125-.62 1.179-1.105h1.043c.061.647-.262 3.334-3.178 3.334-1.767 0-2.7-1.024-3.4-2.224Z" />
                    </svg>
                    {item.title}
                  </button>
                </td>
                <td className="text-center align-middle">{item.category}</td>
              </tr>

              {/* 답변 표시 */}
              {showAnswer[item.num] && (
                <tr>
                  <td colSpan={5} className="text-left">
                    <div className="mt-2">
                      <p>{item.answer}</p>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 및 검색 */}
      <div className="d-flex justify-content-between">
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className="page-item">
              <a
                className="page-link"
                href="#"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              >
                이전
              </a>
            </li>

            {/* 페이지 번호 표시 */}
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index + 1}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <a
                  className="page-link"
                  href="#"
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </a>
              </li>
            ))}

            <li className="page-item">
              <a
                className="page-link"
                href="#"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
              >
                다음
              </a>
            </li>
          </ul>
        </nav>

        {/* 검색 필터와 입력창 */}
        <div className="d-flex">
          <select
            className="form-select w-auto me-2"
            onChange={(e) => setSearchType(e.target.value)}
            value={searchType}
          >
            <option value="1">질문 검색</option>
          </select>
          <input
            type="text"
            className="form-control w-auto"
            placeholder="검색어를 입력하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-primary ms-2" onClick={handleSearch}>
            검색
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaqList;
