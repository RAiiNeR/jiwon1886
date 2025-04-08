import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import PageHeader from "../../components/common/PageHeader";

interface HotelType {
    num: number;
    name: string;
    price: number;
    rating: number;
    content: string;
    location: string;
    thumbnail: string;
    hit: number;
    hdate: string;
    img_names: string[];
}

const Hotel: React.FC = () => {
    const [hotels, setHotels] = useState<HotelType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalHeader, setModalHeader] = useState("");
    const [editHotelData, setEditHotelData] = useState<HotelType | null>(null);
    const [hotelToDelete, setHotelToDelete] = useState<HotelType | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [block, setBlock] = useState(0);
    const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태 추가
    const pageSize = 5;
    const startPage = block * pageSize;
    const endPage = Math.min(startPage + pageSize, totalPages);

    useEffect(() => {
        getHotelList(page); // 페이지가 변경되면 호텔 목록을 다시 불러옴
    }, [page]);

    const getHotelList = async (page: number) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/hotels`, {
                params: { page, size: pageSize, name: searchQuery }, // 검색어를 전달
            });

            setHotels(response.data.content || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error("Error fetching hotels:", error);
        }
    };

    const handleSearch = () => {
        setPage(0); // 검색시 페이지를 0으로 초기화
        getHotelList(0); // 검색 버튼을 클릭했을 때 리스트를 갱신
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch(); // 엔터 키를 누르면 검색
        }
    };

    const handleEditHotel = (hotel: HotelType) => {
        setIsModalOpen(true);
        setModalHeader("Edit Hotel");
        setEditHotelData(hotel);
    };

    const handleSaveHotel = async () => {
        if (editHotelData) {
            try {
                await axios.put(`${process.env.REACT_APP_BACK_END_URL}/api/hotels/${editHotelData.num}`, editHotelData);
                setHotels(hotels.map(hotel => hotel.num === editHotelData.num ? editHotelData : hotel));
                setIsModalOpen(false);
                setEditHotelData(null);
            } catch (error) {
                console.error("Error saving hotel data:", error);
            }
        }
    };

    const handleDeleteHotel = (hotel: HotelType) => {
        setHotelToDelete(hotel);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (hotelToDelete) {
            try {
                await axios.delete(`${process.env.REACT_APP_BACK_END_URL}/api/hotels/${hotelToDelete.num}`);
                setHotels(hotels.filter(hotel => hotel.num !== hotelToDelete.num));
                setShowDeleteConfirm(false);
            } catch (error) {
                console.error("Error deleting hotel:", error);
            }
        }
    };

    return (
        <div className="container-xxl">
            <PageHeader headerTitle="Hotel List" />

            {/* 검색창 추가 */}
            <div className="mb-3 d-flex">
                <input
                    type="text"
                    className="form-control"
                    placeholder="호텔 이름으로 검색"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // 검색어 입력만 처리
                    onKeyDown={handleSearchKeyDown} // 엔터로 검색
                />
                <Button variant="primary" className="ms-2" onClick={handleSearch}>
                    검색
                </Button>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>이름</th>
                        <th>주소</th>
                        <th>평점</th>
                        <th>호텔 소개</th>
                        <th>등록일</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {hotels.map((hotel) => (
                        <tr key={hotel.num}>
                            <td>{hotel.num}</td>
                            <td>
                                <Link to={`${process.env.REACT_APP_BASE_URL}/hotel/${hotel.num}`}>
                                    {hotel.name}
                                </Link>
                            </td>
                            <td>{hotel.location}</td>
                            <td>{hotel.rating}</td>
                            <td>{hotel.content}</td>
                            <td>{hotel.hdate}</td>
                            <td>
                                <Button variant="primary" className="me-2" onClick={() => handleEditHotel(hotel)}>
                                    수정
                                </Button>
                                <Button variant="danger" onClick={() => handleDeleteHotel(hotel)}>
                                    삭제
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 수정 모달 */}
            <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalHeader}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="호텔 이름"
                        value={editHotelData?.name || ""}
                        onChange={(e) => setEditHotelData({ ...editHotelData, name: e.target.value } as HotelType)}
                    />
                    <input
                        type="text"
                        className="form-control"
                        placeholder="호텔 주소"
                        value={editHotelData?.location || ""}
                        onChange={(e) => setEditHotelData({ ...editHotelData, location: e.target.value } as HotelType)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>닫기</Button>
                    <Button variant="primary" onClick={handleSaveHotel}>저장</Button>
                </Modal.Footer>
            </Modal>

            {/* 삭제 확인 모달 */}
            <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>삭제 확인</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {hotelToDelete && (
                        <p>정말로 "{hotelToDelete.name}" 호텔을 삭제하시겠습니까?</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>취소</Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>삭제</Button>
                </Modal.Footer>
            </Modal>

            {/* 페이지네이션 */}
            <div className="pagination mt-4 d-flex justify-content-center">
                {/* 이전 블록 버튼 */}
                {block > 0 && (
                    <button
                        className="btn btn-outline-primary mx-2"
                        onClick={() => setBlock(block - 1)}
                        style={{ borderColor: "#2c3e50", color: "#2c3e50" }}
                    >
                        {"<"}
                    </button>
                )}

                {/* 페이지 숫자 버튼 */}
                {[...Array(Math.max(endPage - startPage, 0))].map((_, index) => {
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

                {/* 다음 블록 버튼 */}
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
        </div>
    );
};

export default Hotel;
