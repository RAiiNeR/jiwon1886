import React, { useEffect, useState } from "react";
import "./css/FaqList.css";
import axios from "axios";

interface Faq {
  num: number;
  category: string;
  title: string;
  answer: string;
}

// const dummyData: DummyVO[] = [
//   {
//     num: 1,
//     title: "FAQ 게시판 이용 안내 ",
//     answer: "FAQ 게시판 입니다. ",
//     category: "전체",
//   },
//   {
//     num: 2,
//     title: "회원가입은 어떻게 하나요?",
//     answer:
//       "회원가입 방법은 로그인 > 회원가입 바로가기를 통해 회원가입에서 개인정보 제공, 본인 인증, 이용약관 동의 등의 절차를 거쳐 ID와 PASSWORD를 생성합니다.",
//     category: "회원",
//   },
//   {
//     num: 3,
//     title: "회원가입에 연령 제한이 있나요?",
//     answer: "회원가입은 만 14세 이상으로 제한됩니다.",
//     category: "회원",
//   },
//   {
//     num: 4,
//     title: "내 회원정보는 어디서 찾을 수 있나요?",
//     answer:
//       "나의 정보는 로그인 후 마이페이지 > 회원정보 > 나의 정보에서 '회원 정보' 영역을 클릭시 로그인 후 가입 정보를 확인하실 수 있습니다.",
//     category: "회원",
//   },
//   {
//     num: 5,
//     title: "회원 탈퇴를 하고 싶어요",
//     answer:
//       "회원이신분은 홈페이지 및 콜센터(1688-1111)를 통해서 탈회할 수 있습니다.",
//     category: "회원",
//   },
//   {
//     num: 6,
//     title: "회원탈퇴 시 유의해야 하는 점이 무엇인가요?",
//     answer:
//       "회원에서 탈퇴하면 가입된 모든 서비스에서 일괄 탈퇴되며 일부 서비스를 이용하실 수 없습니다.",
//     category: "회원",
//   },
//   {
//     num: 7,
//     title: "인증 E-mail을 받지 못했어요",
//     answer:
//       "보내드린 인증 E-mail이 수신함에 없다면, 스팸E-mail 함에 있는지 먼저 확인을 부탁드립니다. 받은 E-mail 함, 스팸E-mail 함에서도 인증 E-mail을 찾으실 수 없다면,아래 알려드리는 방법으로 인증 E-mail을 다시 받으실 수 있습니다.",
//     category: "회원",
//   },
//   {
//     num: 8,
//     title: "민원 문의 상담 전화는 어떻게 하나요?",
//     answer:
//       "민원 문의는 1688-1111로 연락 주시면 친절하게 안내 해드리겠습니다.",
//     category: "민원",
//   },
//   {
//     num: 9,
//     title: "민원 신청은 어디서 하나요?",
//     answer: "민원 신청은 홈페이지 민원 신청란에서 하실 수 있습니다.",
//     category: "민원",
//   },
// ];

const FaqList: React.FC = () => {
  const [faqList, setFaqList] = useState<Faq[]>([]);
  const [showAnswer, setShowAnswer] = useState<{ [key: number]: boolean }>({});
  const [activeTab, setActiveTab] = useState<string>("전체");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const itemsPerPage = 10;
  const pagePerBlock = 5;

  const toggleAnswer = (num: number) => {
    setShowAnswer((prev) => ({
      ...prev,
      [num]: !prev[num],
    }));
  };

  const handleTabClick = (category: string) => {
    setActiveTab(category);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const fetchFaqList = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/api/faq`,
        {
          params: {
            title: searchQuery || null,
            category: activeTab === "전체" ? null : activeTab,
            page: currentPage,
            size: itemsPerPage,
          },
        }
      );

      const { content, total_pages } = response.data;
      setFaqList(content);
      setTotalPages(total_pages);
    } catch (error) {
      console.error("데이터를 불러오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchFaqList();
  }, [currentPage, activeTab, searchQuery]);

  useEffect(()=>{
    const startPage = Math.floor((currentPage - 1) / pagePerBlock) * pagePerBlock + 1;
    const endPage = Math.min(startPage + pagePerBlock - 1, totalPages);
    console.log(startPage,endPage)
    setStartPage(startPage);
    setEndPage(endPage);
  },[faqList])

  return (
    <div className="faq">
      <h2 className="faq-title">FAQ 게시판</h2>

      <ul className="faq-tabs">
        {["전체", "회원", "민원"].map((category) => (
          <li
            key={category}
            className={`faq-tab ${activeTab === category ? "active" : ""}`}
            onClick={() => handleTabClick(category)}
          >
            {category}
          </li>
        ))}
      </ul>

      <div className="faq-search">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          className="faq-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="faq-search-button" onClick={handleSearch}>
          검색
        </button>
      </div>

      <table className="faq-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>질문</th>
            <th>작성자</th>
          </tr>
        </thead>
        <tbody>
          {faqList.map((item) => (
            <React.Fragment key={item.num}>
              <tr>
                <td>{item.num}</td>
                <td>
                  <button
                    className="faq-question"
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
                <td>{item.category}</td>
              </tr>
              {showAnswer[item.num] && (
                <tr className="faq-answer-row">
                  <td colSpan={3} className="faq-answer">
                    {item.answer}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-center mt-4">
        <nav aria-label="page navigation example">
          <ul className="pagination">
            {startPage > 1 && (
              <li className="page-item">
                <a
                  className="page-link"
                  href="#"
                  onClick={() => setCurrentPage(startPage - 1)}
                >
                  이전
                </a>
              </li>
            )}

            {
              Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index).map((page) => (
                <li
                  key={page}
                  className={`page-item ${currentPage === page ? "active" : ""}`}
                >
                  <a
                    className="page-link"
                    href="#"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </a>
                </li>
              ))}

            {endPage < totalPages && (
              <li className="page-item">
                <a
                  className="page-link"
                  href="#"
                  onClick={() => setCurrentPage(endPage + 1)}
                >
                  다음
                </a>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default FaqList;