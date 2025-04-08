import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface ReservationData {
  num: number;
  checkindate: string | null;
  checkoutdate: string | null;
  memberemail: string;
  numguests: number;
  status: string;
  totalprice: number | null;
  membernum: number;
  roomnum: number | null;
  roomname?: string;
  hotelname?: string;
  membername?: string;
}

const HotelReservation: React.FC = () => {
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [selectedReservations, setSelectedReservations] = useState<number[]>([]);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [block, setBlock] = useState(0);
  const pageSize = 5; // 한 블록당 표시할 페이지 수

  const startPage = block * pageSize;
  const endPage = Math.min(startPage + pageSize, totalPages); // 최대 totalPages까지

  // 디버깅: startPage와 endPage 출력
  console.log("startPage:", startPage);
  console.log("endPage:", endPage);
  console.log("totalPages:", totalPages);

  // 예약 목록 가져오기
  const getHotelReservationList = async (page: number) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/reservations/list`, {
        params: { page, size: pageSize },
      });
      console.log("예약 데이터:", response.data);

      setReservations(response.data.content); // content 배열만 저장
      // totalPages를 응답에서 total_pages로 수정
      setTotalPages(response.data.total_pages); // 전체 페이지 수 업데이트
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  useEffect(() => {
    getHotelReservationList(page);
  }, [page]);

  // 체크박스 선택 처리
  const handleCheckboxChange = (num: number) => {
    setSelectedReservations((prevSelected) =>
      prevSelected.includes(num)
        ? prevSelected.filter((id) => id !== num)
        : [...prevSelected, num]
    );
  };

  // 여러 예약 삭제 처리
  const handleDeleteSelected = async () => {
    setLoading(true);
    try {
      for (let num of selectedReservations) {
        await axios.delete(`${process.env.REACT_APP_BACK_END_URL}/api/reservations/${num}`);
      }
      // 삭제 후, 남아있는 예약만 설정
      setReservations((prevReservations) =>
        prevReservations.filter((reservation) => !selectedReservations.includes(reservation.num))
      );
      setSelectedReservations([]); // 선택된 예약 초기화
      setDeleteMessage("선택된 예약들이 성공적으로 삭제되었습니다.");
      setTimeout(() => setDeleteMessage(null), 3000);
    } catch (error) {
      console.error("Error deleting selected reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-xxl">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              {deleteMessage && <div className="alert alert-success">{deleteMessage}</div>}

              <div className="mb-3">
                {/* 삭제 버튼 */}
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteSelected}
                  disabled={loading || selectedReservations.length === 0}
                >
                  {loading ? "삭제 중..." : "선택된 예약 취소"}
                </button>
              </div>

              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>선택</th>
                    <th>회원 번호</th>
                    <th>예약자</th>
                    <th>예약자 이메일</th>
                    <th>호텔명</th>
                    <th>객실명</th>
                    <th>예약 날짜</th>
                    <th>인원수</th>
                    <th>금액</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => {
                    const checkinDate = reservation.checkindate
                      ? new Date(reservation.checkindate)
                      : null;
                    const checkoutDate = reservation.checkoutdate
                      ? new Date(reservation.checkoutdate)
                      : null;

                    return (
                      <tr key={reservation.num}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedReservations.includes(reservation.num)}
                            onChange={() => handleCheckboxChange(reservation.num)}
                          />
                        </td>
                        <td>{reservation.num}</td> {/* 예약 번호 표시 */}
                        <td>
                          <Link to={`${process.env.REACT_APP_BASE_URL}/HotelReservationDetail/${reservation.num}`}>
                            {reservation.membername || "이름 없음"}
                          </Link>
                        </td>
                        <td>{reservation.memberemail}</td>
                        <td>{reservation.hotelname || "N/A"}</td>
                        <td>{reservation.roomname || "N/A"}</td>
                        <td>
                          {checkinDate && checkoutDate
                            ? `${checkinDate.toLocaleDateString()} ~ ${checkoutDate.toLocaleDateString()}`
                            : "N/A"}
                        </td>
                        <td>{reservation.numguests}</td>
                        <td>{reservation.totalprice ? `${reservation.totalprice.toLocaleString()}원` : "N/A"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
    </div>
  );
};

export default HotelReservation;
