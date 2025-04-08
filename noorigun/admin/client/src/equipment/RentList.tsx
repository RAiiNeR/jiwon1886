import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RentList.css';
import { useNavigate } from 'react-router-dom';
import RequireAuth from '../comp/RequireAuth';

interface RentVO {
  RENTAL_ID: number;
  ID: string;
  RNAME: string;
  RCNT: number;
  RDATE: string;
}

const RentList: React.FC = () => {
  const [rentals, setRentals] = useState<RentVO[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 백엔드 API로 대여자 목록을 가져옵니다
    const getRentList = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/equipment/rentlist`);
        console.log(response.data)
        setRentals(response.data); // 가져온 데이터를 상태에 저장
      } catch (error) {
        console.error('대여자 목록을 가져오는 데 실패했습니다.', error);
      }
    };

    getRentList();
  }, []);

  const handleMainPageClick = () => {
    navigate('/noorigun/equipment');
  };

  // 날짜 포맷 변환
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }

  return (
    <RequireAuth>
      <div className="Rent">
        <h2>대여자 목록</h2>
        <table className="Renttable">
          <thead className="Rent-thead">
            <tr>
              <th>대여 번호</th>
              <th>대여 품목</th>
              <th>사용자 ID</th>
              <th>대여 수량</th>
              <th>대여 날짜</th>
            </tr>
          </thead>
          <tbody>
            {rentals.length > 0 ? (
              rentals.map((rental, index) => (
                <tr key={index}>
                  <td>{rental.RENTAL_ID}</td>
                  <td>{rental.RNAME}</td>
                  <td>{rental.ID}</td>
                  <td>{rental.RCNT}</td>
                  <td>{formatDate(rental.RDATE)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>대여자가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="EDbutton-container">
          <button className="EDmain-button" onClick={handleMainPageClick}>리스트로</button>
        </div>
      </div>
    </RequireAuth>
  )
}

export default RentList;