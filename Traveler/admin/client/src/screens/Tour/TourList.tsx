import React, { useEffect, useState } from "react";
import { Form, Modal, Tab } from "react-bootstrap";
import PageHeader from "../../components/common/PageHeader";
import TourCard from "../../components/Clients/TourCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Tour {
  num: number;
  name: string;
  rating?: number;
  participants?: number;
  days?: number;
  theme?: string;
  thumbnail?: string;
  location:string;
  images?: { img_name: string }[];
}

const TourList: React.FC = () => {
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [tourList, setTourList] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [searchTerm, setSearchTerm] = useState("");  // 검색어 상태 추가
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [block,setBlock] = useState(0);
  const navigate = useNavigate();
  const pageSize = 5; // 한 블록당 표시할 페이지 수

const startPage = block * pageSize;
const endPage = Math.min(startPage + pageSize, totalPages); // 최대 totalPages까지



const getImageUrl = (tour: Tour): string => {
  if (tour.thumbnail) {
    return `${process.env.REACT_APP_FILES_URL}/img/tour/${tour.thumbnail}`;
  }
  if (tour.images?.length) {
    return `${process.env.REACT_APP_FILES_URL}/img/tour/${tour.images[0].img_name}`;
  }
  return "/imgs/default-image.jpg";
};
  useEffect(() => {
    if (searchTerm) {
      const filtered = tourList.filter((tour) =>
        tour.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTours(filtered);
    } else {
      setFilteredTours(tourList);
    }
  }, [searchTerm, tourList]);


  const fetchTours = async (pageNum = 0, keyword = searchTerm) => {
    try {
      const url = keyword
        ? `${process.env.REACT_APP_BACK_END_URL}/api/tours?page=${pageNum}&keyword=${encodeURIComponent(keyword)}`
        : `${process.env.REACT_APP_BACK_END_URL}/api/tours?page=${pageNum}`;

      console.log("🔥 투어 데이터 요청:", url); // 🔍 요청 URL 로그 확인

      const response = await axios.get(url);
      console.log("🔥 투어 데이터 확인:", response.data);

      setTourList(Array.isArray(response.data.content) ? response.data.content : []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("❌ 투어 데이터를 불러오는 중 오류 발생:", error);
      setTourList([]);
    }
  };

  useEffect(() => {
    fetchTours(page);
  }, [page]);

  const handleSearch = () => {
    setPage(0); // 검색 시 첫 페이지로 이동
    fetchTours(0, searchTerm); // 검색 실행
  };

  // useEffect(() => {
  //   fetchTours(0);
  //   setPage(0); // 검색 시 첫 페이지로 이동
  // }, [searchTerm]);

  const handleDeleteClick = (tour: Tour) => {
    setSelectedTour(tour);
    setDeleteModal(true);
  };

  const deleteTour = async () => {
    if (!selectedTour?.num) return;

    try {
      await axios.delete(`${process.env.REACT_APP_BACK_END_URL}/api/tours/${selectedTour.num}`);
      console.log(`✅ 투어 ${selectedTour.num} 삭제 완료`);
      setDeleteModal(false);
      fetchTours();
    } catch (error) {
      console.error("❌ 투어 삭제 중 오류 발생:", error);
    }
  };

  return (
    <div className="container-xxl">
    <Tab.Container defaultActiveKey="All">
      {/* 🔹 헤더 부분 수정 (검색창 & 업로드 버튼 배치) */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <PageHeader headerTitle="투어 목록" />
        <div className="d-flex align-items-center">
          {/* 🔍 검색 입력 필드 추가 (업로드 버튼 옆) */}
          <Form.Control
            type="text"
            placeholder="지역 또는 제목 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="me-2"
            style={{ width: "250px" }} // 검색창 크기 조절
          />
          <button className="btn btn-primary me-2" onClick={handleSearch}>
              검색
            </button>
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => navigate(`${process.env.REACT_APP_BASE_URL}/tourlist/tour-upload`)}
          >
            <i className="icofont-plus-circle me-2 fs-6"></i> 투어 업로드
          </button>
        </div>
      </div>
         
        <Modal show={isDeleteModal} centered onHide={() => setDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">투어 삭제</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <i className="icofont-ui-delete text-danger display-2 text-center mt-2"></i>
            <p className="mt-4 fs-5 text-center">정말 삭제하시겠습니까?</p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-secondary" onClick={() => setDeleteModal(false)}>취소</button>
            <button className="btn btn-danger" onClick={deleteTour}>삭제</button>
          </Modal.Footer>
        </Modal>
        <div className="row g-4">
          {tourList.map((tour) => (
            <div key={tour.num} className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6">
              <TourCard
                teamImage={getImageUrl(tour)}
                title={tour.name}  // ← 이 부분 확인
                rating={tour.rating ?? 0}
                location={tour.location}
                duration={`${tour.days ?? 1}일`}
                theme={tour.theme ?? "기본 테마"}
                id={tour.num}
                onClickEdit={() => navigate(`${process.env.REACT_APP_BASE_URL}/tourlist/edit/${tour.num}`)}
                onClickDelete={() => handleDeleteClick(tour)}
              />
            </div>
          ))}
        </div>
                {/* 🔹 숫자 페이지네이션 수정 (남색 스타일 적용) */}
                <div className="pagination mt-4 d-flex justify-content-center">
          {/* 🔹 이전 블록 버튼 (첫 블록이 아닐 때만 표시) */}
          {block > 0 && (
            <button
              className="btn btn-outline-primary mx-2"
              onClick={() => setBlock(block - 1)}
              style={{ borderColor: "#2c3e50", color: "#2c3e50" }}
            >
              {"<"}
            </button>
          )}

          {/* 🔹 페이지 숫자 버튼 */}
          {[...Array(endPage - startPage)].map((_, index) => {
            const pageIndex = startPage + index;
            return (
              <button
                key={pageIndex}
                className={`btn mx-1 ${pageIndex === page ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setPage(pageIndex)}
                style={{
                  backgroundColor: pageIndex === page ? "#484c7f" : "transparent",
                  borderColor: "#484c7f",
                  color: pageIndex === page ? "#ffffff" : "#484c7f",
                }}
              >
                {pageIndex + 1}
              </button>
            );
          })}

          {/* 🔹 다음 블록 버튼 (마지막 블록이 아닐 때만 표시) */}
          {endPage < totalPages && (
            <button
              className="btn btn-outline-primary mx-2"
              onClick={() => setBlock(block + 1)}
              style={{ borderColor: "#2c3e50", color: "#2c3e50" }}
            >
              {">"}
            </button>
          )}
        </div>
      </Tab.Container>
    </div>
  );
};

export default TourList;
