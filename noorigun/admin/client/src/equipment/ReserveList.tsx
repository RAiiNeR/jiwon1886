import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ReserveList.css';
import { useNavigate } from 'react-router-dom';
import RequireAuth from '../comp/RequireAuth';

interface ReserveVO {
  ROW_NUM: number;
  RNAME: string;
  ID: string;
  RECNT: number;
  EMAIL: string;
}

const ReserveList: React.FC = () => {
  const [reservations, setReservations] = useState<ReserveVO[]>([]);
  const [selectedItems, setSelectedItems] = useState<boolean[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getReserveList = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/equipment/reservelist`);
        console.log('예약 목록:', response.data);
        setReservations(response.data); // 가져온 데이터를 상태에 저장

        reservations.forEach((item) => {
          const selected: boolean[] = selectedItems;
          selected.push(false);
          setSelectedItems(selected);
        })
      } catch (error) {
        console.error('예약자 목록을 가져오는 데 실패했습니다.', error);
      }
    };

    getReserveList();
  }, []);

  const handleMainPageClick = () => {
    navigate('/noorigun/equipment');
  };

  // 선택된 항목에 대해 이메일 전송
  const handleSendEmail = async () => {
    if (selectedItems.length === 0) {
      alert('하나 이상의 예약을 선택해주세요.');
      return;
    }

    try {
      let i: number = 0;
      selectedItems.forEach((item) => {
        if (item) {
          sendEmail(reservations[i]);
        }
        i += 1;
      })
      alert('이메일이 성공적으로 전송되었습니다.');
    } catch (error) {
      console.error('이메일 전송 중 오류 발생', error);
      alert('이메일 전송 중 오류 발생');
    }
  };

  const sendEmail = async (item: ReserveVO) => {
    const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/equipment/sendmail`, {
      reuid: item.ID,
      itemId: item.RNAME,
      email: item.EMAIL
    });
  }

  return (
    <RequireAuth>
      <div className="RL">
        <h2>예약자 목록</h2>
        <table className="RLtable">
          <thead className="RL-thead">
            <tr>
              <th>선택</th>
              <th>예약 ID</th>
              <th>비품명</th>
              <th>예약 수량</th>
              <th>예약자 이름</th>
              <th>이메일</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length > 0 ? (
              reservations.map((reserve) => (
                <tr key={reserve.ID}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems[reserve.ROW_NUM - 1]}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const updatedSelectedItems = [...selectedItems]; // 기존 selectedItems 배열을 복사
                        updatedSelectedItems[reserve.ROW_NUM - 1] = e.target.checked; // 해당 항목을 업데이트
                        setSelectedItems(updatedSelectedItems); // 상태 업데이트
                      }}
                    />
                  </td>
                  <td>{reserve.ROW_NUM}</td>
                  <td>{reserve.RNAME}</td>
                  <td>{reserve.RECNT}</td>
                  <td>{reserve.ID}</td>
                  <td>{reserve.EMAIL}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>예약자가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="EDbutton-container">
          <button className="EDmain-button" onClick={handleMainPageClick}>리스트로</button>
        </div>
        <button className="EDmain-button" onClick={handleSendEmail}>
          이메일 전송
        </button>
      </div>
    </RequireAuth>
  );
};

export default ReserveList;

