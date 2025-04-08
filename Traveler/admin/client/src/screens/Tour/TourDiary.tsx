import axios from "axios";
import type React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import TourStatsCard from "../../components/Dashboard/TaskCard";

interface Diary {
  num: number;
  title: string;
  thumbnail: string;
  isshare: number;
  hit: number;
  heart: number;
  ddate: string;
  diaryemotion: string;
  membername: string;
  membernum: number;
}

interface member {
  num: number;
  name: string;
  email: string;
  mdate: string;
}

const TourDiary: React.FC = () => {
  const [allPosts, setAllPosts] = useState<Diary[]>([]); // 전체 게시글
  const [authors, setAuthors] = useState<{ [key: number]: string }>({}); // diary id를 키로 author name을 저장

  
  const [size, setSize] = useState(7); // 한 페이지 당 항목 수
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
  const [page, setPage] = useState(1);
  const pagePerBlock = 5; // 한 블럭에 표시할 페이지 수
  const [currentPage, setCurrentPage] = useState(1); // 기본 1값을 초기화
  const [check, setCheck] = useState(false); // 검색 버튼 동작 감지

  const[diarycount, setDiaryCount] = useState(0);
  const[diarysharecount, setShareDiaryCount] = useState(0);
  const[diarymycount, setMyDiaryCount] = useState(0);

useEffect(() => {
  // 페이지네이션을 위한 API 호출
  const DiaryList = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/api/diary/list`,
        { params: { page: currentPage, size: size } }
      );
      console.log(response.data);
      console.log(response.data.diaries);
      setAllPosts(response.data.diaries); // 전체 게시글
      setTotalPages(response.data.totalPages); // 전체 페이지 수
    } catch (error) {
      console.log("Error Message: " + error);
    }
  };

  const DiaryCount = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACK_END_URL}/api/diary/count`
        );
        console.log(response.data);
        setDiaryCount(response.data);
      } catch (error) {
        console.log("Error Message: " + error);
    }
  }

  const ShareDiaryCount = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/api/diary/sharecount`
      );
      console.log(response.data);
      setShareDiaryCount(response.data);
    } catch (error) {
      console.log("Error Message: " + error);
  }
}

const MyDiaryCount = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACK_END_URL}/api/diary/mycount`
    );
    console.log(response.data);
    setMyDiaryCount(response.data);
  } catch (error) {
    console.log("Error Message: " + error);
}
}

  DiaryList();
  DiaryCount();
  ShareDiaryCount();
  MyDiaryCount();
}, [currentPage, size]); // currentPage가 변경될 때마다 호출되도록 설정

  

  const getEmotionBadgeClass = (emotion: string) => {
    switch (emotion) {
      case "happy":
        return "bg-primary text-white";
      case "neutrality":
        return "bg-info text-dark";
      case "sad":
        return "bg-secondary text-white";
      case "upset":
        return "bg-danger text-white";
      case "embressed":
        return "bg-warning text-white";
      default:
        return "bg-secondary text-white";
    }
  };

  const emotionImages: { [key in "happy" | "neutrality" | "sad" | "upset" | "embressed"]: string } = {
    happy: "./imgs/emotion/happy.PNG",
    neutrality: "./imgs/emotion/soso.PNG",
    sad: "./imgs/emotion/sad.PNG",
    upset: "./imgs/emotion/angry.PNG",
    embressed: "./imgs/emotion/embressed.PNG",
  };

  // 삭제 핸들러 함수
  const onClickDelete = async (diaryNum: number) => {
    const confirmDelete = window.confirm("정말로 이 다이어리를 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        // 하나의 다이어리 삭제를 위해 URL에서 diaryNum을 전달
        await axios.delete(
          `${process.env.REACT_APP_BACK_END_URL}/api/diary/${diaryNum}`  // URL을 diaryNum을 포함해서 요청
        );
        setAllPosts(allPosts.filter((diary) => diary.num !== diaryNum)); // 삭제된 다이어리 목록에서 제거
        alert("다이어리가 삭제되었습니다.");
      } catch (error) {
        console.error("다이어리 삭제 중 오류:", error);
        alert("다이어리 삭제에 실패했습니다.");
      }
    }
  };
  

  return (
    <div className="container-fluid py-5">
      <h2 className="mb-4">여행 다이어리</h2>
      <div className="d-flex flex-wrap justify-content-between gap-3">
        <div className="col">
            <TourStatsCard label="다이어리 총 등록 수" value={diarycount} iconClass="bi bi-clipboard-data fs-4" />
        </div>
        <div className="col">
            <TourStatsCard label="공유 다이어리 등록 수" value={diarysharecount} iconClass="bi bi-clipboard-data fs-4" />
        </div>
        <div className="col">
            <TourStatsCard label="비밀 다이어리 등록 수" value={diarymycount} iconClass="bi bi-clipboard-data fs-4" />
        </div>
      </div>
      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="px-4" style={{ width: "80px" }}>
                    번호
                  </th>
                  <th className="px-4">제목</th>
                  <th className="px-4" style={{ width: "200px" }}>
                    썸네일
                  </th>
                  <th className="px-4" style={{ width: "200px" }}>
                    작성자
                  </th>
                  <th className="px-4" style={{ width: "150px" }}>
                    작성일
                  </th>
                  <th className="px-4" style={{ width: "80px" }}>
                    공유여부
                  </th>
                  <th className="px-4" style={{ width: "100px" }}>
                    대표감정
                  </th>
                  <th className="px-4" style={{ width: "80px" }}>
                    삭제
                  </th>
                </tr>
              </thead>
              <tbody>
              {allPosts && allPosts.length > 0 ? (
                allPosts.map((diary) => (
                  <tr key={diary.num}>
                    <td className="px-4">{diary.num}</td>
                    <td className="px-4 text-orange title-hover">
                      <Link to={`detail/${diary.num}`}>{diary.title}</Link>
                    </td>
                    <td className="px-4">
                      <div className="d-flex align-items-center">
                        <img className="thumbnail" 
                        src={`.${diary.thumbnail}`}
                        alt="thumbnail" 
                        style={{width: "50px", height: "50px"}}
                        />
                      </div>
                    </td>
                    <td className="px-4">{diary.membername}</td>
                    <td className="px-4">{diary.ddate.slice(0, 10)}</td>
                    <td className="px-4">{diary.isshare ? "공유" : "비밀"}</td>
                    <td className="px-4">
                      <div className="d-flex align-items-center">
                        <img
                          style={{ marginRight: "10px" }}
                          src={emotionImages[diary.diaryemotion as keyof typeof emotionImages] || "./imgs/emotion/soso.PNG"}
                          alt={diary.diaryemotion}
                          width="24"
                          height="24"
                        />
                        <span className={`badge ${getEmotionBadgeClass(diary.diaryemotion)} rounded-pill`}>
                          {diary.diaryemotion}
                        </span>
                      </div>
                    </td>
                    <td className="px-4">
                      <button
                        className="btn btn-link text-danger p-0"
                        title="삭제"
                        onClick={() => onClickDelete(diary.num)}
                      >
                        <i className="icofont-ui-delete text-danger"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                  <tr>
                    <td colSpan={7} className="text-center">등록된 다이어리가 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer bg-white border-0">


          {/* Pagination */}
          <div className="pagination-container">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(currentPage - 1)} 
              className="btn btn-secondary"
            >
              이전
            </button>

            {/* 페이지 번호 버튼들 */}
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`btn btn-light ${currentPage === index + 1 ? "active" : ""}`}
              >
                {index + 1}
              </button>
            ))}

            <button 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(currentPage + 1)} 
              className="btn btn-secondary"
            >
              다음
            </button>
          </div>



        </div>
      </div>
    </div>
  );
};

export default TourDiary;
