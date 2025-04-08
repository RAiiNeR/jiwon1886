import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import RequireAuth from '../comp/RequireAuth';

interface NotificationData {
  NUM: number;
  DNAME: string;
  TYPE: number;
  TITLE: string;
  NDATE: string;
}

const NotificationList: React.FC = () => {
  // 상태 변수: 공지사항 목록과 검색어
  const [notificationList, setNotificationList] = useState<NotificationData[]>([]);
  const [title, setTitle] = useState('');

  // 공지사항 목록을 가져오는 함수
  const getNotiList = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/noti`);
      setNotificationList(response.data.content);// 서버 응답 데이터를 상태에 저장
    } catch (error) {
      console.log(error);
    }
  }
  //공지사항 목록에 데이터를 가져옴
  useEffect(() => {
    getNotiList();
  }, []);

  const handleSearch = () => {

  }
  //날짜 포맷
  const changeDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
  //제목길이 제한
  const changeTitle = (title: string) => {
    if (title.length > 20) {
      return title.substring(0, 15) + ".....";//제목이 20자 초과하면 15자까지만 보임
    }
    return title;
  }
  //공지유형에 따른 표시
  const changeType = (type: number) => {
    if (type === 1) {
      return <div className='noti-type bg-danger text-white'>긴급</div>
    } else if (type === 2) {
      return <div className='noti-type bg-info'>일반</div>
    } else {
      return <div className='noti-type bg-success text-white'>조치</div>
    }
  }

  return (
    <RequireAuth>
      <div style={{ padding: "50px" }}>
        <div className="notification-List">
          <h1>공지사항</h1>

          <div className='mb-3 d-flex justify-content-between'>
            <div>
              {/* 검색 입력창 */}
              <input type='text' placeholder='검색어 입력' value={title} onChange={e => setTitle(e.target.value)} />
              <button className='btn' onClick={handleSearch}>검색</button>
            </div>

            <Link to="/noti/new" className='btn'>공지 등록</Link>
          </div>
          {/* 공지사항 목록 테이블 */}
          <table className="notification-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>게시부서</th>
                <th>작성일</th>
                <th>구분</th>
              </tr>
            </thead>
            <tbody>
              {/* 공지사항 목록 데이터를 테이블에 렌더링 */}
              {notificationList.map((item) => (
                <tr key={item.NUM}>
                  <td>{item.NUM}</td>
                  {/* 공지 제목 클릭 시 상세보기로 이동 */}
                  <td><Link to={`/noti/${item.NUM}`}>{changeTitle(item.TITLE)}</Link></td>
                  <td>{item.DNAME}</td>
                  <td>{changeDate(item.NDATE)}</td>
                  <td>{changeType(item.TYPE)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RequireAuth>
  );
}

export default NotificationList;