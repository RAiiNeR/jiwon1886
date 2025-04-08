import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import { appear_animate, handleScroll, updateHalfHeight } from '../Comm/CommomFunc';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../css/transport.css'
//2025-02-13수정 최의진
const BusForm: React.FC = () => {
  const [departure, setDeparture] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [schedule, setSchedule] = useState<Date | null>(null);
  const location = useLocation(); // 현재 URL의 정보를 가져옵니다.
  const navigate = useNavigate()
  useEffect(() => {
    // 요소의 [data-scrollax] 옵션을 분석 적용
    handleScroll()
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // ftco-animate 클래스를 가진 요소에 등장 효과 적용
    appear_animate()
  }, []);

  useEffect(() => {
    updateHalfHeight();
    window.addEventListener("resize", updateHalfHeight);
    return () => {
      window.removeEventListener("resize", updateHalfHeight);
    };
  }, []);

  
  const handleBusClick = (event: React.FormEvent) => {
    event.preventDefault(); // 폼 제출 방지
  
    if (departure&&destination&&schedule) {
      const formattedDate = schedule.toISOString().split('T')[0]; // 날짜를 'YYYY-MM-DD' 형식으로 변환
      // 출발지와 도착지, 선택한 날짜를 쿼리 파라미터로 URL에 포함시켜 이동
      navigate(`/traveler/Transport/busForm/buslist?departure=${departure}&destination=${destination}departureDate=${formattedDate}`);
    } else {
      window.alert("출발일을 선택해주세요.");
    }
  };
  

  return (
    <div>
      <div className='js-halfheight mb-4 transport-Titleimg'
        style={{
          backgroundImage: "url('../images/transport/trans1.jpg')", 
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center', // 이미지 위치를 중앙에 맞추기
          position: 'relative', // 요소의 위치를 상대적으로 설정
          zIndex: -2,
        }}>

      </div>
      <div className="container">
        <div className="sidebar-wrap bg-light ftco-animate">
          {/* <h3 className="heading mb-4">가는 편 승차원 정보</h3> */}
          <form action="#" >
            <div className="fields">
            <div className="form-group">
                <div className="select-wrap one-third">
                  <div className="icon"><span className="ion-ios-arrow-down"></span></div>
                  <select name="" id="" className="form-control"
                  onChange={(e)=>setDeparture(e.target.value)}
                  value={departure}>
                  <option value="">출발지</option>
                  <option value="서울경부">서울경부</option>
                  <option value="센트럴시티(서울)">센트럴시티(서울)</option>
                  <option value="동서울">동서울</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <div className="select-wrap one-third">
                  <div className="icon"><span className="ion-ios-arrow-down"></span></div>
                  <select name="" id="" className="form-control"
                  onChange={(e) =>setDestination(e.target.value)} value={destination}>
                  <option value="">도착지</option>
                  <option value="부산">부산</option>
                  <option value="동대구">동대구</option>
                  <option value="전주고속터미널">전주고속터미널</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <DatePicker
                  selected={schedule}
                  onChange={(date: Date | null) => setSchedule(date)}
                  dateFormat="yyyy년 MM월 dd일" // 날짜 형식
                  className="form-control" // Bootstrap 스타일
                  locale="ko" // 로케일 설정
                  id="checkin_date"
                  placeholderText="가는날" // 플레이스홀더
                />
              </div>
              
            <div className="form-group">
                <div className="select-wrap one-third">
                  <div className="icon"><span className="ion-ios-arrow-down"></span></div>
                  <select name="" id="" className="form-control">
                    <option value="">등급</option>
                    <option value="">우등</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
              <input 
                type="submit" 
                value="조회하기" 
                className="btn btn-primary py-3 px-5" 
                onClick={handleBusClick} 
              />
            </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BusForm