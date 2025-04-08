import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { updateHalfHeight } from '../Comm/CommomFunc';
import "../css/bus.css";
import { parseJwt } from '../Comm/jwtUtils';
import RequireAuth from '../Comm/RequireAuth';
//2025-02-26최의진 수정
interface BusTime {
  depPlaceNm: string;
  arrPlaceNm: string;
  depPlandTime: number;
  arrPlandTime: number;
  charge: number;
}

const BusReservation: React.FC = () => {
  const [data, setData] = useState<BusTime[]>([]);
  const navigate = useNavigate();
  const [isApplied, setIsApplied] = useState(false); // 신청 여부 상태
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]); // 선택된 좌석 배열
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userToken, setUserToken] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<Date | null>(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [sitnum, setSitnum] = useState("");


  //버스 정보 나오게 해주는 부분
  useEffect(() => {
    const busInfo = {
      depPlaceNm: params.get('depPlaceNm') || '',
      arrPlaceNm: params.get('arrPlaceNm') || '',
      depPlandTime: parseInt(params.get('depPlandTime') || '0', 10),
      arrPlandTime: parseInt(params.get('arrPlandTime') || '0', 10),
      charge: parseInt(params.get('charge') || '0', 10),
    };
    setData([busInfo]);
  }, [location.search]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage: ', token);  // token이 제대로 저장되어 있는지 확인
    if (token) {
      const userNum = parseJwt(token as string).num;
      setIsLoggedIn(true);
      setUserToken(userNum);
    } else {
      setIsLoggedIn(false);
      console.log("토큰이 없습니다. 로그인 후 다시 시도해 주세요.");
    }
  }, []);

  //버스 시간 format 해주는 부분  -> 시간 : 분 형식으로 출력됨
  const formatDate = (timestamp: number): string => {
    const hour = Math.floor((timestamp % 10000) / 100);
    const minute = timestamp % 100;
    return `${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`;
  };

  //기본 버스 정보 출력하기
  useEffect(() => {
    updateHalfHeight();
    window.addEventListener('resize', updateHalfHeight);
    return () => {
      window.removeEventListener('resize', updateHalfHeight);
    };
  }, [data]);


  // 좌석 클릭 이벤트 처리
  const handleSeatClick = (seatValue: string, event: React.MouseEvent) => {
    const updatedSeats = selectedSeats.includes(seatValue)
      ? selectedSeats.filter(seat => seat !== seatValue) // 이미 선택된 좌석을 클릭하면 선택 해제
      : [...selectedSeats, seatValue]; // 새 좌석을 클릭하면 선택

    setSelectedSeats(updatedSeats); // 상태 업데이트
  };

  //버스 예약하기
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const confirmApply = window.confirm('정말로 예약을 하시겠습니까?');
    if (!confirmApply) return;
    // 로컬 스토리지에서 JWT 토큰을 가져옴
    const token = localStorage.getItem('token');
    if (!token) {
      window.alert('로그인 후 신청이 가능합니다.');
      return;
    }
    try {
      const formData = new FormData()
      // data 배열에서 버스 정보 추출
      data.forEach(bus => {
        formData.append("departure", bus.depPlaceNm || '');  // 출발지
        formData.append("destination", bus.arrPlaceNm || '');  // 도착지
        formData.append("departureoftime", bus.depPlandTime.toString());  // 출발시간
        formData.append("destinationoftime", bus.arrPlandTime.toString());  // 도착시간
      });
      // 예약 날짜, 시간 정보 추가
      formData.append("schedule", schedule ? schedule.toISOString().split('T')[0] : ''); 
      // 예약 날짜 (yyyy-MM-dd)
      console.log(schedule ? schedule.toISOString().split('T')[0] : '')
      formData.append("membernum", `${userToken}`)
      // 좌석 선택된 것들 추가
      selectedSeats.forEach(seat => {
        formData.append("sitnum", seat);   // 선택된 좌석들
      });
      // 서버로 전송
      const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/busreservation/add`
        , formData, {
        // headers: {
        //   "Content-Type": "application/json",
        // }
      });
      console.log(response.data);
      setIsApplied(true);
      window.alert('신청이 되었습니다.');
      navigate("/traveler/home");
    } catch (error) {
      console.log('Error Message: ' + error);
      console.log("User Token: ", userToken);
      window.alert('오류발생. 다시 시도해 주세요.');
    }
  };

  //오류 발생시 나옴
  if (!data.length) {
    return <div>로딩중 ~</div>;
  }

  return (
    <RequireAuth>
    <div>
      <div className="js-halfheight mb-4 transport-Titleimg" style={{
        backgroundImage: 'url("../../../images/transport/trans1.jpg")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative', // 요소의 위치를 상대적으로 설정
        zIndex: -2,
      }}
      ></div>
      {data.map((bus, index) => (
        <div key={index} className='busdetail'>
          <table>
            <thead>
              <tr>
                <th>출발지</th>
                <th>도착지</th>
                <th>출발시간</th>
                <th>도착시간</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{bus.depPlaceNm}</td>
                <td>{bus.arrPlaceNm}</td>
                <td>{formatDate(bus.depPlandTime)}</td>
                <td>{formatDate(bus.arrPlandTime)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
      <div className="container">
        <div className="sidebar-wrap bg-light">
          <h3 className="heading mb-4">개인예약 정보</h3>
          <form onSubmit={handleSubmit}>
            <div className="fields">
              <div className="form-group">
              </div>
              <DatePicker
                selected={schedule}
                onChange={(date: Date | null) => setSchedule(date)}
                dateFormat="yyyy년 MM월 dd일"
                className="form-control"
                locale="ko"
                placeholderText="출발 날짜"
              />
              <div className="form-group">
                {/* 좌석 선택 UI 추가 */}
                <div className="form-group">
                  <h3 style={{ textAlign: "center" }}>좌석 선택</h3>
                  <div className="seat-wrapper">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-bus-front" viewBox="0 0 16 16">
                        <path d="M5 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0m8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-6-1a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2zm1-6c-1.876 0-3.426.109-4.552.226A.5.5 0 0 0 3 4.723v3.554a.5.5 0 0 0 .448.497C4.574 8.891 6.124 9 8 9s3.426-.109 4.552-.226A.5.5 0 0 0 13 8.277V4.723a.5.5 0 0 0-.448-.497A44 44 0 0 0 8 4m0-1c-1.837 0-3.353.107-4.448.22a.5.5 0 1 1-.104-.994A44 44 0 0 1 8 2c1.876 0 3.426.109 4.552.226a.5.5 0 1 1-.104.994A43 43 0 0 0 8 3" />
                        <path d="M15 8a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1V2.64c0-1.188-.845-2.232-2.064-2.372A44 44 0 0 0 8 0C5.9 0 4.208.136 3.064.268 1.845.408 1 1.452 1 2.64V4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v3.5c0 .818.393 1.544 1 2v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V14h6v1.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2c.607-.456 1-1.182 1-2zM8 1c2.056 0 3.71.134 4.822.261.676.078 1.178.66 1.178 1.379v8.86a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5V2.64c0-.72.502-1.301 1.178-1.379A43 43 0 0 1 8 1" />
                      </svg>
                    </div><h3>운전석</h3>
                    <h3 style={{ textAlign: 'right' }}>출입구</h3>
                    <hr />
                    {/* 좌석 렌더링 */}
                    {["A", "B", "C", "D", "E", "F", "G"].map((row, i) => (
                      <div className="seat-row" key={i}>
                        <div className="seat-pair">
                          {Array.from({ length: 2 }, (_, j) => {
                            const seatValue = `${row}${j + 1}`;
                            return (
                              <button
                                key={seatValue}
                                type="button"
                                className={`seat ${selectedSeats.includes(seatValue) ? "clicked" : ""}`}
                                onClick={(event) => handleSeatClick(seatValue, event)}
                                value={sitnum}
                              >
                                {seatValue}
                              </button>
                            );
                          })}
                        </div>
                        <div className="seat-pair">
                          {Array.from({ length: 2 }, (_, j) => {
                            const seatValue = `${row}${j + 3}`; // 3, 4 같은 좌석
                            if (seatValue === `${row}4`) return null
                            return (
                              <button
                                key={seatValue}
                                type="button"
                                className={`seat ${selectedSeats.includes(seatValue) ? "clicked" : ""}`}
                                onClick={(event) => handleSeatClick(seatValue, event)}
                              >
                                {seatValue}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <input
                  type="submit"
                  value="예약하기"
                  className="btn btn-primary py-3 px-5"
                  disabled={isApplied}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    </RequireAuth>
  );
};
export default BusReservation;