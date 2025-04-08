import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/FaqList.css";
import axios from "axios";
import RequireAuth from "../comp/RequireAuth";
import PageNation from "../comp/PageNation";

export interface FaqVO {
  num: number;
  title: string;
  category: string;
  answer: string;
}

const FaqList: React.FC = () => {
  const [faqlist, setFaqList] = useState<FaqVO[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFaqs, setSelectedFaqs] = useState<Set<number>>(new Set());

  //페이징
  const [page, setPage] = useState(1);
  const [size, setSize] = useState("10");
  const [totalPages, setTotalPages] = useState(0)


  // FAQ 데이터를 서버에서 받아오는 함수
  const fetchFaqList = async (page: number, search: string) => {
    try {
      const response = await axios.get('http://localhost:82/noorigun/api/faq', {
        params: {
          page: page,
          size: size,
          searchValue: search
        }
      });
      setFaqList(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching FAQ list:", error);
    }
  };

  // 검색 기능
  const handleSearch = () => {
    fetchFaqList(1, searchQuery);
    setPage(1);
  };

  // 선택된 FAQ 삭제
  const handleDeleteSelected = async () => {
    if(window.confirm("정말로 삭제하시겠습니까?")){
    try {
      // 선택된 항목들 삭제 요청
      for (const itemNum of selectedFaqs) {
        await axios.delete(`http://localhost:82/noorigun/api/faq?num=${itemNum}`);
      }
      // 선택된 항목들을 목록에서 제거
      fetchFaqList(page, searchQuery);
      setSelectedFaqs(new Set());
    } catch (error) {
      console.error('Error while deleting items:', error);
    }
  };
};
    // 체크박스를 통해 FAQ 선택
    const handleSelect = (num: number) => {
      const newSelectedFaqs = new Set(selectedFaqs);
      if (newSelectedFaqs.has(num)) {
        newSelectedFaqs.delete(num);
      } else {
        newSelectedFaqs.add(num);
      }
      setSelectedFaqs(newSelectedFaqs);
    };



    useEffect(() => {
      fetchFaqList(page, searchQuery); // 컴포넌트 마운트 시 FAQ 리스트를 가져옵니다.
    }, [page]);


    return (
      <RequireAuth>
        <div style={{ padding: '50px' }}>
          <div className="Faqbox">
            <h2 className="mb-4">FAQ 게시판</h2>

            {/* 삭제 버튼 */}
            <button
              className="btn btn-danger my-3"
              onClick={handleDeleteSelected}
              disabled={selectedFaqs.size === 0}
            >
              선택된 FAQ 삭제
            </button>

            {/* 게시글 목록 테이블 */}
            <table className="faqlist">
              <thead>
                <tr>
                  <th className="text-center align-middle">
                    <input
                      type="checkbox"
                      onChange={() => {
                        if (selectedFaqs.size === faqlist.length) {
                          setSelectedFaqs(new Set());
                        } else {
                          setSelectedFaqs(new Set(faqlist.map((faq) => faq.num)));
                        }
                      }}
                      checked={selectedFaqs.size === faqlist.length}
                    />
                  </th>
                  <th className="text-center align-middle">번호</th>
                  <th className="text-center align-middle">질문</th>
                  <th className="text-center align-middle">분류</th>
                  <th className="text-center align-middle">답변</th>
                </tr>
              </thead>
              <tbody>
                {faqlist.map((item) => (
                  <tr key={item.num}>
                    <td className="text-center align-middle">
                      <input
                        type="checkbox"
                        checked={selectedFaqs.has(item.num)}
                        onChange={() => handleSelect(item.num)}
                      />
                    </td>
                    <td className="text-center align-middle">{item.num}</td>
                    <td className="text-center align-middle">
                      <button
                        className="btn btn-link"
                      // onClick={() => usenavigate(`/faq/${item.num}`)} // 상세 페이지로 이동
                      >
                        {item.title}
                      </button>
                    </td>
                    <td className="text-center align-middle">{item.category}</td>
                    <td className="text-center align-middle">{item.answer}</td>
                  </tr>

                ))}
              </tbody>
              {/* 검색 필터 */}
              <tfoot>
                <tr>
                  <td colSpan={4}>
                    <div className="faqsearch">
                      <input
                        type="text"
                        className="form-control w-auto"
                        placeholder="검색어를 입력하세요"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button onClick={handleSearch}
                        className="btn btn-primary">
                        검색
                      </button>
                    </div>
                  </td>
                  <td>
                    <button className="btn btn-primary">
                      <Link to={'/faq/new'}>글쓰기</Link>
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
            <PageNation page={page} totalPages={totalPages} pageChange={setPage} />
          </div>
        </div>
      </RequireAuth>
    );
  };

  export default FaqList;