import React, { useEffect, useState } from "react";
import "./css/Bookshelf.css"; // CSS import
import { Link } from "react-router-dom";
import axios from "axios";
import Pagenation from "../../Comm/Pagenation";

interface Diary {
  num: number;
  title: string;
  thumbnail: string;
  isshare: number;
  hit: number;
  heart: number;
  ddate: string;
  diaryPage: {
    num: number;
    page: number;
    ptitle: string;
    content: string;
    location: string;
    happy: number;
    upset: number;
    embressed: number;
    sad: number;
    neutrality: number;
  };
}

const Bookshelf: React.FC = () => {
  const [hoveredBook, setHoveredBook] = useState<number | null>(null);
  const [allPosts, setAllPosts] = useState<Diary[]>([]); // 전체 게시글
  const [currentPage, setCurrentPage] = useState(1); // 기본 1값을 초기화
  const [check, setCheck] = useState(false); // 검색 버튼 동작 감지

  const [size, setSize] = useState(9); // 한 페이지 당 항목 수
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
  const [startPage, setStartPage] = useState(1);
  const [page, setPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const pagePerBlock = 5; // 한 블럭에 표시할 페이지 수

  const DiaryList = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/api/diary/allshare`,
        { params: { page, size } }
      );
      console.log(response.data);
      setAllPosts(response.data.content || []); // 빈 배열로 기본값 설정
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.log("Error Message: " + error);
    }
  };

  useEffect(() => {
    DiaryList();
  }, [currentPage, check, page]);

  // 페이지 블록 계산
  useEffect(() => {
    setStartPage((Math.floor((page - 1) / pagePerBlock) * pagePerBlock) + 1);
    let end = (Math.floor((page - 1) / pagePerBlock) + 1) * pagePerBlock;
    end = end > totalPages ? totalPages : end;
    setEndPage(end);
  }, [page, totalPages]);

  // 페이지 변경
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 3개씩 배열을 나누는 함수
  const chunkArray = (array: Diary[], size: number) => {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, i * size + size)
    );
  };

  // 다이어리가 비어 있지 않은 경우에만 chunkArray 호출
  const diaryChunks = allPosts && allPosts.length > 0 ? chunkArray(allPosts, 3) : [];

  const renderShelf = (shelfBooks: Diary[]) => (
    <div className="shelf">
      <div className="shelfGrid">
        {shelfBooks.map((diary) => (
          <div
            key={diary.num}
            className={`shelfItem ${hoveredBook === diary.num ? "hoverEffect" : ""}`}
            onMouseEnter={() => setHoveredBook(diary.num)}
            onMouseLeave={() => setHoveredBook(null)}
          >
            <Link to={`${diary.num}`} >
              <div className="bookCover">
                <img
                  src={`.${diary.thumbnail}`}
                  alt={diary.title}
                  className="shelfImage"
                  style={{
                    boxShadow: "5px 5px 25px rgba(0, 0, 0, 0.5)"
                  }}
                />
                {/* 타이틀 표시 부분 */}
                {hoveredBook === diary.num && (
                  <div className="bookTitle">{diary.title}</div>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="woodenShelf"></div>
    </div>
  );

  return (
    <div className="bookshelf" style={{ paddingTop: "170px" }}>
      <div className="titlebox" style={{ paddingTop: "90px" }}>
        <h2>공유 다이어리</h2>
      </div>
      <div className="shelfContainer">
        {diaryChunks.map((chunk, index) => (
          <React.Fragment key={index}>{renderShelf(chunk)}</React.Fragment>
        ))}
        {/* 페이징 */}
        {totalPages > 0 && (
          <Pagenation
            page={page}
            totalPages={totalPages}
            pageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Bookshelf;
